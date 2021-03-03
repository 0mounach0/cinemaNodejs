const User = require('../models/user');

//---
const mongoose = require('mongoose');

//---
const bcrypt = require("bcryptjs");

//---
const jwt = require("jsonwebtoken");

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
    const id = req.params.id;
    await User.findById(id)
      .select("id username email fisrtname lastname")
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
                id: new mongoose.Types.ObjectId(),
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
    User.find({ email: req.body.email })
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
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].id,
              role: user[0].role
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            user : user[0]

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
  logout: async (req, res, next) => { 


    
  }
};