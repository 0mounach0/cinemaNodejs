const User = require('../models/user');

//---
const mongoose = require('mongoose');

//---
const bcrypt = require("bcryptjs");

//---
const jwt = require("jsonwebtoken");

var session = require('express-session');

module.exports = {
  getAll: async (req, res, next) => {
    await User.find()
      .select()
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          users: docs
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
    await User.findById(_id)
      .select("_id username email fisrtname lastname")
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            user: doc
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
  newUser: async (req, res, next) => {
    await User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Mail exists"
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                email: req.body.email,
                password: hash,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                active: req.body.active,
                role: req.body.role
              });
              user
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    message: "User created"
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      });
  },
  loginUser: async (req, res, next) => {
    User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {

          req.session.user = {
                          _id: user[0]._id,
                          firstname: user[0].firstname,
                          lastname: user[0].lastname,
                          email: user[0].email,
                          username: user[0].username,
                          role: user[0].role
                        };

          return res.status(200).json({
            message: "Auth successful",
            user : {
              _id: user[0]._id,
              firstname: user[0].firstname,
              lastname: user[0].lastname,
              email: user[0].email,
              username: user[0].username,
              role: user[0].role
            }
          });
        }
        res.status(401).json({
          message: "Auth failed"
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
  updateUser: async (req, res, next) => {
    const user = await User.findById(req.params.id);
    console.log(user)
    await User.findByIdAndUpdate(req.params.id, req.body.user)
  .exec()
  .then(data => {
      console.log(data);
      res.status(200).json({
        message: 'User updated',
        user: data
    });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
        });
  },
  logoutUser: async (req, res, next) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(409).json({
          message: "Logout failed"
        });
      }
      res.status(200).json({
        message: "Logout successful"
      });
    });
  },
  isLogged: async (req, res, next) => {

    if(!req.session.user){
      return res.status(200).json({
              message: "Is Not Logged",
              isLogged: false,
              status: "NOT LOGGED"
            });
    }else{
      await User.findById(req.session.user._id)
      .select("_id username email fisrtname lastname role")
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json({
            user: doc,
            isLogged: true,
            status: "LOGGED"
          });
        } else {
          res.status(400).json({
            message: 'No valide entry found for provided session',
            isLogged: false,
            status: "NOT LOGGED"
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
    }
    
  }
};