const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    movie_id: { type: Number, required: true },
    seat_num: { type: Number, required: true },
    fullname: { type: String, required: true },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);

   