const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");


// @route   GET api/users
//@desc     Test route
//@access   Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } catch (err) {
    res.status(500).send("server Error");
  }
});

// @route   POST api/auth
//@desc     Authenticate user and get token
//@access   Public
router.post("/", [
  check('email','Please include a valid email').isEmail(),
  check('password','Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
    }
    
    const { email, password } = req.body;

    try {
    //see if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'invalid Credentials' }] });
      }

      // check if password match
      
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'invalid Credentials' }] });
      }
      
    //create payload - sending back user id

      const payload = {
        user: {
          id: user.id
      }
      }
      
    //using jwt to send token with payload
      
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );


    //res.send("User Route");

    }

    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

});

module.exports = router;
