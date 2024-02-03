import express from "express";
import axios from "axios";
import env from "dotenv";

env.config();

const app = express();
const port = 3000;
const API_URL1 = "https://api.api-ninjas.com/v1/geocoding?";
const apiKey = process.env.KEY;
const API_URL2 = "https://api.openweathermap.org/data/3.0/onecall?";
const appId = process.env.ID;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get('/city', async (req, res) => {
    try {
        const { city, country } = req.query;

        const locationUrl = `${API_URL1}city=${city}&country=${country}&X-Api-Key=${apiKey}`;
        const locationResponse = await axios.get(locationUrl);

        const latitude = locationResponse.data[0].latitude;
        const longitude = locationResponse.data[0].longitude;

        const weatherUrl = `${API_URL2}lat=${latitude}&lon=${longitude}&units=metric&appid=${appId}`;
        const weatherResponse = await axios.get(weatherUrl);

        console.log(city + ", " + country);

        const timezone = weatherResponse.data.timezone_offset;

        const currentWeather = weatherResponse.data.current;

if (
    currentWeather &&
    currentWeather.sunrise &&
    currentWeather.sunset 
    // Add similar checks for other properties
) {
    res.render("city.ejs", { 
        data: { 
            sunrise: currentWeather.sunrise, 
            sunset: currentWeather.sunset, 
            temp: currentWeather.temp, 
            feels_like: currentWeather.feels_like, 
            wind_speed: currentWeather.wind_speed, 
            visibility: currentWeather.visibility, 
            humidity: currentWeather.humidity, 
            weather: currentWeather.weather[0].main,
            description: currentWeather.weather[0].description,
            icon: currentWeather.weather[0].icon,
            city: city,
            country: country,
            timezone: locationResponse.data.timezone,
        }
    });
        } else {
            console.error("Unexpected response structure:", weatherResponse);
            res.status(500).send("Internal Server Error-1");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error-2");
    }
});



app.listen(port, () => {
    console.log(`Currently listening on port ${port}`);
});

