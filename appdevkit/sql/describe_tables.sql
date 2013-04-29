SELECT table_name, column_name, data_type   
FROM information_schema.columns 
WHERE table_catalog ='taak' AND table_schema = 'public';
