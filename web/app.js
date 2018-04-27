var express               = require("express"),
    app                   = express(),
    mongoose              =require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bodyParser            = require("body-parser");
    mongoose.connect("mongodb://localhost/bookit");
    app.use(express.static("public"));
     app.use(methodOverride("_method"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine","ejs");
    //require ends here 
    //schemas starts here
    var userSchema=new mongoose.Schema({
    username:String,
    password:String
});
  var bookSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    indate:String,
    outdate:String
});

app.use(require("express-session")({
    secret: "Comfort Stay",
    resave: false,
    saveUninitialized: false
}));
userSchema.plugin(passportLocalMongoose)
var User=mongoose.model("User",userSchema);
var Book=mongoose.model("Book",bookSchema);   
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
app.use(function(req,res,next){
        res.locals.cUser=req.user;
        next();
    });
    
    
    
    
    
    // routes starts here
    
     app.get("/login",function(req,res){
        res.render("login");
    });
    app.get("/register",function(req,res){
        res.render("signup");
    });

    app.post("/register",function(req, res){
        
    User.register(new User({username: req.body.username}),req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/random");
        });
    });
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/random",
    failureRedirect: "/login"
}) ,function(req, res){
});
app.get("/logout", function(req, res){
    
    console.log("logged out");
    req.logout();
    res.redirect("/login");
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    
  res.redirect("/login");

}

``
    app.get("/",function(req,res){
        res.render("home");
    });
    app.get("/random",isLoggedIn,function(req,res){
        User.find({},function(err,u){
            if(err){
                console.log("something went wrong");
            }else{
                    res.render("random",{user: u}); 
            }
        });
   
    });
    app.get("/random/novotel",isLoggedIn,function(req,res){
       res.render("novotel"); 
    });
     app.get("/random/novotel/gallery",isLoggedIn,function(req,res){
       res.render("ngallery"); 
    });
    app.get("/random/book",isLoggedIn,function(req,res){
        res.render("book");
    });
    app.post("/random/book",function(req,res){
       Book.create(req.body.book,function(err,b){
          if(err) {
              console.log("something went wrong");
          }else{
              res.render("cnf",{data: b});
          }
       });
    });
    app.get("/cnf",isLoggedIn,function(req, res) {
       res.render("cnf"); 
    });
    app.get("/random/payment",isLoggedIn,function(req,res){
       res.render("payment");
    });
app.listen(8080,function(){
    console.log("comfortstay");
    
});

