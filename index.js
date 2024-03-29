const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIO(server);
const bodyParser = require("body-parser");
require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require("axios");
const port = 3001;
app.set("view engine", "ejs");
const connectdb = () => {
  const url = "mongodb+srv://admin:vinitha31@cluster0.arlyich.mongodb.net/spotify?retryWrites=true&w=majority";
  try {
    mongoose.connect(url);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const dbconnect = mongoose.connection;
  dbconnect.once("open", (_) => {
    console.log(`Database connected:${url}`);
  });
  dbconnect.on("error", (err) => {
    console.error(`conection error:${err}`);
  });
  return;
}
connectdb();
module.exports = connectdb;

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ id: jwt_payload.sub });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

app.get("/", (req, res) => {
  res.render('index');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static('images'));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use("/auth", authRoutes);
app.use("/song", songRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("play", (data) => {
    io.emit("play", data);
  });
  socket.on("updateProgressBar", () => {
    io.emit("updateProgressBar");
  });
  socket.on("togglePlay", () => {
    io.emit("togglePlay");
  });
  socket.on("playSelectedSong", () => {
    io.emit("playSelectedSong");
  });
  socket.on("changeVolume", (value) => {
    io.emit("changeVolume", value);
  });
  socket.on("next", () => {
    io.emit("next");
  });
  socket.on("previous", () => {
    io.emit("previous");
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log("app is running");
});
module.exports = app;