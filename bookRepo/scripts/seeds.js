require('dotenv').config()
const mongoose = require('mongoose')
const bookData = require('../models/bookList')
const bookModel = require('../models/bookModel')

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`

mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    console.log('MongoDB connection successful')
  })
  .then(response => {
    bookModel.insertMany(bookData)
        .then(insertResponse => {
            console.log('Data seeding successful')
        })
        .catch(insertErr => {
            console.log(insertErr)
        })
        .finally(() => {
            mongoose.disconnect()
        })
  })
  .catch(err => {
    console.log(err)
  })
