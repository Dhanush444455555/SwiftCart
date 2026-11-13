@echo off
title TiDB Cloud Console - SwiftCart
color 0B
echo ========================================================
echo         Connecting to TiDB Cloud (SwiftCart Database)
echo ========================================================
echo.
echo Type your SQL queries here. For example:
echo   SELECT id, name, price FROM products LIMIT 5;
echo   INSERT INTO products ...
echo   EXIT;
echo ========================================================
echo.

mysql -u "nfGig79oo2Esd4c.root" -h gateway01.ap-northeast-1.prod.aws.tidbcloud.com -P 4000 -p4FxE8VUu96oEb2wU --ssl-mode=REQUIRED -D swiftcart
