create table usermovie(
id int(11) auto_increment primary key,
user_id int(11),
movieCd int(20),
foreign key (user_id) references users(id)
on delete cascade);