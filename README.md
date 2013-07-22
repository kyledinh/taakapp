## TAAKAPP 
This is a template app for the Ninthdrug Scala webserver. You can download and build the ninthdrug.jar from source at https://github.com/ninthdrug/ninthdrug or use the one included in this repo. There's an "appdevkit" directory that has a collection of bash scripts to help you install and update your app.

[Video Tutorial](http://youtu.be/4Y3x2uriPhU)

## Requirements

* linux server
* java jdk version 1.6
* ant version 1.8
* scala version 2.10 - http://www.scala-lang.org/
*  ninthdrug.jar - https://github.com/ninthdrug/ninthdrug

## Options

* postgresql
* sudo rights to postgres user

## Configuration

* Edit the conf/taakapp.conf
* This config file can be renamed, just update to build.xml (<property file="conf/taakapp.conf"/>)
* Edit the appdevkit/daogenerator.conf
* properties: package name, app name and the source file
* Edit .ninthdrug to reference ninthdrug.conf and taakapp.conf in <install.dir>/conf/
* Edit start_webserver
* Run setup.sh

## Database

* dbadmin.sh (md) 
* dbadmin.sh (ct)
* [Postgres Notes](https://github.com/kyledinh/toolkit/wiki/Postgres)

## Code Generator
 
* Use dbadmin.sh (desc) to generate db.description
* Run the daogenerator.sh <tablename> for each table
* Publish code to src directory with publishdaocode.sh

## Edit Source Code

* Customize src/web/alpha
* Customize src/main/scala

## Build and Deploy

* Invoke ant
* Invoke ant deploy
* Run <install.dir>/bin/start_webserver
 

## Default Setup
```
~/.ninthdrug
     /opt/ninthdrug/conf/ninthdrug.conf
     /opt/ninthdrug/conf/<taakapp>.conf
     
/opt/ninthdrug/bin/start_webserver
/opt/ninthdrug/conf/ninthdrug.conf
/opt/ninthdrug/conf/<taakapp>.conf
/opt/ninthdrug/lib/*.jar
/opt/ninthdrug/log/ninthdrug.log
/opt/ninthdrug/websites/<taakapp>/
```

## References



## Notes

The daogenerator.sh is written for tables with these two required fields. "active" should
be defaulted to true.

  -id Int
  -active Boolean


