const _ = require('lodash') 
const userModel = require('../models/userModel')
const uuid = require('uuid')
const SHA256 = require ('crypto-js/sha256')
const bookList = require('../models/bookList')
const userBookListModel = require('../models/userBookListModel')
const { result } = require('lodash')
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')
const bookListController = require('./bookListController')

const userController = {

    registerUser: (req, res) => {

        res.render ('user/register', {

            pageTitle: "Register to create your own bookRepo",
            pageHeader: "Register",

        } )
    },

    registeredUser: (req, res) => {

        userModel.findOne ({
            email: req.body.email
        })
            .then (result => {
                
                if(result) {
                    res.flash('error', 'Email registered, please login ')
                            }

                // generate uuid as salt
                const salt = uuid.v4()
                const combination = salt + req.body.password

                // hash the combination using SHA256
                const hash = SHA256(combination).toString()

                // create user in DB
                userModel.create({
                    first_name: req.body.firstName,
                    last_name: req.body.lastName,
                    email: req.body.email,
                    pwsalt: salt,
                    hash: hash
                })
                    .then(createResult => {
                        res.redirect('/bookRepo')
                    })
                    .catch(err => {
                        res.redirect('/user/register')
                    })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/user/register')
            })
    },

    loginPage: (req, res) => {
        
        res.render('user/login', {            
            pageTitle: "Login to bookRepo",
            pageHeader: "Login",
            
        })
    },    
    
    userLogin: (req, res) => {

        userModel.findOne({
            email: req.body.email
        })
        .then(result => {

            if (!result) {
                
                res.flash('error', 'Incorrect email, try again!')
                
                res.redirect('/user/login')
                return
            }

        const hash = SHA256(result.pwsalt + req.body.password).toString()

           if (hash !== result.hash){
            
            res.flash('error', 'Incorrect password, try again!')
            res.redirect ('/user/login')
               
               return
           }
           res.flash('welcome', 'Welcome to bookRepo! ')
           req.session.user = result
          
           res.redirect('/bookrepo')

        })
        .catch(err => {
           console.log(err)
           res.redirect('/user/login')
        })
    },

    userDashboard: (req,res) => {

       
        if(!req.session || !req.session.user) {
            
            res.redirect('/user/login')
            return
        }

        res.redirect('/bookrepo/')
    },
    

    addNewBook : (req, res) => {

        if(!req.session || !req.session.user) {
            
            res.redirect('/user/login')
            return
        }
        res.render('user/new', {
            pageTitle: "Add your favourite book to bookRepo",
            pageHeader: "Add new book"
        })

    },

    userBookList : (req,res) => {
        // get req.body.bookId
        // validate that bookId is not empty

        bookModel.findOne({
            _id: req.body.bookId
        })
        .then (bookDoc => {
            // validate that bookId exists in books collection
            // if not exists, redirect back to dashboard
            if (!bookDoc) {
                res.redirect ('user/booklist')
                return
            }

            // Find user's booklist
            userBookListModel.findOne ({
                email: req.session.user.email

            })
            .then (userListDoc => {
                if (!userListDoc) {
                    // if not found, then create new booklist
                    userBookListModel.create({
                        email: req.session.user.email,
                        bookList: [{
                            book_id: bookDoc.id,
                            title: bookDoc.title,
                            slug: bookDoc.slug,
                            author: bookDoc.author,
                            image: bookDoc.image
                        }]
                    })
                    .then(createResult => {
                        // create successful, redirect back to user dashboard
                        res.redirect('/user/booklist')
                    })
                } else {
                    // check if bookDoc already added to userlist
                    let found = userListDoc.bookList.find(item => {
                        return item.book_id.toString() === bookDoc._id.toString()
                    })

                    if (found) {
                        res.redirect('/user/booklist')
                        return
                    }

                    // update the user's current booklist by appending to bookList array
                    userBookListModel.updateOne(
                        {
                            email: req.session.user.email
                        },
                        {
                            $push: {
                                bookList: {
                                    book_id: bookDoc.id,
                                    title: bookDoc.title,
                                    slug: bookDoc.slug,
                                    author: bookDoc.author,
                                    image: bookDoc.image
                                }
                            }
                        }
                    )
                    .then(updateResult => {
                        res.redirect('/user/booklist')
                    })

                    
                 
                    
                }
            })

                .catch(err => {
             res.redirect('/bookrepo')
         })
         
        })
        

    },

            userBookListShow: (req,res) => {
            
                userBookListModel.findOne ({
                    email: req.session.user.email
                    })
                    .then (booklistresult => {
                        if(booklistresult) {
                        res.render('user/userbooklist', {
                        pageHeader: "My bookRepo",
                        pageTitle: "My bookRepo",
                        myBooks: booklistresult.bookList
       
                    })}
                    else {
                        res.render('user/userbooklist', {
                        pageHeader: "My bookRepo",
                        pageTitle: "My bookRepo",
                        myBooks: null
                        })
                    }
                })
                        

    },
            removeBook: (req, res) => {
                let slug = req.params.slug
                    userBookListModel.updateOne (
                        {},
                        {$pull:{bookList:{slug:slug}}}
                    )
                    
                
                    .then(removeResult => {
                        
                        if (removeResult) {
                            
                            res.redirect('/user/booklist')
                            return
                        
                        
                    }
                    
                })
                
                .catch(err => {
                    console.log('error')
                    res.send(err)
                })
            
    },

                logoutUser: (req,res) => {
                req.session.destroy()
                res.redirect('/user/login')

}


    

}

module.exports = userController