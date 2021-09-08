create table remittanceCheck(
id int(11) auto_increment primary key,
group_id int(11) not null,
req_user_id int(11) not null,
master_id int(11) not null,
foreign key (group_id) references ottGroup(id)
on delete cascade,
foreign key (req_user_id) references users(id)
on delete cascade);