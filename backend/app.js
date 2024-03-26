const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/post.js');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer to store uploaded files in an 'uploads' directory

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb+srv://hayven1205:montesor1205@hayven1205.prypyob.mongodb.net/?retryWrites=true&w=majority&appName=Hayven1205")
.then(() => {
    console.log('Connected to the database');
})
.catch(() => {
    console.log('connection failed');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, x-Requested-with, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})

// Route to fetch a single post by its ID
app.get('/api/posts/:id', async (req, res) => {
 try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
 } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
 }
});

// Route to update a post
app.put('/api/posts/:id', async (req, res) => {
 try {
     const postId = req.params.id;
     const updatedPost = req.body;
     const result = await Post.findByIdAndUpdate(postId, updatedPost, { new: true });
     console.log('Updated post:', result); // Log the updated post
     if (!result) {
       return res.status(404).json({ message: 'Post not found' });
     }
     res.status(200).json({ message: 'Post updated successfully', post: result });
 } catch (error) {
     console.error('Error updating post:', error);
     res.status(500).json({ message: 'Error updating post' });
 }
 });

app.post("/api/posts", upload.single('image'), (req, res, next) => {
  console.log('Received file:', req.file); // Log the received file
  const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.file.path // Store the path to the uploaded file
  });
  post.save()
  .then(savedPost => {
      console.log('Saved post:', savedPost);
      res.status(201).json({
          message: 'post added successfully'
      });
  })
  .catch(err => {
      console.error('Error saving post:', err);
      res.status(500).json({
          message: 'Error saving post'
      });
  });
});

// Correctly placed delete route handler
app.delete('/api/posts/:id', async (req, res) => {
 try {
      const postId = req.params.id;
      await Post.findByIdAndDelete(postId);
      res.status(200).json({ message: 'Post deleted successfully' });
 } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Error deleting post' });
 }
});

app.use('/api/posts', (req, res, next) => {
   Post.find().then(documents => {
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
     });
    })
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

module.exports = app;
