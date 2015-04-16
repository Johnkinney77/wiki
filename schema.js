var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./workwiki.db');


db.run("CREATE TABLE users (ID INTEGER PRIMARY KEY, first_name varchar, last_name varcher, email varchar);");
db.run("CREATE TABLE articles (AID INTEGER PRIMARY KEY, title varchar, date_made real, image varchar, user_id integer, content text, category varchar, FOREIGN KEY(user_id) REFERENCES users(ID));");
db.run("CREATE TABLE changelog (CID INTEGER PRIMARY KEY, article_id varchar, user_id varchar, content_update text, date_update real, FOREIGN KEY(article_id) REFERENCES articles(AID), FOREIGN KEY(user_id) REFERENCES users(ID));");
