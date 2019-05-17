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

    helpingHand
      .create({
        runner: req.body.runner,
        time: req.body.time,
        video: req.body.video,
        category: req.body.category
      })
      .then(help => releaseEvents.status(201).json(help.serialize()))
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'jinkies guys'});
      });
});
