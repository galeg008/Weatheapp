/**
 * ALL OF MY ELEMENTS
 */
var weatherContainerEl = $("#results")
var timeEl = $(".date-time");
var timerInterval;

var startTimer = function () {
    timerInterval = setInterval(function () {
        var currentTime = moment().format("MMM Do, YYYY [at] hh:mm:ss a");
        timeEl.text(currentTime);
    }, 1000);
};

startTimer();

var input = document.querySelector('#input')

//currently ust listens for enter keyup, also need listen on button click on search
input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        createWeatherDisplay(event.target.value)

    }
})

//click event listener
$("#searchbtn").click(function (event) {
    //grab text from input ele
    var text = $("#input").val()
    createWeatherDisplay(text)
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
    historyBtn.addEventListener('click', function (event) {
        createWeatherDisplay(event.target.textContent)
    })
    historyBtn.setAttribute('class', 'citybtn')
    document.getElementById('cities').appendChild(historyBtn)
}


var API_KEY = apikey

function getGeoLocation(query, limit = 5) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${apikey}`)
}

function getCurrentWeather(arguments) {
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${arguments.lat}&lon=${arguments.lon}&units=${arguments.units}&appid=${apikey}`)
}

function addToHistory(location) {
    var searchHistory = localStorage.getItem('history')
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory)

        if (searchHistory.includes(location)) {
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
        .then(function (response) {
            return response.json()
        })
        .then(data => {
            console.log(data)
            if (data.length === 0) {
                var erroEl = document.createElement('p')
                erroEl.textContent = `We coudln't find ${location}`
                document.body.appendChild(erroEl)
            } else {
                getCurrentWeather({ lat: data[0].lat, lon: data[0].lon, units:"imperial" })
                    .then(weatherResponse => weatherResponse.json())
                    .then(weatherData => {

                        //instead of body, append to the container
                        //clean up container El each time
                        //call a function that creates the weather forecast elements on page
                        createWeatherElements(weatherData)
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
//TODO, also need forecast data from another endpoint
//this is the function that gets called to create the forecast elements after api success
function createWeatherElements(weatherData) {
    weatherContainerEl.empty()
    console.log(weatherData)
    var weatherPicture = document.createElement('img')
    weatherPicture.src = `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`
    var currentWeatherStatement = document.createElement('p')
    currentWeatherStatement.textContent = `${weatherData.current.weather[0].main}: it is currently ${weatherData.current.weather[0].description}`
    weatherContainerEl.append(weatherPicture)
    weatherContainerEl.append(currentWeatherStatement)
}


