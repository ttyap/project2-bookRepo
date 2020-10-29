
const mongoose = require('mongoose')

const bookRatingSchema = new mongoose.Schema({

    user: {
        type: String
    },
    product_id: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
       
    },
    rating: {
        type: Number, min: 1 , max: 5,
        required: true
    },
    comment: {
        type: String, max: 300
    },
    created_at: {
        type: Date,
        required: true,
        default: Date

    },

    
})

const bookRatingModel = mongoose.model('bookRating', bookRatingSchema)

module.exports = bookRatingModel
