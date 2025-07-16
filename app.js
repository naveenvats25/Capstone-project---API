import express from "express";
import axios   from "axios";
import dotenv  from "dotenv";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { error: null });
});

app.post("/weather", async (req, res) => {
  const city = req.body.city?.trim();
  if (!city) return res.render("index", { error: "Please enter a city name." });

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${process.env.OWM_API_KEY}`;

  try {
    const { data } = await axios.get(url);

    const weather = {
      name:       data.name,
      country:    data.sys.country,
      temp:       data.main.temp,
      feels:      data.main.feels_like,
      humidity:   data.main.humidity,
      pressure:   data.main.pressure,
      wind:       data.wind.speed,
      desc:       data.weather[0].description,
      icon:       data.weather[0].icon,
    };

    res.render("weather", { weather });
  } catch (err) {
    console.error(err.response?.data || err.message);
    const msg =
      err.response?.status === 404
        ? `“${city}” not found.`
        : "Couldn’t reach OpenWeather. Try again!";
    res.render("index", { error: msg });
  }
});

app.listen(PORT, () =>
  console.log(`🌦️  Weather app running → http://localhost:${PORT}`)
);
