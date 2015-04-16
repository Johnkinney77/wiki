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
  db.all('SELECT ID, first_name, last_name, AID, title, date_made FROM users, articles WHERE users.ID = articles.user_id', function (error, articles) {
      var html = mustache.render(template, {allArticles: articles});
      res.send(html);
  });
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

  db.all("SELECT ID FROM users WHERE first_name='" + author[0] + "' AND last_name='" + author[1] + "';", function (error, userID) {
    console.log(userID);
    db.run("INSERT INTO articles (AID, title, date_made, image, user_id, content, category) VALUES (null, '" + articleInfo.title +"', '" + date + "', '" + articleInfo.url + "', " + userID[0].ID + ", '" + articleInfo.content + "', '" + articleInfo.category + "');");

    db.all("SELECT AID FROM articles WHERE title='" + articleInfo.title + "';", function (error, articleID) {
      db.run("INSERT INTO changelog (CID, article_id, user_id, content_update, date_update) VALUES (null, " + articleID[0].AID + ", " + userID[0].ID + ", '" +  articleInfo.content + "', '" + date + "');");

      res.redirect('/' + articleInfo.title);
    });
  });
});

app.get('/:articleName', function (req, res) {
  var title = req.params.articleName;
  var template = fs.readFileSync('./views/individualArticle.html', 'utf8');
  db.all("SELECT ID, first_name, last_name, email, AID, title, date_made, image, content, category, CID, date_update, content_update FROM users, articles, changelog WHERE users.ID = articles.user_id AND articles.AID = changelog.article_id AND articles.title='" + title + "';", function (error, individualArticle) {
      console.log(individualArticle)
      var html = mustache.render(template, individualArticle[0]);
      res.send(html);
  });
});

app.get('/:articleName/edit', function (req, res) {
  var title = req.params.articleName;
  var template = fs.readFileSync('./views/editArticle.html', 'utf8');
  db.all("SELECT * FROM articles, users WHERE title='" + title +"' AND user_id = ID;", function (error, data) {
    var html = mustache.render(template, data[0]);
    res.send(data);
  });

});





app.listen(3000, function () {
	console.log("listening on port 3000");
});