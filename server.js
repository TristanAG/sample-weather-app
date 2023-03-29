const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { city: 'Monterey', error: null });
});

app.get("/forecast", async (req, res) => {

  const city = req.query.city;

  res.render("index", { city: city, error: null });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});