const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("style"));

app.get("/", (req, res) => {
  res.render("index", { weatherOne: {}, weatherTwo: {}, error: null });
});

app.get("/forecast", async (req, res) => {

  const city = req.query.city;
  const apiKey = '3aa725c3067843f795c99d04f5c43586'

  fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=Bend&units=I&days=7&key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      const weatherOne = data.data[0]
      const weatherTwo = data.data[1]

      console.log(weatherOne)
      res.render("index", { weatherOne: weatherOne, weatherTwo: weatherTwo, error: null });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});