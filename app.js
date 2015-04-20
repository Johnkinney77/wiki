var express = require('express');
var sqlite3 = require('sqlite3');
var mustache = require('mustache');
var fs = require('fs');

var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var sendgrid = require('sendgrid')('', '');
var marked = require('marked');

var db = new sqlite3.Database('./workwiki.db')
var app = express();

//middleware
app.use(methodOverride('_method'))
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));

//files accessable to the outside users
app.use(express.static('./static'));

//marked settings
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

//home page
app.get('/', function (req, res) {
	var template = fs.readFileSync('./views/index.html', 'utf8');
  db.all('SELECT ID, first_name_author, last_name_author, AID, title, date_made FROM users, articles WHERE users.ID = articles.author_id ORDER BY date_made DESC;', function (error, articles) {
      //mustache rendering
      var html = mustache.render(template, {allArticles: articles});
      res.send(html);
  });
});


//sign up page
app.get('/sign-up', function (req, res) {
  var html = fs.readFileSync('./views/signup.html', 'utf8');
  res.send(html)
});


//sign up function to create new user
app.post('/sign-up', function (req, res) {
  var user = req.body
  db.run("INSERT INTO users (ID, first_name_author, last_name_author, email) VALUES (null, '" + user.first_name + "', '" + user.last_name + "', '" + user.email + "');");
  res.redirect('/');
});

app.get('/search', function (req, res) {
  var searchReq = req.query;
  var template = fs.readFileSync('./views/index.html', 'utf8')
  db.all("SELECT * FROM articles LEFT JOIN users ON users.id = articles.author_id WHERE content LIKE '%" + searchReq.search + "%' OR category LIKE '%" + searchReq.search + "%' OR title LIKE '%" + searchReq.search + "%' ORDER BY date_made " + searchReq.sort + ";", function (error, results) {
    var html = mustache.render(template, {allArticles: results})
    res.send(html);
  });
});
/*first_name_author WHERE article.author_id = users.ID;
*/
//email, not working yet need to be authorized
app.get('/email/:userName', function (req, res) {
  var template = fs.readFileSync('./views/emailTemplate.html', 'utf8');
  var author = req.params.userName.split(' ');
  db.all("SELECT * FROM users WHERE first_name_author='" + author[0] + "' AND last_name_author='" + author[1] + "';", function (error, userData) {
    db.all("SELECT first_name_author, last_name_author FROM users", function (error, list) {
      userData[0].list = list;
      var html = mustache.render(template, userData[0])
    

      res.send(html);
    });
  });
});

app.post('/email/:userName', function (req, res) {
  var author = req.params.userName.split(' ');
  var emailInfo = req.body
  var emailer = req.body.user.split(' ');
  db.all("SELECT * FROM users WHERE first_name_author='" + author[0] + "' AND last_name_author='" + author[1] + "';", function ( error, authorInfo) {
    db.all("SELECT * FROM users WHERE first_name_author='" + emailer[0] + "' AND last_name_author='" + emailer[1] + "';", function ( error, emailerInfo) {
      //sendgrid params for sending to a user
      var email = new sendgrid.Email({
        to:       authorInfo[0].email,
        from:     emailerInfo[0].email,
        subject:  emailerInfo.subject,
        text:     emailerInfo.message
      });

      sendgrid.send(email, function(err, json) {
        if (err) { return console.error(err); }
        console.log(json);
      });
      res.redirect('/')
    });
  });
});

//creating a new article
app.get('/article/new', function (req, res) {
  var template = fs.readFileSync('./views/newArticle.html', 'utf8');
  db.all("SELECT * FROM users", function (error, author) {
    //mustache rendering
    var html = mustache.render(template, {authors: author});
    res.send(html);
  });
});


//creating new article
app.post('/article/create', function (req, res) {
  var date = new Date().toString().split(' ').splice(0, 5).join(' ');
  var articleInfo = req.body;
  var author = req.body.author.split(' ');

  //Getting ID from users table that matches name
  db.all("SELECT ID FROM users WHERE first_name_author='" + author[0] + "' AND last_name_author='" + author[1] + "';", function (error, authorID) {
    //inserting new article into articles table
    db.run("INSERT INTO articles (AID, title, date_made, image, author_id, content, category) VALUES (null, '" + articleInfo.title +"', '" + date + "', '" + articleInfo.url + "', " + authorID[0].ID + ", '" + articleInfo.content + "', '" + articleInfo.category + "');");

    //getting articles ID number 
    db.all("SELECT AID FROM articles WHERE title='" + articleInfo.title + "';", function (error, articleID) {

      //duplicating into the first changelog as the original creation
      db.run("INSERT INTO changelog (CID, first_name_editor, last_name_editor, content_update, date_update, article_id, editor_id) VALUES (null, '" + author[0] + "', '" + author[1] + "', '" + articleInfo.content + "', '" + date + "', " + articleID[0].AID + ", " + authorID[0].ID + ");");

      res.redirect('/');
    });
  });
});


