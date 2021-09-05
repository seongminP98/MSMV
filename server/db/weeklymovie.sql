CREATE TABLE weeklymovie (
	movieCd int(20) not null,
    count int(10),
    primary key (movieCd)
);
  
SET GLOBAL event_scheduler = ON; 
DELIMITER $$
CREATE EVENT IF NOT EXISTS Copy
    ON SCHEDULE
       EVERY 1 WEEK STARTS '2021-07-28 00:00:00'
    ON COMPLETION PRESERVE
    ENABLE
    COMMENT 'make a copy'
    DO
	  BEGIN
		  TRUNCATE TABLE weeklymovie;
		  INSERT INTO weeklymovie SELECT * FROM moviecount;
		  TRUNCATE TABLE moviecount;
	  END$$
DELIMITER ;