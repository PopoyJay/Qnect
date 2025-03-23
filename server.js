const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const sequelize = require("./models").sequelize;

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
require("./passport-config")(passport);

// Routes
app.use("/auth", authRoutes);

// 🟢 Protected Route Example
app.get("/profile", passport.authenticate("jwt", { session: false }), async (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});

// Start Server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});