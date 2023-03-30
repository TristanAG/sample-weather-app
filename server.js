const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("style"));

app.get("/", (req, res) => {
  res.render("index", { weather: [], error: null });
});

app.get("/forecast", async (req, res) => {

  const city = req.query.city;
  const apiKey = '3aa725c3067843f795c99d04f5c43586'

  fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=Bend&units=I&days=7&key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {

      // set day function now

      const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const dayOfWeekOrdered = []
      
      // today === 4
      const today = new Date().getDay()
      
      let j = 0
      for (i = 0; i < data.data.length; i++) {
        if (today + i <= 6) {
          dayOfWeekOrdered.push(dayOfWeek[today + i])
        } else {
          dayOfWeekOrdered.push(dayOfWeek[j])
          j++
        }
      }
      
      const weather = [
        {day: dayOfWeekOrdered[0], ...data.data[0]}, 
        {day: dayOfWeekOrdered[1], ...data.data[1]}, 
        {day: dayOfWeekOrdered[2], ...data.data[2]},
        {day: dayOfWeekOrdered[3], ...data.data[3]},
        {day: dayOfWeekOrdered[4], ...data.data[4]},
        {day: dayOfWeekOrdered[5], ...data.data[5]},
        {day: dayOfWeekOrdered[6], ...data.data[6]},
      ]

      res.render("index", { weather: weather, error: null });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});