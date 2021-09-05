create table moviecount(
    movieCd int(20) NOT NULL,
    count int(10),
    PRIMARY KEY(movieCd)
);

-- SET GLOBAL event_scheduler = ON; 
-- DELIMITER $$
-- CREATE EVENT IF NOT EXISTS CopyCount
--     ON SCHEDULE
--        EVERY 1 DAY STARTS '2021-07-01 00:00:00'
--     ON COMPLETION PRESERVE
--     ENABLE
--     COMMENT 'make a copy'
--     DO
-- 	  BEGIN
-- 		  TRUNCATE TABLE todaymovie;
-- 		  INSERT INTO todaymovie SELECT * FROM moviecount;
-- 		  TRUNCATE TABLE moviecount;
-- 	  END$$
-- DELIMITER ;