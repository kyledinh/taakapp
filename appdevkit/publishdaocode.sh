#!/bin/bash

CONF=daogenerator.conf

if [ -f $CONF ];
then 
	echo "Using the $CONF "
else
	echo "Configuration file $CONF not found"
	exit 1
fi	

APP_NAME=`sed '/^\#/d' ../conf/$CONF | grep 'app.name'  | tail -n 1 | cut -d "=" -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'`

cp build/*.scala ../src/main/scala/$APP_NAME/

