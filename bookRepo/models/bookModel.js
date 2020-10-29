const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true,
        

    },
    publish_year: {
        type: Number,
        
    },
    synopsis: {
        type: String,
        max: 2000
        
    },
    image: String,

    created_at: {
        type: Date,
        required: true,
        default: Date.now

    },

    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }

    
},

)

const bookModel = mongoose.model('books', bookSchema)

module.exports = bookModel