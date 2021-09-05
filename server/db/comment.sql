create table comment(
id int(11) NOT NULL AUTO_INCREMENT primary key,
commenter int(11) NOT NULL,
group_id int(11) NOT NULL,
contents text,
created timestamp default NOW(),
foreign key(commenter) references users(id)
on delete cascade,
foreign key(group_id) references ottGroup(id)
on delete cascade);