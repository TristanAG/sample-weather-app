const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("style"));

app.get("/", (req, res) => {
  res.render("index", { weather: [], city: '', error: null });
});

app.get("/forecast", async (req, res) => {
  const city = req.query.city
  const reg = new RegExp(/^\d+$/)

  let errorMessage = null
  if (city === '') {
    errorMessage = 'Query cannot be empty, please enter a City'
  } else if (reg.test(city)) {
    errorMessage = 'Query cannot contain only numbers, please enter a City'
  }

  if (errorMessage === null) {
    const apiKey = '3aa725c3067843f795c99d04f5c43586'

    fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&units=I&days=7&key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        const city = data.city_name
        const weatherForecastData = setForecastData(data.data)

        res.render("index", { weather: weatherForecastData, city: city, error: null });
      });
  } else {
    res.render("index", { weather: [], city: '', error: errorMessage });
  }
});

const setForecastData = (weekData) => {
  // days of week aren't available in api, so need to manually set them to weather forecast array
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayOfWeekOrdered = []
  const today = new Date().getDay()
  const weatherForecast = []
  
  let j = 0
  for (i = 0; i < weekData.length; i++) {
    if (today + i <= 6) {
      dayOfWeekOrdered.push(dayOfWeek[today + i])
    } else {
      dayOfWeekOrdered.push(dayOfWeek[j])
      j++
    }
    weatherForecast.push({day: dayOfWeekOrdered[i], ...weekData[i]})
  }

  return weatherForecast
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});