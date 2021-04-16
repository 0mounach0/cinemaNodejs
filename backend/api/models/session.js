const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    movie_id: { type: Number, required: true }
});

module.exports = mongoose.model('Session', sessionSchema);

   