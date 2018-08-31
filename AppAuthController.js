const AppUser = require("../../models/User/appuser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const helper = require("../../helper/helper");
var uuid = require("uuid");
var nodemailer = require('./nodemailer');

exports.register_user = (req, res, next) => {
  bcrypt
    .genSalt(10)
    .then(salt => {
      return bcrypt.hash(req.body.password, salt);
    })
    .then(hash => {
      var user = new AppUser({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Registered Successfully",
        user: {
          email: result.email,
          _id: result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  AppUser.find({ email: email })
    .then(user => {
      if (user.length < 1) {
        res.status(401).json({ message: "Auth Failed" });
      }
      const check = bcrypt.compareSync(req.body.password, user[0].password);
      return { check, user };
    })
    .then(result => {
      user = result.user;
      const check = result.check;
      if (!check) {
        res.status(401).json({ message: "Auth Failed" });
      }
      const loggedInUser = {
        userId: user[0]._id,
        email: user[0].email
      };
      return helper.generateToken(loggedInUser);
    })
    .then(token => {
      res.status(200).json({
        message: "Authenticated Successfully",
        token
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.forget_password = (req,res,next)=>{
  var body = req.body;
  Object.assign(body, { forgetPasswordToken : uuid.v1() });
  AppUser
    .updateOne({ email: req.body.email }, { $set: body })
    .exec()
    .then(doc => {
      token = doc.forgetPasswordToken;
      email = doc.email;
      nodemailer.sendmail({email,token});
      res.json({mail:sent})
      console.log('go to resetpass');
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  }

  exports.reset_password = (req,res)=>{ 
    var body = req.body;
    Object.assign(body, { password : req.body.password });
    AppUser.updateOne({ resetPasswordToken : req.params.token },{$set:body})
    .exec()
    .then(doc=>{
      res.status(200).json({message:success});
    })
    .catch(err=>{
      res.status(500).json({error:err});
    });
 }
