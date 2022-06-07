
function getWeather(city) {
    var APIKey = "fecd3d56b2813a3ed8fb92d0063908c5";
    var oneCallBaseEndPoint = 'https://api.openweathermap.org/data/2.5/onecall'
    var weatherBaseEndPoint = 'https://api.openweathermap.org/data/2.5/weather';
    fetch(weatherBaseEndPoint + `?q=${encodeURI(city)}&appid=${APIKey}`)
    .then(weatherRes => weatherRes.json())
    .then(weatherData => {
      console.log('weather data', weatherData)
      var lat = weatherData.coord.lat;
      var lon = weatherData.coord.lon;
      console.log('lat and lon', { lat, lon })
      fetch(oneCallBaseEndPoint + `?lat=${lat}&lon=${lon}&appid=${APIKey}`)
      .then(oneCallRes => oneCallRes.json())
      .then(oneCallData => {
        var currentWeather = oneCallData.current.weather[0].main
        console.log('currentWeather', currentWeather)
        document.querySelector('#weather').textContent = currentWeather
        console.log(oneCallData)
        var baseUrl = 'http://api.openweathermap.org/geo/1.0/direct'
        return fetch(`${baseUrl}?q=${name}&limit=5&appid=${APIKey}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          return ({ 
            coords: {
              lat: data[0].lat, 
              lon: data[0].lon 
            },
            name: data[0].name
          })
        })
        .catch(err => console.log(err))
      })
    })
  }
  document.querySelector('#search').addEventListener('click', function() {
    var inputedCity = document.querySelector('#cityInput').value
    console.log('city', inputedCity)
    getWeather(inputedCity)
  })