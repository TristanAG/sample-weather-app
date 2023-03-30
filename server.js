const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("style"));

app.get("/", (req, res) => {
  res.render("index", { weather: [], city: '', error: null });
});

app.get("/forecast", async (req, res) => {

  const city = req.query.city.replace(/\d+/g, '')

  if (city !== '') {
    console.log(city)

    const apiKey = '3aa725c3067843f795c99d04f5c43586'

    fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&units=I&days=7&key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {

        console.log(data)
        const city = data.city_name
        const weatherForecastData = setForecastData(data.data)

        res.render("index", { weather: weatherForecastData, city: city, error: null });
      });
  } else {
    res.render("index", { weather: [], city: '', error: 'Query cannot be empty or only have numbers, please enter a city' });
  }
  
});

const setForecastData = (weekData) => {
  console.log(weekData)
  // days of week aren't available in api, so need to manually set them to weather forecast array
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayOfWeekOrdered = []
  
  const today = new Date().getDay()
  
  let j = 0
  for (i = 0; i < weekData.length; i++) {
    if (today + i <= 6) {
      dayOfWeekOrdered.push(dayOfWeek[today + i])
    } else {
      dayOfWeekOrdered.push(dayOfWeek[j])
      j++
    }
  }
  
  const weatherForecast = [
    {day: dayOfWeekOrdered[0], ...weekData[0]}, 
    {day: dayOfWeekOrdered[1], ...weekData[1]}, 
    {day: dayOfWeekOrdered[2], ...weekData[2]},
    {day: dayOfWeekOrdered[3], ...weekData[3]},
    {day: dayOfWeekOrdered[4], ...weekData[4]},
    {day: dayOfWeekOrdered[5], ...weekData[5]},
    {day: dayOfWeekOrdered[6], ...weekData[6]},
  ]

  return weatherForecast
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});