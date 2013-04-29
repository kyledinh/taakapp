#!/bin/sh

rm build/*.scala

LIBS=""
for JAR in /opt/ninthdrug/lib/*.jar
do
  LIBS=$LIBS:$JAR
done
exec /opt/scala/bin/scala -save -cp $LIBS "$0" "$@"
!#
 
import java.io.File
import java.net.URL
import java.util.Date
import java.util.logging.Level
import java.util.logging.LogManager
import ninthdrug.logging._
import scala.io.Source
import scala.io.Source.fromFile

case class Field (table:String , column_name: String, data_type: String ) {
    val class_type = mapType(data_type)
}

def makeField(_name:String, _type:String): Field = {
    return new Field(CLASS_NAME.trim, _name.trim, _type.trim)
}

def parseProperties(filename: String): Map[String,String] = {
    val lines = fromFile(filename).getLines.toSeq
    val cleanLines = lines.map(_.trim).filter(!_.startsWith("#")).filter(_.contains("="))
    cleanLines.map(line => { val Array(a,b) = line.split("=",2); (a.trim, b.trim)}).toMap
}

def parseDbDescription(filename: String, table: String) :Seq[Field] = {
    val currentTable = "";
    val lines = fromFile(filename).getLines.toSeq
    val cleanLines = lines.map(_.trim).filter(!_.startsWith("(")).filter(_.contains(table)).filter(!_.startsWith("table_name")).filter(_.contains("|"))
    val abc = cleanLines.map(line => { line.split("[|]",3) }).toSeq
    abc.map(los => (makeField(los(1),los(2))))
}

/* makes the class name singular if the table name has trailing 's'; then capitalize */
def getClassName(str: String) :String = {
     if (str.endsWith("s")) {
         return str.substring(0, str.length-1).capitalize
     }
     str.capitalize
}

def getQuestionMark(f: Field):String = "?"

/*
* This script will generate the base Class and Cache class for a db table 
*/

val TABLE_NAME =  args(0).toLowerCase              /* flyers     */
val CLASS_NAME = getClassName(TABLE_NAME)          /* Flyer     */
val PRV_LIST = "_" + CLASS_NAME.toLowerCase + "s"  /* _flyers   */
val PUB_LIST = CLASS_NAME.toLowerCase + "s"        /* flyers    */
val cfgKeys = parseProperties("daogenerator.conf")
val PACKAGE = cfgKeys("package")
val DBDESCFILE = cfgKeys("db.description.file")
val DB = cfgKeys("db")

val mapType = Map(("character varying","String"),
                    ("boolean","Boolean"),
                    ("timestamp without time zone","Timestamp"),
                    ("integer","Int"))

val fields = parseDbDescription(DBDESCFILE, TABLE_NAME)

val fa = new FileAppender("build/" +CLASS_NAME+ ".scala")
fa.appendln("package " + PACKAGE)
fa.appendln("")
fa.appendln("import java.sql.Timestamp")
fa.appendln("import ninthdrug.util.Json.quote")
fa.appendln("import ninthdrug.util.Util.formatTimestamp")
fa.appendln("")

fa.appendln("case class " + CLASS_NAME +"(")
fa.appendln(fields.map( f => "  " + f.column_name  +  ": " + f.class_type + "" ).mkString(", \n"))
fa.appendln(") {")

fa.appendln("  def json() = {")
fa.appendln("    \"{ \" + ")

val s = fields.map {
  f => {
    "    quote(\"" + f.column_name + "\")" + " + \":\" + " + {
       f.class_type match {
         case "String"    => "quote(" + f.column_name + ") +"
         case "Timestamp" => "quote(formatTimestamp(" + f.column_name + ")) +"
         case _           => f.column_name + " +"
       }
     }
   }
}.mkString(" \", \" + \n")
fa.appendln(s)

fa.appendln("    \"} \"")
fa.appendln("  }")
fa.appendln("}")
fa.appendln("")

fa.appendln("object " + CLASS_NAME + " {")
fa.appendln("")
fa.appendln("  def apply(")
fa.appendln(fields.filter(_.column_name != "id").map((f => ("    " + f.column_name  +  ": " + f.class_type + ""))).mkString(", \n"))
fa.appendln("  ): " + CLASS_NAME + " = {")
fa.appendln("    new " + CLASS_NAME + "(")
fa.appendln(fields.map((f => if (f.column_name != "id") {("      " + f.column_name  )}  else {"      0"} )).mkString(", \n"))
fa.appendln("    )")
fa.appendln("  }")
fa.appendln("}")

