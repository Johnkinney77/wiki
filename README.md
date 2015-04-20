#Work Wiki
Work Wiki was developed to solve the clients problem of allowing their employees to share and create information easily between one another. To allow the employees to be able to write on another emails easily with out leaving the program. And to create a log of information as it changed and evolved.

###Link To Live Version
http://104.236.60.122:3000/

##Wiki Features
####Home Page
![Home Page](/homepage.jpg)
The home page of wiki has a list of all the articles, defaulted to be ordered from newest to oldest.
- You can search the articles and it will return all relevant.
- If you are not a user you can sign up by clicking the top button
- Once you are a user you can Create New Articles

####New Article Creation
![New Article](/newArticle.jpg)
Creating a new article is as simple as saying who you are, adding the title, a url link to an appropriate image, the content, and a category.

####Article Page
![New Article](/article.jpg)
Articles look like this when they are created.

####Changelog
![New Article](/Changelog.jpg)
You can see a changelog of each article and reference back to each change.

####Emailing the Author
![New Article](/email.jpg)
You can also email the original author to ask any questions you may need to.

##Wiki's Structure
####Wire Frame
![Wire Frame](/IMG_0347.jpg)
####Data Structure
![Data Structure](/IMG_0345.jpg)


##API's & Modules
#####API - Marked
In Work Wiki, we used Marked, to allow users to easily create beautiful pages. Marked allows for different sized headers, bolding, italicizing, creating bullets and lists and a few other clutch features.
#####API - SendGrid
SendGrid is what allows Work Wiki's users to send emails easily and efficiently.

##### Module - Express
Express is the platform we used in conjunction with NODEjs to create an easily to maintain and develop server.
##### Module - SQLite3
SQLite3 is what we used to communicate with the database where all the information is contained.
##### Module - FS
FS is what we used to read the template html files.
##### Module - Mustache
Mustache is what we used to fill all the information, that we took from our database using SQLite3, into our html template files that we are grabbing using FS.
##### Module - Method Override
Method Override is what we used to override certain methods that are restricted with in the browser. The browser only allows us to Read and Create information, sometimes we want Delete or Update information. That is where Method Override comes in.
##### Module - Body Parser
Body Parser is what we used to grab information that the user sent us, when they wanted to update or create something.
##### Module - Morgan
Morgan is what we used to help us debug our application. It lists everything that happens through text on our terminal

##Download and run on you local computer
1. Go to https://github.com/Johnkinney77/wiki
2. Create a GitHub account if you do not have one.
3. At https://github.com/Johnkinney77/wiki click the "Clone To Desktop" button on the bottom left hand corner of the screen.
4. Open up your terminal navigate to the folder named wiki
5. Type into your terminal in this order:
  - `sudo apt-get install nodejs`
  - `sudo apt-get install nodejs-legacy`
  - `sudo apt-get install npm`
6. Then type in `npm install`
7. Now type into your terminal `node app.js` with in your wiki folder
8. Open up your browers and type in `localhost:3000`, and you are good to go!
