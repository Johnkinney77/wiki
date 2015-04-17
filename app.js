var express = require('express');
var sqlite3 = require('sqlite3');
var mustache = require('mustache');
var fs = require('fs');

var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var db = new sqlite3.Database('./workwiki.db')
var app = express();

app.use(methodOverride('_method'))
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static('./static'));


app.get('/', function (req, res) {
	var template = fs.readFileSync('./views/index.html', 'utf8');
  db.all('SELECT ID, first_name_author, last_name_author, AID, title, date_made FROM users, articles WHERE users.ID = articles.author_id', function (error, articles) {
      var html = mustache.render(template, {allArticles: articles});
      res.send(html);
  });
});

app.get('/sign-up', function (req, res) {
  var html = fs.readFileSync('./views/signup.html', 'utf8');
  res.send(html)
});

app.post('/sign-up', function (req, res) {
  var user = req.body

  db.run("INSERT INTO users (ID, first_name_author, last_name_author, email) VALUES (null, '" + user.first_name + "', '" + user.last_name + "', '" + user.email + "');");
  res.redirect('/');
});

app.get('/article/new', function (req, res) {
  var template = fs.readFileSync('./views/newArticle.html', 'utf8');
  db.all("SELECT * FROM users", function (error, author) {
    var html = mustache.render(template, {authors: author});
    res.send(html);
  });
});

app.post('/article/create', function (req, res) {
  var date = new Date().toString().split(' ').splice(0, 5).join(' ');
  var articleInfo = req.body;
  var author = req.body.author.split(' ');

  db.all("SELECT ID FROM users WHERE first_name_author='" + author[0] + "' AND last_name_author='" + author[1] + "';", function (error, authorID) {
    
    console.log(authorID);

    db.run("INSERT INTO articles (AID, title, date_made, image, author_id, content, category) VALUES (null, '" + articleInfo.title +"', '" + date + "', '" + articleInfo.url + "', " + authorID[0].ID + ", '" + articleInfo.content + "', '" + articleInfo.category + "');");

    db.all("SELECT AID FROM articles WHERE title='" + articleInfo.title + "';", function (error, articleID) {
      db.run("INSERT INTO changelog (CID, first_name_editor, last_name_editor, content_update, date_update, article_id,editor_id) VALUES (null, '" + author[0] + "', '" + author[1] + "', '" + articleInfo.content + "', '" + date + "', " +articleID[0].AID + ", " + authorID[0].ID + ");");

      res.redirect('/' + articleInfo.title);
    });
  });
});

app.get('/:articleName', function (req, res) {
  var title = req.params.articleName;
  var template = fs.readFileSync('./views/individualArticle.html', 'utf8');
  db.all("SELECT * FROM users, articles, changelog WHERE users.ID = articles.author_id AND articles.AID = changelog.article_id AND articles.title='" + title + "';", function (error, individualArticle) {
      var length = individualArticle.length - 1
      var html = mustache.render(template, individualArticle[length]);
      res.send(html);
  });
});

/*ID, first_name_author, last_name_author, email, AID, title, date_made, image, content, category, CID, date_update, content_update*/

app.get('/:articleName/edit', function (req, res) {
  var title = req.params.articleName;
  var template = fs.readFileSync('./views/editArticle.html', 'utf8');
  db.all("SELECT * FROM users, articles, changelog WHERE title='" + title +"' AND articles.author_id = ID AND changelog.article_ID = AID;", function (error, data) {
    /*var inbetween = mustache.render(template, data[0]);
    console.log(inbetween)*/
    db.all("SELECT first_name_author, last_name_author FROM users", function (error, author) {
      data[0].list = author
      var html = mustache.render(template, data[0]);
      res.send(html);

    });
  });
});

app.post('/:articleName/save', function (req, res) {
    var body = req.body;
    var date = new Date().toString().split(' ').splice(0, 5).join(' ');
    var author = body.author.split(' ');
    db.all("SELECT AID FROM articles WHERE title='" + body.title + "';", function (error, articleID) {
      db.all("SELECT ID FROM users WHERE first_name_author='" + author[0] + "' AND last_name_author='" + author[1] + "';", function (error, userID) { 
        db.run("INSERT INTO changelog (CID, first_name_editor, last_name_editor, content_update, date_update, article_id, editor_id) VALUES (null, '" + author[0] + "', '" + author[1] + "', '" + body.content_update + "', '" + date + "', " + articleID[0].AID + ", " + userID[0].ID + ");");
        db.run("UPDATE articles SET content='" + body.content_update + "' WHERE AID=" + articleID[0].AID + ";")
        res.redirect('/' + body.title);
      });
    });
});

app.get('/:articleName/changelog', function (req, res) {
  var title = req.params.articleName;
  db.all("SELECT * FROM articles WHERE title='" + title + "';", function (error, articleData) {
    var AID = articleData[0].AID
    db.all("SELECT * FROM changelog WHERE article_id=" + AID + ";", function (error, changelogData) {
      articleData[0].changelog = changelogData;
    res.send(articleData);
    });
  });
});





app.listen(3000, function () {
	console.log("listening on port 3000");
});