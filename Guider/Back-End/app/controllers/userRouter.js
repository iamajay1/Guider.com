var express = require('express');
var userRouter = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Ticket = mongoose.model('Ticket');
var resGenerator = require('./../../libs/resGenerator');
var validator = require('./../../middlewares/validator');
var nodemailer = require('nodemailer');
//defining token for Authenticating JWT Tokens
var token;

// used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');

//json secret key
var jsonSecret = "1993%^#QWERTY654321#90";

/****************************************************************************************************************/
//Start of Login Route
userRouter.post('/login', validator.login, function (req, res) {

    User.findOne({
        email: req.body.email,
		password :req.body.password
    }, function (error, user) {

        // console.log("user : "+user);

        if (error) {
        	
            var err = resGenerator.generate(true, "Something is not working : " + error, 500, null);

            res.json(err);

        } else if (user === null || user === undefined || user.name === null || user.name === undefined) {

            var response = resGenerator.generate(true, " Check Your EmailID and Password ...!! ", 400, null);

            res.json(response);

        } else {

            //creating jwt token of user to Authenticate other API's
            token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                id: user._id,
                email: user.email,
                name: user.name,
                mobileNumber: user.mobileNumber
            }, jsonSecret);

            var response = resGenerator.generate(false, "Logged in Successfully", 200, user);

            response.token = token;

            res.json(response);

        }

    });

});
// end login route
/*********************************************************************************************************************/

//Start of signup Route
userRouter.post('/signup', validator.signup, function (req, res) {

    //check if email id already exists and flag if exists
    User.findOne({
        email: req.body.email
    }, function (error, user) {

        if (error) {

            //console.log("error");

            var err = resGenerator.generate(true, "Something is not working, error  : " + error, 500, null);

            res.json(err);

        } else if (user) {

            //console.log("user");

            var err = resGenerator.generate(true, "Email  already exists, please Login", 400, null);

            res.json(err);

        } else {

            //Creating New User Instance
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber,
				password:req.body.password
		  });



            //saving user data in mongodb
            newUser.save(function (error) {
                if (error) {
                    var response = resGenerator.generate(true, "Some error occured : " + error, 500, null);

                    res.json(response);

                } else {

                    token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        id: newUser._id,
                        email: newUser.email,
                        name: newUser.name,
                        mobileNumber: newUser.mobileNumber
                    }, jsonSecret);

                    var response = resGenerator.generate(false, "Successfully signed up", 200, newUser);

                    response.token = token;

                    res.json(response);
                }
            });
        }
    });

});
//end signup route
userRouter.post('/send', function (req, res) {

    User.findOne({
        email: req.body.email,
		mobileNumber : req.body.mobileNumber
    }, function (error, user) {

        // console.log("user : "+user);

        if (error) {
        	
            var err = resGenerator.generate(true, "Please Enter Correct Data " + error, 500, null);

            res.json(err);

        } else if (user === null || user === undefined || user.name === null || user.name === undefined) {

            var response = resGenerator.generate(true, "No user found !! Check email and try again... ", 400, null);

            res.json(response);

        } else {
			            //creating jwt token of user to Authenticate other API's
            token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                id: user._id,
                email: user.email,
                name: user.name,
                mobileNumber: user.mobileNumber
            }, jsonSecret);
            var response = resGenerator.generate(false, "Success", 200, user);

            response.token = token;

            res.json(response);

        }

    });

});
userRouter.put('/edit/:userId', function (req, res) {
	var update=req.body;
    User.findOneAndUpdate({'userId':req.params.id},update, function (error, pass) {

        // console.log("user : "+user);

        if (error) {
        	
            var err = resGenerator.generate(true, "Something is not working : " + error, 500, null);

            res.json(err);

        } else if (pass === null || pass === undefined || pass === "") {

            var response = resGenerator.generate(true, "please Enter Password ", 400, null);

            res.json(response);

        } else {
		
		console.log("change password success");
	  
            token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                id: pass._id,
                email: pass.email,
                name: pass.name,
                mobileNumber: pass.mobileNumber
            }, jsonSecret);
		
            var response = resGenerator.generate(false, "Success", 200, pass);

            response.token = token;

            res.json(response);

        }

    });

});

/*********************************************************************************************************************/
//exporting Routes
module.exports = userRouter;
