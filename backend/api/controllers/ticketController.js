const Ticket = require('../models/ticket');
const Session = require('../models/session');

//---
const mongoose = require('mongoose');

module.exports = {
    getAll: async (req, res, next) => {
        await Ticket.find()
            .select("_id seat_num fullname session")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    tickets: docs.map(doc => {
                      return {
                        _id: doc._id,
                        seat_num: doc.original_title,
                        fullname: doc.fullname,
                        session: doc.session
                      };
                    })
                  };
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    },
    newTicket: async (req, res, next) => {
        const ticket = new Ticket({
            _id: new mongoose.Types.ObjectId(),
            seat_num: req.body.seat_num,
            fullname: req.body.fullname,
            session: req.body.session
        });
    
        await ticket
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'ticket created successfully',
                    createdTicket: {
                        _id: result._id,
                        seat_num: result.seat_num,
                        fullname: result.fullname,
                        session: result.session
                    }
                });
    
                Session.findByIdAndUpdate(result.session._id,{
                        $push: { tickets: result }
                    })
                    .exec()
                    .then(data => {
                        console.log(data);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
      }
};