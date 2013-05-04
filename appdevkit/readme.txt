Application Development Kit:
This directory includes a set of bash scripts that will help you
create an application from the basic taakapp template.

Please see the full instructions in doc/INSTALL.TXT 
This readme.txt will just describe the scripts

1. setup.sh

- This script is used once to setup the directory and files for the ninthdrug webserver
- Settings read from /conf/taakapp.conf
- If the taakapp.conf has been rename to othername.conf; the script will prompt for other conf
- install.dir by default is /opt/ninthdrug

2. dbadmin.sh 

- This script is menu-based wizard to interact with a postgres database
- Use 1 arg if the db user and database are the same : ./dbadmin.sh <dbname>
- Use 2 args if the db user and database are different: ./dbadmin.sh <dbname> <dbuser>
- Menu Option mt) will create the db user then the database
- Menu Option dd) will drop the database
- Menu Option ct) will create the tables (from sql/create_tables.sql)
- Menu Option dt) will drop the tables   (from sql/drop_tables.sql)
- Menu Option desc) will generate the sql/db.description file to be used by daogenerator.sh

3. daogenerator.sh 

- This file is used to generate the data object scala code for each database table
- It refers to the daogenerator.conf for package name, app name and the source file
- Usage: ./daogenerator.sh <table>
- This will generate the <table>.scala and <table>Cache.scala in the build dir
- Use publishdaocode.sh to copy the scala files to the src tree; then repeat for each table

4. publishdaocode.sh

- This script copies the generated scala code in build to src/main/scala/<package name>




