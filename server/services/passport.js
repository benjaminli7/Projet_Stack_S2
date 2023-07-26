const { User }  = require('../db');
const  passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');


    passport.use(new LocalStrategy(async (email, password, done) => {
        try {
        // Find the user in the database by email
        const user = await User.findOne({ where: { email: email } });
    
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
    
        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    
        if (!passwordMatch) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
    
        // Authentication successful, return the user object
        return done(null, user);

        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser(function(user, cb) {
        cb(null, user.id);
    }
    );

    passport.deserializeUser(function(id, cb) {
        User.findOne({ where: { id: id } }, function(err, user) {
          if (err) { return cb(err); }
          cb(null, user);
        });
      });

module.exports = passport;