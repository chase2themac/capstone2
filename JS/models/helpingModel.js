'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const helpingHandSchema = mongoose.Schema({
    mentor: {username : String},
    problem: {type: String},
    solution: {type: String},
    videoHelp: {type: String},
    postDate: {type: Date, default: Date.now}
});

helpingHandSchema.virtual('User').get(function() {
    return `${this.mentor}`
});

helpingHandSchema.methods.serialize = function(){
    return {
        mentor: this.username,
        problem: this.problem,
        solution: this.solution,
        videoHelp: this.videoHelp,
        postDate: this.postDate
    };
};

const helpingHand = mongoose.model('helpingHand', helpingHandSchema);

module.export = { helpingHand };