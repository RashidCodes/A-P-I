const express = require('express')
const app = express();
const port = 3000;
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')

// Middleware
//cors
app.use(cors())

//body parser
app.use(bodyParser.json())

const postsRoute  = require('./routes/posts');

// posts middleware
app.use('/posts', postsRoute)

// routes
app.get('/', (req, res) => {
    res.send("we are on the home url")
})



// try to connect to the db
mongoose.connect(process.env.DB_CONNECTION, {
     useNewUrlParser: true,
     useUnifiedTopology: true
}, (err) => {
    if(err){
        console.log("there was an error")
        return;
    }

    console.log("Successfully connected to DB")
})


// start listening to the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})



