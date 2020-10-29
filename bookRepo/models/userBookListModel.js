const mongoose = require('mongoose')
const BookModel = require('./bookModel')

const userBookListSchema =  new mongoose.Schema({

    email: {

        type: String,
        
    },

    bookList: [{
        book_id: {
            type: mongoose.Types.ObjectId,
            ref: "books"
        },
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
            required: true
        },
        image: {
            type: String,
            required: true
        }
        
    }],

    rating: Number
})

const userBookListModel = mongoose.model('userBookList', userBookListSchema)

module.exports = userBookListModel