const _ = require('lodash') 
const bookModel = require('../models/bookModel')
const bookRatingModel = require('../models/bookRatingModel')
const { deleteOne } = require('../models/bookModel')

const bookRatingController = {


    createRating: (req, res) => {
        let slug = req.params.slug

        

        bookModel.findOne({
            slug: slug
        })
            .then(result =>{
                bookRatingModel.create({
                    user: req.session.user.first_name,
                    product_id: result._id,
                    slug: result.slug,
                    title: req.body.product_name,
                    rating: req.body.rating,    
                    comment: req.body.comments,
                  
                    
                })  

                .then(result => {
                    res.redirect('/bookrepo/' + slug)
                })
                
            })
            
      
        .catch(err => {
            res.redirect('/bookrepo')
        })
            
    }
}
                   

module.exports = bookRatingController
