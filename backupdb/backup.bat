@echo off
set DB_NAME=Qnect
set DB_USER=postgres
set BACKUP_DIR=C:\qnect\backupdb
set DATE=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_FILE=%BACKUP_DIR%\%DB_NAME%_%DATE%.sql

pg_dump -U %DB_USER% -F c -b -v -f "%BACKUP_FILE%" %DB_NAME%
