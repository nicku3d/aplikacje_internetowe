
const API_KEY = 'f659cdf42a761a0597734133b5a59041'; //trzymam kciuki że nikt nie podkradnie w tym publicznym repo
const WEATHER_API_LINK = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_API_LINK = "https://api.openweathermap.org/data/2.5/forecast";

const search = document.getElementById('search');
search.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const hopefullyCity = search.value.trim();
        console.log(hopefullyCity);
        getCurrentWeather(hopefullyCity)
        getWeatherForecast(hopefullyCity)
    }
});


function getCurrentWeather(hopefullyCity)
{
    let weatherApiLink  = new URL(WEATHER_API_LINK);
    weatherApiLink.searchParams.append('q', hopefullyCity);
    weatherApiLink.searchParams.append('appid', API_KEY);
    weatherApiLink.searchParams.append('units', 'metric');
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE) {
            const container = document.getElementById("weather-current-container");
            container.innerHTML = '';
            if (this.status === 200) {
                const json = JSON.parse(request.responseText);
                console.log('current weather response:', json);
                const card = createWeatherCard(json);
                container.append(card);
                toggleErrorMessage();
            } else {
                const errorResponse = JSON.parse(this.responseText);
                console.error('Failed to fetch forecast: ', errorResponse.cod + ' ' + errorResponse.message)
                toggleErrorMessage(errorResponse.message);
            }
        }
    };
    request.open("GET", weatherApiLink, true);
    request.send();
}

function getWeatherForecast(hopefullyCity) {
    let weatherApiLink = new URL(FORECAST_API_LINK);
    weatherApiLink.searchParams.append('q', hopefullyCity);
    weatherApiLink.searchParams.append('appid', API_KEY);
    weatherApiLink.searchParams.append('units', 'metric');
    const forecastContainer = document.getElementById('weather-forecast-container');

    const response = fetch(weatherApiLink);
    response.then(response => {
        forecastContainer.innerHTML = '';
        if (!response.ok) {
            throw new Error(response.status + ' ' + response.statusText);
        }
        return response.json();

    }).then(json => {
        for (const forecastItem of json.list) {
            const weatherCard = createWeatherCard(forecastItem);
            forecastContainer.append(weatherCard);
        }
        console.log('forecast response:', json);
    }).catch(error => {
        console.error('Failed to fetch forecast: ', error)
    })
}

function createWeatherCard(forecastItem) {
    const {
        dt_txt,
        dt,
        main: { temp, pressure, humidity },
        clouds: { all: clouds },
        wind: { speed },
        weather
    } = forecastItem;

    const iconCode = weather[0].icon;

    const card = document.createElement("div");
    card.className = "weather-card";

    const header = document.createElement("div");
    header.className = "weather-card-header";

    const dateElement = document.createElement("div");
    dateElement.className = "weather-card-date";
    dateElement.textContent = formatUnixTimestamp(dt);

    header.appendChild(dateElement);

    const mainRow = document.createElement("div");
    mainRow.className = "weather-card-main";

    const tempElement = document.createElement("div");
    tempElement.className = "weather-card-temp";
    tempElement.textContent = `${Math.round(temp)}°C`;

    const icon = document.createElement("img");
    icon.className = "weather-card-icon";
    icon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    icon.alt = "weather icon";

    mainRow.appendChild(tempElement);
    mainRow.appendChild(icon);

    const details = document.createElement("div");
    details.className = "weather-card-details";

    details.innerHTML = `
    <div><span class="weather-card-label">Pressure:</span> ${pressure} hPa</div>
    <div><span class="weather-card-label">Clouds:</span> ${clouds}%</div>
    <div><span class="weather-card-label">Humidity:</span> ${humidity}%</div>
    <div><span class="weather-card-label">Wind:</span> ${speed} m/s</div>
`;

    card.appendChild(header);
    card.appendChild(mainRow);
    card.appendChild(details);

    return card;
}

function toggleErrorMessage(errorMessage)
{
    const warningContainer = document.getElementById('warning');
    if (errorMessage) {
        warningContainer.innerText = 'Error while retrieving weather: ' + errorMessage;
        warningContainer.style.display = 'block';
    } else {
        warningContainer.innerText = '';
        warningContainer.style.display = 'none';
    }
}

function formatUnixTimestamp(ts) {
    const date = new Date(ts * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}