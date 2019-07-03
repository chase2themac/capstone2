'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const trackTimeSchema = mongoose.Schema({
    userId : {type: String},
    time: {type: Number},
    video: {type: String},
    category: {type: String},
    posted: {type : Date, default: Date.now}
});


trackTimeSchema.methods.serialize = function() {
    return {
        id: this.id,
        userId: this.userId,
        time: this.time,
        video: this.video,
        category: this.category,
        posted: this.posted
    };
};

const raceTimes = mongoose.model('raceTimes', trackTimeSchema);

module.exports = { raceTimes };