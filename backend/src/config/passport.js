const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/user_model");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },

        async (email, password, done) => {
            try {
                const user = await User.findOne({
                    email: email.toLowerCase(),
                });

                if (!user) {
                    return done(null, false, {
                        message: "Invalid email or password",
                    });
                }

                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isPasswordValid) {
                    return done(null, false, {
                        message: "Invalid email or password",
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);

        if (!user) {
            return done(null, false);
        }

        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;