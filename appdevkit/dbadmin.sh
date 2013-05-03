#!/bin/sh

if [ -z "$1" ]; then
	echo "** USAGE: $0 (database/user) **"
	echo "example: $0 taak"
	exit 1
fi

dbname=$1
dbuser=$1

if [ -e "$2" ]; then
	dbuser=$2
fi

echo "Postgres Menu:"
echo " ct) create tables"
echo " dt) drop tables"
echo " md) make database & user"
echo " dd) drop database"
echo " desc) describe tables"

read choice;
 
case $choice in
ct)
	echo "creating tables"
	psql $dbname $dbuser -h localhost < sql/create_tables.sql
	;;

dt)
	echo "dropping tables"
	psql $dbname $dbuser -h localhost < sql/drop_tables.sql
	;;
	
md)
	echo "create $dbuser user"
	sudo psql -h localhost -u postgres createuser \
    --no-superuser \
    --no-createdb \
    --no-createrole \
    --pwprompt \
    $dbuser 

	echo "create $dbname database"
	sudo psql -h localhost -u postgres createdb --owner $dbuser $dbname
	;;
	
dd)	
	echo "dropping $dbname database"
	psql taak taak -h localhost -c "DROP DATABASE '$dbname';" 
	;;
	
desc)
	echo "describing the tables"
	psql taak taak -h localhost -o sql/db.description -c "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_catalog ='$dbname' AND table_schema = 'public';" 
	;;	
	
*)
	echo "** WRONG CHOICE, USAGE: ct | dt | md | dd | desc **"
	;;
esac
exit 1

