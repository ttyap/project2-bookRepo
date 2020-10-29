const _ = require('lodash') 
const bookModel = require('../models/bookModel')
const bookRatingModel = require ('../models/bookRatingModel')
const { deleteOne } = require('../models/bookModel')

const bookListController = {

    listBooks: (req, res) => {
        // using the promise way
        bookModel.find()
            .then(results => {
                res.render('bookRepo/index', {
                    pageTitle: "Books in Repo",
                    pageHeader: "Books in Repo",
                    books: results
                })
            })
            .catch(err => {
                res.send(err)
            })

},
showBooks: (req, res) => {
    let slug = req.params.slug

    bookModel.findOne ({
        slug: slug
    })
        .then(result => {
            if (!result){
                res.redirect('/bookRepo')
                return
            }
            
                bookRatingModel.find ({
                    slug: result.slug
                })
                .then(ratingResults => {
                    res.render('bookRepo/show', {
                        pageHeader: result.title,
                        book: result,
                        ratings: ratingResults,
                        
                    })
                })
                
            
        })
        
    
    },

    createBook: (req, res) => {
        const slug = _.kebabCase(req.body.title)

        bookModel.create({
            title: req.body.title,
            slug: slug,
            author: req.body.author,
            publish_year: req.body.publish_year,
            synopsis: req.body.synopsis,
            image: req.body.img_url
        })
            .then(result => {
                res.redirect('bookrepo/')
            })
            .catch(err => {
                console.log(err)
                
            })
    },
    showEditForm: (req, res) => {

        if(!req.session || !req.session.user) {
            
            res.redirect('/user/login')
            return
        }

        

        bookModel.findOne ({
            slug: req.params.slug
        })
            
        
            .then(editResult => {
                if (!editResult) {
                    res.redirect('bookrepo')
                    return
                }
                res.render ('user/edit', {
                    pageHeader: "Edit",
                    pageTitle: "Edit " + editResult.title,
                    book: editResult
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    updateBook: (req, res) => {
        const newSlug = _.kebabCase(req.body.title)
        
        
        bookModel.update(
            {
                slug: req.params.slug
            },
            {
                title: req.body.title,
                slug: newSlug,
                author: req.body.author,
                publish_year: req.body.publish_year,
                synopsis: req.body.synopsis,
                image: req.body.img_url
            }
        )
            .then(result => {
                if (result) {
                    
                    res.redirect('/bookrepo')
                }
                
            })
            .catch(err => {
                res.send(err)
            })
    }
  
}

module.exports = bookListController