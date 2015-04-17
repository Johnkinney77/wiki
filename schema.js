var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./workwiki.db');


db.run("CREATE TABLE users (ID INTEGER PRIMARY KEY, first_name_author varchar, last_name_author varcher, email varchar);");
db.run("CREATE TABLE articles (AID INTEGER PRIMARY KEY, title varchar, date_made real, image varchar, author_id integer, content text, category varchar, FOREIGN KEY(author_id) REFERENCES users(ID));");
db.run("CREATE TABLE changelog (CID INTEGER PRIMARY KEY, first_name_editor varchar, last_name_editor varchar, content_update text, date_update real, article_id varchar, editor_id varchar,  FOREIGN KEY(article_id) REFERENCES articles(AID), FOREIGN KEY(editor_id) REFERENCES users(ID));");
