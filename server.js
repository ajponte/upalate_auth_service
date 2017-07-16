var express     = require('express')
var app         = express()
var bodyParser  = require('body-parser')
var morgan      = require('morgan')
var mongoose    = require('mongoose')

var jwt         = require('jsonwebtoken')
var config      = require('./config')
var User        = require('./app/models/users')


var port        = process.env.PORT || 8080
mongoose.connect(config.database)
app.set('superSecret', config.secret)


app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json())

app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send("The API is at http://localhost:" + port + '/api');
});

app.get('/setup', function(req, res) {
    var admin = new User({
        name: "Admin",
        password: 'password',
        admin: true
    });

    admin.save(function(err) {
        if(err) {
            throw err;
        }

        console.log("User saved successfully.");
        res.json({success: true});
    });
 });

var apiRoutes = express.Router();

apiRoutes.get('/', function(req, res) {
    res.json({message: 'API started.'});
});

apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
        name: req.body.name
        }, function(err, user) {
            if (err) {
                throw err;
            }
            if (!user) {
                res.json({ success: false, message: 'Authentication failed.  User not found.'});
            } else if(user) {
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed.  Wrong password.'});
                } else {
                    // If user is found and password is right, create an auth token.
                    var token = jwt.sign(user, app.get('secret'), {
                        expiresInMinutes:1440
                    });
                    res.json({
                        success: true,
                        message: 'Token successfully generated.',
                        token: token
                    });
                }
            }
        });
});


app.use('/api', apiRoutes);


app.listen(port);
console.log('Server started at http://localhost:' + port)
