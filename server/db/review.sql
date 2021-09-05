create table review(
id int(11) NOT NULL AUTO_INCREMENT,
commenter int(11) NOT NULL,
contents text,
created timestamp default NOW(),
updated timestamp default NOW(),
rate float(2,1),
movieCd int(20) NOT NULL,
movieTitle varchar(100),
primary key(id),
foreign key(commenter) references users(id)
on delete cascade);