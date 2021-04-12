const City = require('../models/city');
const Cinema = require('../models/cinema');

//---
const mongoose = require('mongoose');

module.exports = {
  getAll: async (req, res, next) => {
    await City.find()
        .select("_id name")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                cities: docs.map(doc => {
                  return {
                    _id: doc._id,
                    name: doc.name
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
    await City.findById(_id)
      .select("_id name cinemas")
      .exec()
      .then(doc => {
          console.log(doc);
        if (doc) {
          res.status(200).json({
            city: doc
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
  newCity: async (req, res, next) => {
    const city = new City({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        cinemas: []
    });

    await city
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'city created successfully',
                createdCity: {
                    _id: result._id,
                    name: result.name
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
  },
  updateCity: async (req, res, next) => {
    await City.findByIdAndUpdate(req.params.id, req.body)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'City updated',
                updatedCity: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    const newCity = await City.findById(req.params.id);

    //----------
    for(const element of newCity.cinemas){
        const cinema = await Cinema.findById(element._id);
        cinema.city = newCity;
        await cinema.save();
    }
  },
  deleteCity: async (req, res, next) => {
    const city = await City.findById(req.params.id);

    await City.findByIdAndRemove(req.params.id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'City deleted',
                deletedCity: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

        //-----
        for(const element of city.cinemas){
            await Cinema.findByIdAndDelete(element._id)
                        .exec();
        }
  }
};