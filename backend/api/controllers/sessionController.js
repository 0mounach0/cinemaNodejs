const Session = require('../models/session');

//---
const mongoose = require('mongoose');
const Theater = require('../models/theater');
const Cinema = require('../models/cinema');


module.exports = {
  getAll: async (req, res, next) => {
    await Session.find()
        .select("_id movie_id original_title overview poster_path release_date status title vote_average price startDate endDate theater")
        .populate("theater")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                sessions: docs.map(doc => {
                  return {
                    _id: doc._id,
                    movie_id: doc.movie_id,
                    original_title: doc.original_title,
                    overview: doc.overview,
                    poster_path: doc.poster_path,
                    release_date: doc.release_date,
                    status: doc.status,
                    title: doc.title,
                    vote_average: doc.vote_average,
                    price: doc.price,
                    startDate: doc.startDate,
                    endDate: doc.endDate,
                    theater: {
                        _id: doc.theater._id,
                        name: doc.theater.name,
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
  newSession: async (req, res, next) => {
    const session = new Session({
        _id: new mongoose.Types.ObjectId(),
        movie_id: req.body.movie_id,
        original_title: req.body.original_title,
        overview: req.body.overview,
        poster_path: req.body.poster_path,
        release_date: req.body.release_date,
        status: req.body.status,
        title: req.body.title,
        vote_average: req.body.vote_average,
        price: req.body.price,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        theater: req.body.theater,
        tickets: []
    });

    await session
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'session created successfully',
                createdSession: {
                    _id: result._id,
                    movie_id: result.movie_id,
                    original_title: result.original_title,
                    overview: result.overview,
                    poster_path: result.poster_path,
                    release_date: result.release_date,
                    status: result.status,
                    title: result.title,
                    vote_average: result.vote_average,
                    price: result.price,
                    startDate: result.startDate,
                    endDate: result.endDate,
                    theater: result.theater
                }
            });

            Theater.findByIdAndUpdate(result.theater._id,{
                    $push: { sessions: result }
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
  deleteSession: async (req, res, next) => {
    const session = await Session.findById(req.params.id);

    await Session.findByIdAndRemove(req.params.id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'session deleted',
                deletedSession: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

        //-----
        const theater = await Theater.findById(session.theater._id);
        theater.sessions.pull(session);
        await theater.save();

  },
   getOne: async (req, res, next) => {
    const _id = req.params.id;
    await Session.findById(_id)
      .select("_id movie_id original_title overview poster_path release_date status title vote_average price startDate endDate theater tickets")
      .populate({ path: 'theater', populate: 'cinema'})
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json({
            session: doc
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
  getCinemaSessions: async (req, res, next) => {
    const _id = req.params.id;
    
    await Cinema.findById(_id)
      .select("_id theaters")
      .populate("theaters")
      .exec()
      .then(doc => {
          let cinemaSessions = [];
        if (doc) {
            let rez = [...doc.theaters].reduce( (t, _, i) => 
                  t.then(_ => new Promise((resolve) => {
                    
                      let tmpTeather = Theater.findById(doc.theaters[i]._id).
                      select("sessions").populate("sessions").exec()
                      .then((doc)=> { 

                        if(req.query.start_date && req.query.end_date){
                          var start_date =  Date.parse(req.query.start_date);
                          var end_date =  Date.parse(req.query.end_date);
                          cinemaSessions.push(...doc.sessions.filter((s)=>{
                            return (s.startDate > start_date && s.startDate < end_date)
                          })); 
                        }else{
                          cinemaSessions.push(...doc.sessions);
                        }
                          resolve(doc.sessions);
                      })
                    
                    }  
                  ))
              , Promise.resolve() );
         
              rez.then((r)=> {
                res.status(200).json({
                            sessions: cinemaSessions
                          });
              })
                        
                
          
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