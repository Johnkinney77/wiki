var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./workwiki.db');

db.run("INSERT INTO users (ID, first_name_author, last_name_author, email) VALUES (null, 'John', 'Kinney', 'johnkinney77@gmail.com');");
db.run("INSERT INTO users (ID, first_name_author, last_name_author, email) VALUES (null, 'Gabby', 'Losch', 'nonsense@gmail.com');")

db.run("INSERT INTO articles (AID, title, date_made, image, author_id, content, category) VALUES (null, 'First Article', 'Wed Apr 15 2015', 'http://petattack.com/wp-content/uploads/2014/07/little_cute_cat_1920x1080.jpg', 1, 'Lorem ipsum dolor sit amet.','Cats');");
db.run("INSERT INTO articles (AID, title, date_made, image, author_id, content, category) VALUES (null, 'Second Article', 'Wed Apr 16 2015', 'http://thumbs.media.smithsonianmag.com//filer/cf/68/cf688a05-ac28-4770-ae69-92079b8c23cf/05_15_2014_darwin.jpg__800x600_q85_crop_subject_location-1699,2235.jpg', 2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor placerat turpis.', 'Beards');")




db.run("INSERT INTO changelog (CID, first_name_editor, last_name_editor, content_update, date_update, article_id, editor_id) VALUES (null, 'John', 'Kinney', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor placerat turpis, vitae aliquam est volutpat non. Suspendisse in posuere orci, nec pretium orci. Vivamus fringilla, lorem sed imperdiet mattis.','Wed Apr 15 2015', 2, 1);");
db.run("INSERT INTO changelog (CID, first_name_editor, last_name_editor, content_update, date_update, article_id, editor_id) VALUES (null, 'Gabby', 'Losch', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor placerat turpis, vitae aliquam est volutpat non. Suspendisse in posuere orci, nec pretium orci. Vivamus fringilla, lorem sed imperdiet mattis.','Wed Apr 15 2015', 1, 2);");
