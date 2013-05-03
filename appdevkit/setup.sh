#!/bin/bash
CONF=taakapp.conf

if [ -f ../conf/$CONF ];
then 
	echo "Using the $CONF "
else
	echo "Configuration file not found"
	echo "Please enter your configuration file to use: (look in ../conf/ ) "
	read choice;
	CONF=$choice
	if [ -f ../conf/$CONF ];
	then 
		echo "Using the $CONF "
	else
		echo "Not valid conf file, exiting script"
		exit 1
	fi	
fi	

#sed command to get install.dir property from taakapp.conf; cuts at "=" and trims whitespaces
#default install.dir is /opt/ninthdrug
INSTALL_DIR=`sed '/^\#/d' ../conf/$CONF | grep 'install.dir'  | tail -n 1 | cut -d "=" -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'`
APP_NAME=`sed '/^\#/d' ../conf/$CONF | grep 'app.name'  | tail -n 1 | cut -d "=" -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'`

echo "Installation Ninthdrug to $INSTALL_DIR"

mkdir -p $INSTALL_DIR/bin
mkdir -p $INSTALL_DIR/conf
mkdir -p $INSTALL_DIR/lib
mkdir -p $INSTALL_DIR/log
mkdir -p $INSTALL_DIR/scriptcache
mkdir -p $INSTALL_DIR/websites

cp ../lib/*.jar $INSTALL_DIR/lib/
cp ../conf/$CONF $INSTALL_DIR/conf/
cp start_webserver $INSTALL_DIR/bin/

echo "Installation Done. Look in $INSTALL_DIR."
