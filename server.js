const express = require("express");
const config = require("config");
const connectDB = require("./config/db");
const { check, validationResult } = require("express-validator");

const app = express();

connectDB();

// Init Middleware

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

//define routes

app.use("/api/users", require("./routes/api/users.js"));
app.use("/api/auth", require("./routes/api/auth.js"));
app.use("/api/profile", require("./routes/api/profile.js"));
app.use("/api/posts", require("./routes/api/posts.js"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