val fc = new FileAppender("build/" +CLASS_NAME+ "Cache.scala")
fc.appendln("package " + PACKAGE)
fc.appendln("")
fc.appendln("import java.sql._")
fc.appendln("import ninthdrug.config._")
fc.appendln("import ninthdrug.sql._")
fc.appendln("import ninthdrug.util.Base64")
fc.appendln("import ninthdrug.util.Crypto")
fc.appendln("")

fc.appendln("object " +CLASS_NAME+ "Cache {")
fc.appendln("")
fc.appendln("  private var db: Database = null")
fc.appendln("  private var " +PRV_LIST+ "  = List[" +CLASS_NAME+ "]()")
fc.appendln("  load()")
fc.appendln("")
fc.appendln("  def load() {")
fc.appendln("    val dburl = Config.get(\"" +DB+".dburl\")")
fc.appendln("    val dbuser = Config.get(\"" +DB+".dbuser\")")
fc.appendln("    val dbpass = Config.get(\"" +DB+".dbpassword\")")
fc.appendln("    db = Database(dburl, dbuser, dbpass)")
fc.appendln("")
fc.appendln("    " +PRV_LIST+ " = {")
fc.appendln("      db.list[" +CLASS_NAME+ "](\"SELECT * FROM " +TABLE_NAME+ " WHERE active = 't' \") {")
fc.appendln("        (rs: ResultSet) => " +CLASS_NAME+ "(")
fc.appendln(fields.map((f => ("          rs.get" + f.class_type  +  "(\"" + f.column_name + "\")"))).mkString(", \n"))
fc.appendln("        )")
fc.appendln("      }")
fc.appendln("    }")
fc.appendln("  }")
fc.appendln("")
fc.appendln("  def " +PUB_LIST+ " = " +PRV_LIST)
fc.appendln("")
fc.appendln("  def get"+CLASS_NAME+"(id: Int): "+CLASS_NAME+" = {")
fc.appendln("    "+PRV_LIST+".find(_.id == id) match {")
fc.appendln("      case None => throw new java.util.NoSuchElementException(")
fc.appendln("        \"key not found: \" + id")
fc.appendln("      )")
fc.appendln("      case Some("+CLASS_NAME.toLowerCase+") => " + CLASS_NAME.toLowerCase)
fc.appendln("    }")
fc.appendln("  }")
fc.appendln("")
fc.appendln("  def has"+CLASS_NAME+"(id: Int): Boolean = {")
fc.appendln("    "+PRV_LIST+".exists(_.id == id)")
fc.appendln("  }")
fc.appendln("")
fc.appendln("  def add"+CLASS_NAME+"("+CLASS_NAME.toLowerCase+":"+CLASS_NAME+") {")
fc.appendln("    db.execute(")
fc.append(  "      \"INSERT INTO " +TABLE_NAME+ " (")
fc.append(fields.filter(_.column_name != "id").map(_.column_name).mkString(", "))
fc.append(" ) VALUES (")
fc.append(fields.filter(_.column_name != "id").map(getQuestionMark(_)).mkString(", "))
fc.appendln(")\", ")
fc.appendln(fields.filter(_.column_name != "id").map(CLASS_NAME.toLowerCase+"."+_.column_name).mkString(", "))
fc.appendln("    )")
fc.appendln("    load()")
fc.appendln("  }")
fc.appendln("")
fc.appendln("  def update"+CLASS_NAME+"("+CLASS_NAME.toLowerCase+":"+CLASS_NAME+") {")
fc.appendln("    db.execute(")
fc.append(  "      \"UPDATE " +TABLE_NAME+ " SET ")
fc.append(fields.map(_.column_name +"=? ").mkString(", "))
fc.append(" WHERE id=?\" ,")
fc.append(fields.map(CLASS_NAME.toLowerCase + "." + _.column_name).mkString(", "))
fc.appendln(", " + CLASS_NAME.toLowerCase +".id")
fc.appendln("    )")
fc.appendln("    load()")
fc.appendln("  }")
fc.appendln("")
fc.appendln("  def delete"+CLASS_NAME+"(id: Int) {")
fc.appendln("    db.delete(\"DELETE FROM " +TABLE_NAME+ " WHERE id=?\", id)")
fc.appendln("    load()")
fc.appendln("  }")
fc.appendln("}")
fc.appendln("")





