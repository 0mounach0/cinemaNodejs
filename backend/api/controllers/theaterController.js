const Theater = require('../models/theater');

//---
const mongoose = require('mongoose');
const cinema = require('../models/cinema');

module.exports = {
  getAll: async (req, res, next) => {
    await Theater.find()
        .select("_id name num_places cinema sessions")
        .populate("cinema")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                theaters: docs.map(doc => {
                  return {
                    _id: doc._id,
                    name: doc.name,
                    num_places: doc.num_places,
                    cinema: {
                        _id: doc.cinema._id,
                        name: doc.cinema.name,
                    }
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
  newTheater: async (req, res, next) => {
    const theater = new Theater({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        num_places: req.body.num_places,
        cinema: req.body.cinema,
        sessions: []
    });

    await theater
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'theater created successfully',
                createdTheater: {
                    _id: result._id,
                    name: result.name,
                    num_places: result.num_places,
                    cinema: result.cinema
                }
            });

            cinema.findByIdAndUpdate(result.cinema._id,{
                    $push: { theaters: result }
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
  },
  deleteTheater: async (req, res, next) => {
    const theater = await Theater.findById(req.params.id);

    await Theater.findByIdAndRemove(req.params.id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Theater deleted',
                deletedTheater: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

        //-----
        const cinema = await Cinema.findById(theater.cinema._id);
        cinema.theaters.pull(theater);
        await cinema.save();

  },
  updateTheater: async (req, res, next) => {
    const oldTheater = await Theater.findById(req.params.id);

    await Theater.findByIdAndUpdate(req.params.id, req.body)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Theater updated',
                updatedTheater: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    
    const newTheater = await Theater.findById(req.params.id);

    const cinema = await Cinema.findById(newTheater.cinema._id);
    const theater = cinema.theaters.indexOf(oldTheater);
    cinema.theaters[theater] = newTheater;
    await cinema.save();

  },
   getOne: async (req, res, next) => {
    const _id = req.params.id;
    await Theater.findById(_id)
      .select("_id name num_places cinema sessions")
      .populate("cinema")
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json({
            theater: doc
          });
        } else {
          res.status(400).json({
            message: 'No valide entry found for provided ID'
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
};