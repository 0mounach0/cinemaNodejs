const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    movie_id: { type: Number, required: true },
    original_title: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    release_date: { type: String, required: true },
    status: { type: String, required: false },
    title: { type: String, required: true },
    vote_average: { type: String, required: true },
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theater"
    },
    tickets: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket"
        }
    ]

});

module.exports = mongoose.model('Session', sessionSchema);

   