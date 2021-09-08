create table userGroup(
id int(11) auto_increment primary key,
group_id int(11) not null,
user_id int(11) not null,
authority varchar(10) not null,
created timestamp default now(),
remittance boolean default 0,
foreign key (group_id) references ottGroup(id)
on delete cascade,
foreign key (user_id) references users(id)
on delete cascade);