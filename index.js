/**
 * ALL OF MY ELEMENTS
 */


var input = document.querySelector('#input')


input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        createWeatherDisplay(event.target.value)

    }
})


var previousSearchHistory = localStorage.getItem('history')
if (previousSearchHistory) {
    previousSearchHistory = JSON.parse(previousSearchHistory)
} else {
    previousSearchHistory = []
}

for (var i = 0; i < previousSearchHistory.length; i++) {
    var historyBtn = document.createElement('button')
    var historyItem = previousSearchHistory[i]
    historyBtn.textContent = historyItem
    historyBtn.addEventListener('click', function(event) {
        createWeatherDisplay(event.target.textContent)
    })
    historyBtn.setAttribute('class','citybtn')
    document.getElementById('cities').appendChild(historyBtn)
}
// var timeEl = $(".date-time");
// var timerInterval;

// var startTimer = function() {
//    timerInterval = setInterval(function () {
//    var currentTime = moment()("MMM Do, YYYY [at] hh:mm:ss a");
//    timeEl.text(currentTime);
// }, 1000);
// };

// startTimer();

var API_KEY = apikey

function getGeoLocation(query, limit = 5) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`)
}

function getCurrentWeather(arguments) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${arguments.lat}&lon=${arguments.lon}&units=${arguments.units}&appid=${API_KEY}`)
}    

function addToHistory(location) {
    var searchHistory = localStorage.getItem('history')
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory)

    if  (searchHistory.includes(location)) {
        return
        }

    searchHistory.push(location)
    localStorage.setItem('history', JSON.stringify(searchHistory))
    } else {
        searchHistory = [location]
        localStorage.setItem('history', JSON.stringify(searchHistory))
    }
}

// A function that returns a promise. The promise is a fetch to api geolocator
function createWeatherDisplay(location) {
    return getGeoLocation(location)
    .then(function(response) {
        return response.json()
    })
.then(data => {
    console.log(data)
    if (data.length === 0) {
        var erroEl = document.createElement('p')
        erroEl.textContent = `We coudln't find ${location}`
        document.body.appendChild(erroEl)
    } else {
    getCurrentWeather({ lat: data[0].lat, lon: data[0].lon })
    .then(weatherResponse => weatherResponse.json())
    .then(weatherData => {
        console.log(weatherData)
        var weatherPicture = document.createElement('img')
        weatherPicture.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        var currentWeatherStatement = document.createElement('p')
        currentWeatherStatement.textContent =  `${weatherData.weather[0].main}: it is currently ${weatherData.weather[0].description}`
        document.body.appendChild(weatherPicture)
        document.body.appendChild(currentWeatherStatement)
        addToHistory(location)
    })
    .catch(error => {
        document.body.textContent = error.message
    })
    }
})

.catch(error => {
    document.body.textContent = error.message
})

 
}


// var cardContain =  document.createElement("div")
// cardContain.setAttribute('class', 'weathercard')
// var temp = document.createElement('p')
// tempj.textContent = 'somedata'
// var wind = document.createElement('p')
// var hum = document.createElement('p')
// cardContain.append(temp,wind,hum)
// document.getElementById("futureWeather").append(cardContain)