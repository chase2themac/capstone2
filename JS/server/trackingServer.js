'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { raceTimes } = require('./models/trackingModel');

const app = express();

app.use(morgan('common'));
app.use(express.json());

const jwtAuth = passport.authenticate('jwt', {session: false});

app.get('/times', (req, res) => {
    raceTimes
    .find()
    .then(times => {
        res.json(times.map(times => times.serialize()));
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'ruh ro raggy'});
    });
});

app.post('/times', (req, res) => {
    const requiredFields = ['runner', 'time', 'video', 'category'];
    for (let i = 0; i < requiredFields.length ; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body.`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    raceTimes
      .create({
        runner: req.body.runner,
        time: req.body.time,
        video: req.body.video,
        category: req.body.category
      })
      .then(times => releaseEvents.status(201).json(times.serialize()))
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'jinkies guys'});
      });
});

app.delete('/times/:id/:userId', jwtAuth, (req, res) => {
  raceTimes.findOne({id: req.params.id, userId: req.params.userId})
  .then(raceTime => { 
    raceTimes
    .findByIdAndRemove(raceTime.id)
    .then(() => {
        res.status(204).json({ message: 'success'});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: err.message});
    });
});

app.put('/times/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }
  
    const updated = {};
    const updateableFields = ['time', 'category', 'video'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
  
    raceTimes
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedTimes => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });
