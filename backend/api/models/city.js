const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    cinemas: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cinema"
        }
      ]
});

module.exports = mongoose.model('City', citySchema);