## HOW TO CREATE A RESTful API with Node, Express and MongoDB

### CONNECT TO THE DATABASE HOSTED ON MLAB
Firstly, we need to install a mongodb driver - **mongoose**

```bash
npm install mongoose
```

And now, connect to the database. However before that, install dotenv to manage environment variables in a .env file.
```bash
npm install dotenv
```

```bash
require('dotenv/config');
mongoose.connect(process.env.DB_CONNECTION, (err) => {
    if(err){
        console.log(err);
        return;
    }

    console.log('Successfully connected to DB')
})
```



### CREATE THE EXPRESS INSTANCE
First of all, install the express package.
```bash
npm install express
```

And then create the server in the main.js file.

```bash
const express = require('express')
const app = express()
const port = process.env.PORT

// start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
```

Just incase you want to run the server on a differenet IP other than 127.0.0.1, then

```bash
const PORT = 3000; // type: number
const IP = '192.168.1.7' // type: string
app.listen(PORT, IP, () => {
    console.log(`Listening on port ${PORT}`);
})
```



### MIDDLEWARES
These are basically instructions that are executed when a specific endpoint is hit.
For example,
```bash
function logPosts(){
    console.log('You have hit the posts endpoint')
}

// this executes the logPosts function everytime the '/posts' endpoint is hit.
app.use('/posts', logPosts)
```



### ROUTES

```bash
app.get('/', (req, res) => {
    res.send("You have hit the home page")
})
```

There are more modular ways to go about the same procedure.
Let's say, you have a lot of routes that are related to posts. Then a better way to create your routes is presented subsequently.

- Create a file called posts, in a routes directory.
```bash
mkdir routes && cd routes && touch posts.js

RESTfulApi/
    routes/
        posts.js
```

Now create all routes related to posts by using 
```express.Router()```

```bash
const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.send("There are posts")
})

router.get('/specific', (req, res) => {
    res.send("Specific Post")
})


module.exports = router;
```

Now we need use this router in the main app.

```bash
// Simply import the router
const postsRouter = require('./router/posts')

// and now make it a middleware
app.use('/posts', postRouter)
```



### POPULATE THE DATABASE
Before the database can be populated, we need to define a structure (schema) for the data. Create the posts schema in a folder called models
```bash
mkdir models && cd models && touch posts.js

RESTfulApi/
    models/ 
        posts.js
```

Now let's create the schema

```bash
const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// The first argument represents the name of the schema, and the second argument is the schema itself.
module.exports = mongoose.model('Posts', PostSchema)
```

So now, let's try to add a post(Router.js)
```bash
const Post = require('../models/posts');

router.post('/', (req, res) => {
    console.log(req.body)
})
```

Now console.logging(req.body) displays "undefined" because express inherently can't process data of the json type. To do this, we need a package called **body-parser**.

```bash
npm install body-parser
```

Include it in main.js as a middleware
```bash
const bodyParser = require('body-parser')
app.use(bodyParser.json())
```

We should now see the data we posted now. 
**Middlewares should be created in order of significance**. For example, place the ```app.use(bodyParser.json())``` at the very top of the code.

We are now ready to post the data to the db hosted on mlab.

```bash
router.post('/', (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    })

    post.save()
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.json({ message: err })
    })
})
```



### GET ALL POSTS
That was a success. Now let's try to get all the post data in db.

```bash
router.get('/', (req, res) => {
    Post.find()
    .then(data => res.json(data))
    .catch(err => {
        res.json({ message: err })
    })
})

or by usuing async/await syntax

router.get('/', async (req, res) => {
    try{
        const posts = await Post.find()
        res.json(post)
    } catch (err) {
        res.json({ message: err })
    }
    
})
```



### GET A SPECIFIC POST
```bash
router.get('/:postId', (req, res) => {
    Post.findById(req.params.postId)
    .then(result => res.json(result))
    .catch(err => res.json({ message: err}))
})
```

The id ```postId``` is an attribute of request's parameters.




### DELETE A SPECIFIC POST
```bash
router.delete('/:postId', (req, res) => {
    Post.remove({_id: req.params.postId})
    .then(results => res.json(results))
    .catch(err => res.json({ message: err }))
})
```
NOTE:
DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead. 




### UPDATE A POST
```bash
router.patch('/:postId', (req, res) => {
    Post.updateOne({_id: req.params.postId}, {$set: { title: req.body.title }})
    .then(results => res.json(results))
    .catch(err => res.json({ message: err }))
})
```



### ENABLE CROSS DOMAIN COMMUNICATION
```bash
npm install cors
```
and add it to our list of existing middlewares.

```bash
app.use(cors())
```


