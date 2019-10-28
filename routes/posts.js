const express = require('express')
const router = express.Router();
const Post = require('../models/posts')

// get all posts
router.get('/', (req, res) => {
    Post.find()
    .then(data => res.json(data))
    .catch(err => {
        res.json({ message: err })
    })
})


router.get('/specific', (req, res) => {
    res.send("Specific Post")
})

// add a post
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


// get specific post
router.get('/:postId', (req, res) => {
    Post.findById(req.params.postId)
    .then(result => res.json(result))
    .catch(err => res.json({ message: err}))
})


// delete
router.delete('/:postId', (req, res) => {
    Post.remove({_id: req.params.postId})
    .then(results => res.json(results))
    .catch(err => res.json({ message: err }))
})


// update
router.patch('/:postId', (req, res) => {
    Post.updateOne({_id: req.params.postId}, {$set: { title: req.body.title }})
    .then(results => res.json(results))
    .catch(err => res.json({ message: err }))
})

module.exports = router;