var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./workwiki.db');

db.run("INSERT INTO users (ID, first_name, last_name, email) VALUES (null, 'John', 'Kinney', 'johnkinney77@gmail.com');");
db.run("INSERT INTO users (ID, first_name, last_name, email) VALUES (null, 'Gabby', 'Losch', 'nonsense@gmail.com');")

db.run("INSERT INTO articles (AID, title, date_made, image, user_id, content, category) VALUES (null, 'First Article', 'Wed Apr 15 2015', 'http://petattack.com/wp-content/uploads/2014/07/little_cute_cat_1920x1080.jpg', 1, 'Lorem ipsum dolor sit amet.','Cats');");
db.run("INSERT INTO articles (AID, title, date_made, image, user_id, content, category) VALUES (null, 'Second Article', 'Wed Apr 16 2015', 'http://thumbs.media.smithsonianmag.com//filer/cf/68/cf688a05-ac28-4770-ae69-92079b8c23cf/05_15_2014_darwin.jpg__800x600_q85_crop_subject_location-1699,2235.jpg', 2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor placerat turpis.', 'Beards');")




db.run("INSERT INTO changelog (CID, article_id, user_id, content_update, date_update) VALUES (null, 1, 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor placerat turpis, vitae aliquam est volutpat non. Suspendisse in posuere orci, nec pretium orci. Vivamus fringilla, lorem sed imperdiet mattis.','Wed Apr 15 2015');");
db.run("INSERT INTO changelog (CID, article_id, user_id, content_update, date_update) VALUES (null, 2, 2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor placerat turpis.','Wed Apr 16 2015');");
