const APIKey = '719120b9ddfb623ee834cf9171dff48f';


// fetches data from weather API
async function fetchWeatherJson(city) {
    // pulls all cities data available on openweather API
    let queryCityUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;
    let jsonCity = await fetch(queryCityUrl)
        .then(cityResponse => cityResponse.json())
        .then(json => {
            return json;
        });
    // alert will show if city does not exist
    if (!jsonCity.length) {
        alert("Please type a valid city, then click search. OR click on a recent search.");
    }
    // pulls all weather data available on openweather API once city is typed in and submited in ch bar
    const queryWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + jsonCity[0].lat + "&lon=" + jsonCity[0].lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKey;
    let weatherRes = await fetch(queryWeatherUrl)
        .then(response => response.json())
        .then(json => {
            return json;
        });

    return weatherRes;
}

// async function fetchWeatherIcons(icon) {

// }

// takes user input in search bar and runs selectedCity funtion
function searchBtnOnClick() {
    let city = document.getElementById("userInput").value;
    selectedCity(city);
}

// pulls search history from localstorage and renders to Past searches box
function renderHistory() {
    const keys = Object.keys(localStorage);
    let histories = [];
    // for every city searched, it will create an object of city & date and saved in local storage as an array
    for (let i = 0; i < keys.length; i++) {
        let value = localStorage.getItem(keys[i]);
        let history = {
            city: keys[i],
            date: value
        };
        // puts history objects into histories empty array above
        histories.push(history);
    }
    // will sort the past searches by most recent to oldest search
    histories.sort((a, b) => b.date - a.date);

    const searchHistoryList = document.querySelector(".searchHistoryList");
    searchHistoryList.innerHTML = "";
    for (let i = 0; i < histories.length; i++) {
        const historyButton = document.createElement("button");
        historyButton.innerHTML = histories[i].city;
        historyButton.setAttribute("onclick", "selectedCity(\"" + histories[i].city + "\")");
        searchHistoryList.appendChild(historyButton);
    }
}

// funtion for when search button is clicked
async function selectedCity(city) {
    // to fetch weather data from API
    let json = await fetchWeatherJson(city);

    // saves recent searches with date and time in order to sort past searches buttons
    localStorage.setItem(city, new Date());

    // telling json where to put the API data
    const outerDiv = document.querySelector(".selectedCity");
    // prevents old searches from diplaying on page when there is a new search
    outerDiv.innerHTML = "";

    // creates header and date elements inside selected city div
    const cityHeader = document.createElement("h2");

    const header = document.createElement("div");
    header.classList.add("row");

    const currentWeatherImg = document.createElement("img");
    currentWeatherImg.classList.add("customImg");

    // current weather data as ul elements
    const currentWeather = document.createElement("ul");
    // current weather data as list elements
    const tempDiv = document.createElement("li");
    const windDiv = document.createElement("li");
    const humidityDiv = document.createElement("li");
    const UVIndexDiv = document.createElement("li");

    // gives UV index li an ID to change the colors of conditions below
    UVIndexDiv.setAttribute("id", "UVRating");

    //displays the data from API into selected city box
    header.appendChild(cityHeader);
    header.appendChild(currentWeatherImg);
    outerDiv.appendChild(header);
    currentWeather.appendChild(tempDiv);
    currentWeather.appendChild(windDiv);
    currentWeather.appendChild(humidityDiv);
    currentWeather.appendChild(UVIndexDiv);
    outerDiv.appendChild(currentWeather);

    // how data will be displayed in selected city box
    cityHeader.innerHTML = city + " " + moment().format("M/D/YYYY");
    currentWeatherImg.src = "http://openweathermap.org/img/wn/" + json.current.weather[0].icon + "@2x.png";
    tempDiv.innerHTML = "Temp: " + json.current.temp + " °F";
    windDiv.innerHTML = "Wind: " + json.current.wind_speed + " mph";
    humidityDiv.innerHTML = "Humidity: " + json.current.humidity + " %";
    UVIndexDiv.innerHTML = "UV Index: " + json.current.uvi;

    // if else loop for weather icons for current weather


    // if else loop for UV index if conditions are favorable, moderate, or severe
    const uvRating = json.current.uvi
    if (uvRating <= 2.99) {
        document.getElementById("UVRating").style.backgroundColor = 'green';
    } else if (uvRating <= 5.99) {
        document.getElementById("UVRating").style.backgroundColor = 'yellow';
    } else {
        document.getElementById("UVRating").style.backgroundColor = 'red';
    }



    // creates div element for Future forecast box
    // tells where future forecast data to go into correct box
    var futureForecastBox = document.querySelector(".futureForecast");
    // prevents old searches from diplaying on page when there is a new search
    futureForecastBox.innerHTML = "";

    // creates div element inside future forecast box
    let futureForecastDiv = document.createElement("div");
    const futureForecastTitle = document.createElement("h2");
    futureForecastTitle.innerHTML = "5-Day Forecast:";

    let futureWeatherDiv = document.createElement("div");

    futureForecastBox.appendChild(futureForecastDiv);
    futureForecastBox.appendChild(futureWeatherDiv);
    futureForecastDiv.appendChild(futureForecastTitle);

    // for loop to create 5 future forecast cards
    for (let i = 1; i <= 5; i++) {
        // creating 5-day future forecast div inside future forecast box
        // var futureWeather = document.createElement("div");
        // futureCards.setAttribute("id", "cards");
       

        // future forecast data as ul element
        const futureCards = document.createElement("ul");
        // future forecast as list elements
        const futureDate = document.createElement("h3");
        const futureIcon = document.createElement("img");
        const futureTemp = document.createElement("li");
        const futureWind = document.createElement("li");
        const futureHum = document.createElement("li");

        // displays the future forecast title inside future forecast box
        
        // displays the furutre forecast cards inside future forecast box
        // futureWeather.appendChild(futureCards);
        // displays the future forecast data lists inside future cards
        futureWeatherDiv.appendChild(futureCards);
        futureCards.appendChild(futureDate);
        futureCards.appendChild(futureIcon);
        futureCards.appendChild(futureTemp);
        futureCards.appendChild(futureWind);
        futureCards.appendChild(futureHum);

        // displays the future forecast div inside future forecast box
        futureForecastBox.appendChild(futureWeatherDiv);


        // how each weather date will be displayed in each furture forecast card
        futureDate.innerHTML = moment().add(i, "day").format("M/D/YYYY");
        futureIcon.src = "http://openweathermap.org/img/wn/" + json.daily[i].weather[0].icon + "@2x.png";
        futureTemp.innerHTML = "Temp: " + json.daily[i].temp.day + " °F";
        futureWind.innerHTML = "Wind: " + json.daily[i].wind_speed + " mph";
        futureHum.innerHTML = "Humidity: " + json.daily[i].humidity + " %";
       
    }

    
    

    //re-render the history to add the newly searched city
    renderHistory();
}

renderHistory();





























