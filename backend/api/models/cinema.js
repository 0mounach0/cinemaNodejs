const mongoose = require('mongoose');

const cinemaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    longitude: { type: String, required: true },
    latitude: { type: String, required: true },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City"
    },
    theaters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theater"
      }
    ]
});

module.exports = mongoose.model('Cinema', cinemaSchema);

   