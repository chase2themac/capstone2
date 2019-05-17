'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { Comment } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());
 
app.get('/comments', (req, res) => {
    Comment
    .find()
    .then(comments => {
        res.json(comments.map(comments => comments.serialize()));
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'ruh ro raggy'});
    });
});

app.post('/comments', (req, res) => {
    const requiredFields = ['commenter', 'content'];
    for (let i = 0; i < requiredFields.length ; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body.`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Comment
      .create({
        commenter: req.body.commentor,
        content: req.body.content
      })
      .then(comment => releaseEvents.status(201).json(comment.serialize()))
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'jinkies guys'});
      });
});

app.delete('/comments/:id', (req, res) => {
    Comment
    .findByIdAndRemove(req.params.id)
    .then(() => {
        res.status(204).json({ message: 'success'});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'you have no power here'});
    });
});

app.put('/comments/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }
  
    const updated = {};
    const updateableFields = ['content'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
  
    Comment
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedComment => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });