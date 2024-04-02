import * as express from "express";
import * as cors from "cors";
import { Request, Response } from "express";
import axios from "axios";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000; // Port for Express server

// Define a route to proxy weather requests
app.get("/weather", async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    const geoResponse =
      await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.APP_API_KEY}
    `);

    // Assuming the first result is the city we want
    const { lat, lon } = geoResponse.data[0];

    const weatherResponse =
      await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.APP_API_KEY}
    `);

    res.json(weatherResponse.data); // Send response here, once
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ error: "Failed to fetch weather data" }); // Proper error handling
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
