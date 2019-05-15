'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const trackTimeSchema = mongoose.Schema({
    runner: {username : String},
    time: {type: Number},
    video: {type: String},
    catagory: {type: String},
    posted: {type : Date, default: Date.now}
});

trackTimeSchema.virtual('User').get(function() {
    return `${this.username}`
});

trackTimeSchema.methods.serialize = function() {
    return {
        runner: this.User,
        time: this.time,
        video: this.video,
        catagory: this.catagory,
        posted: this.posted
    };
};

const raceTimes = mongoose.model('raceTimes', trackTimeSchema);

module.exports = { raceTimes };