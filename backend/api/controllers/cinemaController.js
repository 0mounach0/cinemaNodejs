const Cinema = require('../models/cinema');

//---
const mongoose = require('mongoose');
const city = require('../models/city');

module.exports = {
  getAll: async (req, res, next) => {
    await Cinema.find()
        .select("_id name description address longitude latitude city")
        .populate("city")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                cinemas: docs.map(doc => {
                  return {
                    _id: doc._id,
                    name: doc.name,
                    description: doc.description,
                    address: doc.address,
                    longitude: doc.longitude,
                    latitude: doc.latitude,
                    city: {
                        _id: doc.city._id,
                        name: doc.city.name,
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
  getOne: async (req, res, next) => {
    const _id = req.params.id;
    await Cinema.findById(_id)
      .select("_id name description address longitude latitude city")
      .populate("city")
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json({
            cinema: {
                _id: doc._id,
                name: doc.name,
                description: doc.description,
                address: doc.address,
                longitude: doc.longitude,
                latitude: doc.latitude,
                city: {
                    _id: doc.city._id,
                    name: doc.city.name,
                }
              }
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
  },
  newCinema: async (req, res, next) => {
    const cinema = new Cinema({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        city: req.body.city
    });

    await cinema
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'cinema created successfully',
                createdCinema: {
                    _id: result._id,
                    name: result.name,
                    description: result.description,
                    address: result.address,
                    longitude: result.longitude,
                    latitude: result.latitude,
                    city: result.city
                }
            });

            city.findByIdAndUpdate(result.city._id,{
                    $push: { cinemas: result }
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
  updateCinema: async (req, res, next) => {
    const oldCinema = await Cinema.findById(req.params.id);

    await Cinema.findByIdAndUpdate(req.params.id, req.body)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Cinema updated',
                updatedCinema: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    
    const newCinema = await Cinema.findById(req.params.id);

    const city = await City.findById(newCinema.city._id);
    const cinema = city.cinemas.indexOf(oldCinema);
    city.cinemas[cinema] = newCinema;
    await city.save();

  },
  deleteCinema: async (req, res, next) => {
    const cinema = await Cinema.findById(req.params.id);

    await Cinema.findByIdAndRemove(req.params.id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Cinema deleted',
                deletedCinema: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

        //-----
        const city = await City.findById(cinema.city._id);
        city.cinemas.pull(cinema);
        await city.save();

  },
  getCinemaTheaters: async (req, res, next) => {
    const _id = req.params.id;
    await Cinema.findById(_id)
      .select("_id name theaters")
      .populate("theaters")
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json({
            theaters: doc.theaters
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