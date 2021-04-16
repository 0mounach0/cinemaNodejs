const mongoose = require('mongoose');

const theaterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    num_places: { type: Number, required: true },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema"
    },
    sessions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Session"
        }
      ]
});

module.exports = mongoose.model('Theater', theaterSchema);