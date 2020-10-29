// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const flash = require('express-flash-2');
const methodOverride = require('method-override')
const bookListController = require('./controllers/bookListController')
const bookRatingController = require('./controllers/bookRatingController')
const userController = require ('./controllers/userController')
const mongoose = require('mongoose')
const bookModel = require('./models/bookModel')
const app = express();
const port = 7000;

// =======================================
//              MONGOOSE
// =======================================
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose.set('useFindAndModify', false)

// =======================================
//              EXPRESS SETUP
// =======================================
// sets template engine to use
app.set('view engine', 'ejs')

// tells Express app where to find our static assets
app.use(express.static('public'))

// tells Express app to make use of the imported method-override library
app.use(methodOverride('_method'))

// tells Express app to parse incoming form requests,
// and make it available in req.body
app.use(express.urlencoded({
  extended: true
}))

// session package //
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: "app_session",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } // 3600000ms = 3600s = 60mins, cookie expires in an hour
}))


// session flash
app.use(flash());

app.use(setUserVarMiddleware)


// =======================================
//              ROUTES
// =======================================
app.get('/', bookListController.listBooks) // index
app.get('/bookrepo/:slug', bookListController.showBooks) // show
app.post('/bookrepo/:slug/ratings', bookRatingController.createRating) // create rating
app.get('/user/new', userController.addNewBook)// new
app.post('/bookrepo', bookListController.createBook) // create route

app.get('/user/:slug/edit', bookListController.showEditForm) // edit route


// ** Registration **
app.get('/user/register',  userController.registerUser) // registration 
app.post('/user/register', userController.registeredUser) // registration post

//** Login **
app.get('/user/login', userController.loginPage) // login form 
app.post('/user/login', userController.userLogin) // login 

//** User **
app.get('/user/booklist', authenticationMiddleware, userController.userBookListShow) // user booklist
app.post('/user/booklist', authenticationMiddleware, userController.userBookList) // user dashboard

//** Logout **
app.post('/user/logout', authenticationMiddleware, userController.logoutUser) // user logout

// update route
app.patch('/bookrepo/:slug', bookListController.updateBook) // update route


app.delete('/bookrepo/:slug', userController.removeBook) // delete route


// =======================================
//              LISTENER
// =======================================
mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    // DB connected successfully
    console.log('DB connection successful')

    app.listen(process.env.PORT || port, () => {
      console.log(`bookRepo listening on port: ${port}`)
    })
  })
  .catch(err => {
    console.log(err)
  })

  function guestOnlyMiddleware (req, res, next) { //
    if( req.session && req.session.user) {
      res.redirect('/user/dashboard')
      return
    }
    next ()
  }

function authenticationMiddleware (req, res, next) { //
    if( !req.session || !req.session.user) {
        res.redirect('/user/login')
        return
    }
    next ()
  }

function setUserVarMiddleware (req, res, next) { //

    //default user template var set to null
    res.locals.user = null

    // check if req.session.user is set,
    // if set, template user var will be set as well

    if (req.session && req.session.user) {
      res.locals.user = req.session.user
    }

    next()

  }

