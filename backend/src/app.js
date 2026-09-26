const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const passport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api", mediaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/voice", voiceRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        database: "connected",
        authenticated: req.isAuthenticated(),
    });
});

app.use(errorHandler);

module.exports = app;
