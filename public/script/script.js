// -----> this function will make a ajax call to server
const getWeatherData = async (url = ``, coordinates = {}) => {
  try {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coordinates),
    });
    const weatherData = await result.json();

    if (weatherData.result && weatherData.status === 200) {
      return weatherData.data;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

// -----> this function will manipulate the DOM if there are any errors
const ifError = (errorMessage = ``) => {
  const body = document.querySelector(`.body`);
  const h1 = document.createElement(`h1`);
  h1.textContent = `${errorMessage}`;
  h1.classList.add(`error-text`);
  body.innerHTML = ``;
  body.appendChild(h1);
};

// -----> this function will manipulate the DOM
const manipulateDom = ({ changeFor, data }) => {
  switch (changeFor) {
    case "internetProblem":
      ifError(`Internet Problem`);
      break;

    case "locationDeny":
      ifError(`in order to use the app you need to grant location access`);
      break;

    case "nodeChange":
      // -----> grabbing html element
      const loading = document.querySelector(`.loading-container`);
      const mainContainer = document.querySelector(`.main-container`);
      const humidity = document.querySelector(`#humidity`);
      const chanceOfRain = document.querySelector(`#chance-of-rain`);
      const windSpeed = document.querySelector(`#wind-speed`);
      const weatherCondition = document.querySelector(`.weather__condition`);
      const location = document.querySelector(`.weather__place`);
      const temprature = document.querySelector(`#temprature`);

      humidity.textContent = `${data.humidity} %`;
      chanceOfRain.textContent = `${data.chanceOfRain} %`;
      windSpeed.textContent = `${data.windSpeed} km/h`;
      weatherCondition.textContent = data.condition;
      location.textContent = data.location;
      temprature.textContent = data.temperature;

      loading.classList.add(`loading-container--hide`);
      mainContainer.classList.remove(`main-container--hide`);

      break;
  }
};

// -----> callback to execute when user accept or deny
const clientAccepted = async ({ coords }) => {
  const { latitude, longitude } = coords;
  const coordinates = {
    latitude,
    longitude,
  };

  const result = await getWeatherData(`http://localhost:100/`, coordinates);

  if (!result) {
    manipulateDom({
      changeFor: `internetProblem`,
      data: null,
    });
  } else {
    manipulateDom({
      changeFor: `nodeChange`,
      data: result,
    });
  }
};

const clientDeny = () => {
  manipulateDom({
    changeFor: `locationDeny`,
    data: null,
  });
};

// -----> requesting for user location
navigator.geolocation.getCurrentPosition(clientAccepted, clientDeny);
