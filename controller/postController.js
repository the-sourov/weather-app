// -----> third party module
require(`dotenv`).config();
const axios = require(`axios`);

// -----> this function will use the mapbox reverse geocoding api to convert coordinates into place name
const reverseGeocoding = async ({ latitude, longitude }) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=place&access_token=${process.env.MAP_BOX_API_KEY}`;

  try {
    const result = await axios.get(url);
    const { status, data } = result;

    if (status === 200) {
      return {
        result: true,
        data: data.features[0].text,
      };
    } else {
      return {
        result: false,
        data: null,
      };
    }
  } catch {
    return {
      result: false,
      data: null,
    };
  }
};

// -----> this function will request for the weather data
const getWeatherData = async (location) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`;

  try {
    const result = await axios.get(url);

    const { status, data } = result;

    if (status === 200) {
      const weatherData = {
        result: true,
        data: {
          location: data.name,
          temperature: data.main.temp,
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          chanceOfRain: data.clouds.all,
          windSpeed: Math.floor(data.wind.speed * 3.6),
        },
      };

      return weatherData;
    } else {
      return {
        result: false,
        data: null,
      };
    }
  } catch {
    return {
      result: false,
      data: null,
    };
  }
};

module.exports = async (req, res) => {
  const { latitude, longitude } = req.body;

  const reverseGeocodeData = await reverseGeocoding({ latitude, longitude });

  if (!reverseGeocodeData.result) {
    console.log(`not ok`);
  } else {
    const weatherData = await getWeatherData(reverseGeocodeData.data);

    if (weatherData.result) {
      res.set(`Content-Type`, `application/json`).status(200).json({
        result: true,
        status: 200,
        data: weatherData.data,
      });
      return;
    } else {
      res.set(`Content-Type`, `application/json`).status(500).json({
        result: false,
        status: 500,
      });
    }
  }
};
