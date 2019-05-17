'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { helpingHand } = require('./models/helpingModel');

const app = express();

app.use(morgan('common'));
app.use(express.json());
 
app.get('/help', (req, res) => {
    helpingHand
    .find()
    .then(help => {
        res.json(help.map(help => help.serialize()));
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'ruh ro raggy'});
    });
});

app.post('/help', (req, res) => {
    const requiredFields = ['mentor', 'problem', 'solution', 'videoHelp'];
    for (let i = 0; i < requiredFields.length ; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body.`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    helpingHand
      .create({
        mentor: req.body.mentor,
        problem: req.body.problem,
        solution: req.body.soulution,
        videoHelp: req.body.videoHelp
      })
      .then(help => releaseEvents.status(201).json(help.serialize()))
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'jinkies guys'});
      });
});

app.delete('/help/:id', (req, res) => {
    helpingHand
    .findByIdAndRemove(req.params.id)
    .then(() => {
        res.status(204).json({ message: 'success'});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'you have no power here'});
    });
});

app.put('/help/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }
  
    const updated = {};
    const updateableFields = ['problem', 'solution', 'videoHelp'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
  
    helpingHand
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedHelp => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });