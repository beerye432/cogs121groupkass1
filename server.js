// Node.js Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const handlebars = require('express-handlebars');
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const passport = require('passport')
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

var models = require('./models');


require('dotenv').config();

require("dotenv").load();
var models = require("./models");
var db = mongoose.connection;

var router = { 
	  index: require("./routes/index"),
    sport: require("./routes/sport"),
    chat: require("./routes/chat"),
    fac: require("./routes/fac")
};

var parser = {
    body: require("body-parser"),
    cookie: require("cookie-parser")
};

var strategy = { 
	twitter: require('passport-twitter').Strategy
};
// Database Connection
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/cogs121');
db.on('error', console.error.bind(console, 'Mongo DB Connection Error:'));
db.once('open', function(callback) {
    console.log("Database connected successfully.");
});

// session middleware
var session_middleware = session({
    key: "session",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: db })
});

// Middleware
app.set("port", process.env.PORT || 3000);
app.engine('html', handlebars({ defaultLayout: 'layout', extname: '.html' }));
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use(parser.cookie());
app.use(parser.body.urlencoded({ extended: true }));
app.use(parser.body.json());
app.use(require('method-override')());
app.use(session_middleware);

/* TODO: Passport Middleware Here*/
app.use(passport.initialize());
app.use(passport.session());

/* TODO: Use Twitter Strategy for Passport here */
passport.use(new strategy.twitter({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    models.User.findOne({ "twitterID": profile.id }, function(err, user) {
    if(err){
    	return done(err);
    }

    if(!user) {
		// (2) since the user is not found, create new user.
		var newUser = new models.User({
		    "twitterID": profile.id,
		    "token": token,
		    "name": profile._json.name,
		    "displayName": profile._json.screen_name,
		    "photo": profile._json.profile_image_url
		});

   		newUser.save(function(err, data){
   			if(err){
   				console.log(err);
   			}else{
   				console.log("User added: " + data);
   			}
   		});
   		return done(null, profile);
    } else {
        // (3) since the user is found, update user’s information
        user.twitterID = profile.id;
        user.token = token;
        user.name = profile._json.name;
        user.displayName = profile._json.screen_name;
        user.photo = profile._json.profile_image_url;

        user.save(function(err, data){
   			if(err){
   				console.log(err);
   			}else{
   				console.log("User updated: " + data);
   			}
   		});
        process.nextTick(function() {
            return done(null, profile);
        });
    }
  });
  }
));

/* TODO: Passport serialization here */
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/sport',
                                     failureRedirect: '/' }));
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

app.get("/", router.index.view);
app.get("/sport", loggedIn, router.sport.view);
app.get("/chat", loggedIn, router.chat.view);
app.get("/chat/:id", loggedIn, router.chat.view);
app.get("/fac", loggedIn, router.fac.view);
app.get("/fac/:id", loggedIn, router.fac.view);

app.get("/getChat", loggedIn, router.chat.getChatData)
app.get("/getChat/:id", loggedIn, router.chat.getChatData)


io.use(function(socket, next) {
    session_middleware(socket.request, {}, next);
});

/* TODO: Server-side Socket.io here */
io.on('connection', function(socket){
  console.log('user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  function makeChannel(key) {
    return function(msg) {
        var user = socket.request.session.passport.user;

        var newMessage = {
                            'user': {
                              'displayName': user._json.screen_name,
                              'photo': user._json.profile_image_url
                            },
                            'message': msg,
                            'posted': Date.now()
                          };

        models.SportsFeed.findOne({ "sport": key }, function(err, channel) {
          if(err) console.log(err);
          if(!channel) {
            var newSportsFeed = new models.SportsFeed({
                          'sport': key,
                          'messages' : [newMessage]
            });

            newSportsFeed.save(function(err, data){
              if(err){
                console.log(err);
              }else{
                io.emit(key, JSON.stringify(newMessage));
              }
            });
          } else {
              channel.messages.push(newMessage);

              channel.save(function(err, data){
                if(err){
                  console.log(err);
                }else{
                  io.emit(key, JSON.stringify(newMessage));
                }
              });
          }
        });
        
    };
  };

  const sports = ["basketball", "badminton", "jogging", "ultimate_frisbee", "tennis", "volleyball"];
  for(var i=0; i<sports.length; i++){
    socket.on(sports[i], makeChannel(sports[i]));
  }
})


// Start Server
http.listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});
