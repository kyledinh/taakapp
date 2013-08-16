TaakApp 
-------
This is a template app for the Ninthdrug Scala webserver. You can download and build the ninthdrug.jar from source at https://github.com/ninthdrug/ninthdrug or use the one included in this repo. There's an "appdevkit" directory that has a collection of bash scripts to help you install and update your app.

* [Video Demo](http://youtu.be/WM95ZEbDL9o)

[![VIDEO](http://img.youtube.com/vi/WM95ZEbDL9o/0.jpg)](http://www.youtube.com/watch?v=WM95ZEbDL9o)

Requirements
------------
* linux server
* java jdk version 1.6
* ant version 1.8
* scala version 2.10 - http://www.scala-lang.org/
*  ninthdrug.jar - https://github.com/ninthdrug/ninthdrug

Options
-------
* postgresql
* sudo rights to postgres user

Configuration
-------------
* Edit the conf/taakapp.conf
* This config file can be renamed, just update to build.xml (<property file="conf/taakapp.conf"/>)
* Edit the appdevkit/daogenerator.conf
* properties: package name, app name and the source file
* Edit .ninthdrug to reference ninthdrug.conf and taakapp.conf in <install.dir>/conf/
* Edit start_webserver
* Run setup.sh

Database
--------
* dbadmin.sh (md) 
* dbadmin.sh (ct)
* [Postgres Notes](https://github.com/kyledinh/toolkit/wiki/Postgres)

Code Generator
--------------
* Use dbadmin.sh (desc) to generate db.description
* Run the daogenerator.sh <tablename> for each table
* Publish code to src directory with publishdaocode.sh

Edit Source Code
----------------
* Customize src/web/alpha
* Customize src/main/scala

Build and Deploy
----------------
* Invoke ant
* Invoke ant deploy
* Run <install.dir>/bin/start_webserver

Default Setup
-------------
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

References
----------


Notes
-----
The daogenerator.sh is written for tables with these two required fields. "active" should
be defaulted to true.

  -id Int
  -active Boolean

License
-------
Copyright 2013 Kyle Dinh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
