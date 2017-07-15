var express     = require('express')
var app         = express()
var bodyParser  = require('bodyParser')
var morgan      = require('morgan')
var mongoose    = require('mongoose')

var jwt         = require('jwtwebtoken')
var config      = require('./config')
var user        = require('./app/models/user')


var port        = process.env.PORT || 8080
mongoose.connect(config.database)
app.set('superSecret', config.secret)


app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json())

app.use(morgan('dev'));

app.get('/', function(request, response) {
    res.send("The API is at http://localhost:" + port + '/api');
});


app.listen(port);
console.log('Magic happens at http://localhost:' + port)
