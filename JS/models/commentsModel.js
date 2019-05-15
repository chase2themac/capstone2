'use strict';
==========
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const commentSchema = mongoose.Schema({
    commenter : {User : String},
    content : {type : String},
    timeStamp : { type : Date, default: Date.now}
});

commentSchema.virtual('User').get(function() {
    return `${this.username}`});

commentSchema.methods.serialize = function(){
    return{
        commenter: this.User,
        content: this.content,
        timeStamp: this.timeStamp
    };
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };