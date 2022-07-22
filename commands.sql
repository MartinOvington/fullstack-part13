CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0 
);

insert into blogs (author, url, title, likes) values ('John', 'www.coolblog.com', 'Cool blog', 15);
insert into blogs (author, url, title, likes) values ('Tom', 'www.niceblog.com', 'Nice blog', 8);