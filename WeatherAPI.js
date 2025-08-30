import axios from "axios";
import redis from "redis";
import ratelimit from "express-rate-limit";
import express from "express";

const app = express();

const limiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

app.get("/weather", async (req, res) => {
    res.send("Weather API response");
})
// Redis
const client = redis.createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();

// API constants
const BASE_PATH = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
const API_KEY = process.env.API_KEY || "YOUR_API_KEY";

// function to get weather data
async function getWeatherData(location) { 
    const catched = await client.get(location);
    if (catched) { 
        console.log('From Redis: ', JSON.parse(catched));
        return JSON.parse(catched);
    }

    try { 
        // API
        const response = await axios.get(
    `${BASE_PATH}/${encodeURIComponent(location)}?unitGroup=metric&include=days&key=${API_KEY}`);
        const weatherData = response.data;
        
        let current = weatherData.currentConditions;
        if (!current && weatherData.days && weatherData.days.length > 0 ) { 
            current = weatherData.days[0];
        }

        if ( current ) {
            console.log(`current weather in ${location}: ${current.temp}C, ${current.conditions}`);
        } else { 
            console.log(`Weather data not available!`);
        }

        await client.set(location, JSON.stringify(weatherData), { EX: 3600 }); // cache for 1 hour
        return weatherData;
    } catch (error) { 
        console.log(`Error: ${error.message}`);
        return null;
    }
}

// Test

const data = await getWeatherData("Istanbul, Turkey");

if (!data) {
    console.log("Data is null (likely because free API key limits the response)");
} else {
    const current = data.currentConditions || (data.days && data.days[0]);
    if (!current) {
        console.log("Weather data not available");
    } else {
        console.log(`Current temp: ${current.temp}°C, conditions: ${current.conditions}`);
    }
}

const PORT = process.env.PORT || 3000;
app.listen (PORT, () => console.log(`Server running on port ${PORT}`));
export default getWeatherData;