//viewing indiidual article
app.get('/articles/:articleName', function (req, res) {
  var title = req.params.articleName;
  var template = fs.readFileSync('./views/individualArticle.html', 'utf8');


  //getting infor for each
  db.all("SELECT * FROM users, articles, changelog WHERE users.ID = articles.author_id AND articles.AID = changelog.article_id AND articles.title='" + title + "';", function (error, individualArticle) {

      //finding length of all the changes so it grabs the latest ones values
      var lastValue = individualArticle.pop();
 
      //turning content into marked content
      lastValue.content_marked = marked(lastValue.content);

      //mustache rendering
      var html = mustache.render(template, lastValue);
      res.send(html);
  });
});

/*ID, first_name_author, last_name_author, email, AID, title, date_made, image, content, category, CID, date_update, content_update*/

//editing an article
app.get('/articles/:articleName/edit', function (req, res) {
  var title = req.params.articleName;
  var template = fs.readFileSync('./views/editArticle.html', 'utf8');

  //getting info from the article wheres name matches
  db.all("SELECT * FROM users, articles, changelog WHERE title='" + title +"' AND articles.author_id = ID AND changelog.article_ID = AID;", function (error, data) {

    //getting users first and last name so person can say who edited it
    db.all("SELECT first_name_author, last_name_author FROM users", function (error, author) {
      data = data.pop();
      data.list = author
      var html = mustache.render(template, data);
      res.send(html);

    });
  });
});

//saving article edit
app.post('/articles/:articleName/save', function (req, res) {
    var body = req.body;
    var date = new Date().toString().split(' ').splice(0, 5).join(' ');
    var author = body.author.split(' ');

    //getting articles id
    db.all("SELECT AID FROM articles WHERE title='" + body.title + "';", function (error, articleID) {

      //getting id of user
      db.all("SELECT ID FROM users WHERE first_name_author='" + author[0] + "' AND last_name_author='" + author[1] + "';", function (error, userID) { 

        //inserting new change into changelog for the article
        db.run("INSERT INTO changelog (CID, first_name_editor, last_name_editor, content_update, date_update, article_id, editor_id) VALUES (null, '" + author[0] + "', '" + author[1] + "', '" + body.content_update + "', '" + date + "', " + articleID[0].AID + ", " + userID[0].ID + ");");

        //updating the content of the artcile in the articles table to be current
        db.run("UPDATE articles SET content='" + body.content_update + "', image='" + body.image + "' WHERE AID=" + articleID[0].AID + ";")
        res.redirect('/articles/' + body.title);
      });
    });
});

//getting changelog list
app.get('/articles/:articleName/changelog', function (req, res) {
  var title = req.params.articleName;
  var template = fs.readFileSync('./views/changelogList.html', 'utf8');

  //getting information that matches link by matching the titles
  db.all("SELECT * FROM articles WHERE title='" + title + "';", function (error, articleData) {
    var AID = articleData[0].AID

    //getting all the changelog info
    db.all("SELECT * FROM changelog WHERE article_id=" + AID + ";", function (error, changelogData) {
      articleData[0].changelog = changelogData;
      var html = mustache.render(template, articleData[0]);
    res.send(html);
    });
  });
});


//viewing an update from the past in changelog
app.get('/articles/:articleName/changelog/:date_update', function (req, res) {
  var title = req.params.articleName;
  var date_update = req.params.date_update;
  var template = fs.readFileSync('./views/changelogIndividual.html', 'utf8');

  //getting information of article where title matches
  db.all("SELECT * FROM articles WHERE title='" + title + "';", function (error, articleData) {
    var AID = articleData[0].AID

    //getting all change logs for that particular article ID
    db.all("SELECT * FROM changelog WHERE article_id=" + AID + " AND date_update='" +date_update + "';", function (error, changelogData) {
      articleData[0].changelog = changelogData;

      //turning content into marked content
      articleData[0].content_marked = marked(articleData[0].changelog[0].content_update);

      var html = mustache.render(template, articleData[0]);
      res.send(html)
    });
  });
});





app.listen(3000, function () {
	console.log("listening on port 3000");
});