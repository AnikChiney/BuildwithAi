const authService = require("../services/authServices");
const passport = require("../config/passport");

const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);

        res.status(201).json({
            message: "Registration successful",
            user,
        });
    } catch (error) {
        if (error.message === "Email already registered") {
            return res.status(409).json({ message: error.message });
        }

        if (error.message === "Name, email and password are required") {
            return res.status(400).json({ message: error.message });
        }

        next(error);
    }
};

const login = (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error) return next(error);

        if (!user) {
            return res.status(401).json({
                message: info?.message || "Invalid credentials",
            });
        }

        req.logIn(user, (loginError) => {
            if (loginError) return next(loginError);

            return res.json({
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        });
    })(req, res, next);
};

const me = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
    }

    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        },
    });
};

const logout = (req, res, next) => {
    req.logout((error) => {
        if (error) return next(error);

        req.session.destroy((sessionError) => {
            if (sessionError) return next(sessionError);

            res.clearCookie("connect.sid");
            res.json({ message: "Logout successful" });
        });
    });
};

module.exports = { register, login, me, logout };
