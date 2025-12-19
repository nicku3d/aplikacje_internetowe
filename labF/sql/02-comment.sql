create table comment (
                         id integer not null
                             constraint comment_pk
                                 primary key autoincrement,
                         post_id integer not null,
                         content text not null,
                         constraint comment_post_fk
                             foreign key (post_id)
                                 references post(id)
                                 on delete cascade
);