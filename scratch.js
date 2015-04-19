var request = require('request');

request.get('http://127.0.0.1:3000/Cats', function(err, res, body){
  console.log(body);
});