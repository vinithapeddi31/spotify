const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const authRoutes=require("./routes/auth");

app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(bodyParser.urlencoded({ extended: true }));

// Define your routes here (use your authentication routes, playlist routes, and song routes)

// Example route for the homepage
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
