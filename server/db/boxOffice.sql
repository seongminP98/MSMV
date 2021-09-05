create table boxoffice(
id int(11) NOT NULL AUTO_INCREMENT primary key,
movierank int(11),
name varchar(30),
movieCd int(20),
image text);

DELIMITER $$
CREATE EVENT IF NOT EXISTS DropBoxoffice
    ON SCHEDULE
       EVERY 1 DAY STARTS '2021-07-01 00:00:05'
    ON COMPLETION PRESERVE
    ENABLE
    COMMENT 'Truncate boxoffice'
    DO
	  BEGIN
		  TRUNCATE TABLE boxoffice;
	  END$$
DELIMITER ;