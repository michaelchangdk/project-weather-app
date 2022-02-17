// Global DOM Selectors
const body = document.querySelector('body')
const topSection = document.getElementById('topSection')
const middleSection = document.getElementById('middleSection')
// const weatherQuip = document.createElement('h1');
const bottomSection = document.getElementById('bottomSection')
const horizontalRule = document.getElementsByClassName('horizontal-rule');
const title = document.querySelector("title")

//Global variable
let weatherDescriptionObj = {};
// let city = "Gothenburg";
// const API_FORECAST = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=1d70a07080ab5151e3f54886ea0d8389`
// const API_WEATHER = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=1d70a07080ab5151e3f54886ea0d8389`

//Geolocation (Testing)

// Solution 1 - This first part works - but requires the user allows for location tracking. I HATE USER CHOICE. Not using this.
// let longitude
// let latitude
// const locationSuccess = (position) => {
//   const location = position.coords;
//   console.log(`Latitude = ${location.latitude} and Longitutde = ${location.longitude}`);
//   console.log(position.coords);
//   longitude = location.longitude
//   latitude = location.latitude
// }

// const locationError = () => {
//   console.log("Unable to retrieve user's location")
//   middleSection.innerHTML = `
//   <h1 id="weatherQuip" class="weather-quip">Unable to access your location.</h1>
//   `
// }

// navigator.geolocation.getCurrentPosition(locationSuccess, locationError)


// Solution 2 - This works too - it returns city and country, but doesn't need location permission to work

const weatherApp = async () => {
  // This API gets longitude, latitude, IP, city, and country
  const userLocationWait = await fetch(`https://api.freegeoip.app/json/?apikey=e3c872d0-8fd1-11ec-b62f-1506f8441a2e`);
  const userLocation = await userLocationWait.json();
  console.log('longitude latitude IP API', userLocation);
  lat = userLocation.latitude
  lon = userLocation.longitude
  city = userLocation.city
  country = userLocation.country_name
  ip = userLocation.ip
  console.log(`lat ${lat} lon ${lon} city ${city} country ${country} ip ${ip}`)

  // This API takes the city and country and returns sunrise and sunset in local datetime
  const sunWait = await fetch(`https://api.ipgeolocation.io/astronomy?apiKey=cf20150b8ced4a14b02711e51f46b972&location=${city},${country}`);
  const sunJson = await sunWait.json();
  console.log('Sunrise/Sunset API', sunJson);
  sunrise = sunJson.sunrise.replace(":", ".")
  sunset = sunJson.sunset.replace(":", ".")
  console.log(`Sunrise: ${sunrise} and Sunset ${sunset}`)


  // Copy of the API_WEATHER fetch where I input lat and lon instead of cityname
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=1d70a07080ab5151e3f54886ea0d8389`)
    .then((res) => res.json())
    .then((data) => {
      // console.log('weather data', data);
      // console.log(data.weather[0].main);
      title.innerHTML = `${data.name} Weather`
      const weatherDescription = data.weather[0].description
      weatherDescriptionObj["desc"] = data.weather[0].main;

      //SUNRISE_SUNSET section
      //Converting sys sunrise in API from seconds to milliseconds  - then to local SE time HH:MM
      const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString('sv-SE', {
        hour: '2-digit', 
        minute: '2-digit'
      })
      
      //Tried to apply sunriseTime to different time zones - returned the whole date string
      // const sunriseTime = new Date((data.sys.sunrise + new Date().getTimezoneOffset()
      //  * 60 + data.timezone) * 1000).toTimeString('sv-SE', {
      //   hour: '2-digit', 
      //   minute: '2-digit'
      // })

      //Converting sys sunset in API from seconds to milliseconds  - then to local SE time HH:MM
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString('sv-SE', {
        hour: '2-digit', 
        minute: '2-digit'
      })
      
      //Adding sunriseTime + SunsetTime into correct HTML ID of topsection
      //we chose to not have one decimal for aesthetic reasons
      topSection.innerHTML = `
      <p>${weatherDescriptionObj["desc"].toLowerCase()} | ${Math.round(data.main.temp)}°</p>
      <p>sunrise ${sunrise}</p>
      <p>sunset ${sunset}</p>
      `

      if (data.weather[0].main.includes("Clear")) {
        body.className = "sunny"
        middleSection.innerHTML = `
        <img id="weatherIcon" class="weather-icon" src="Designs/Design-2/icons/noun_Sunglasses_2055147.svg" />
        <h1 id="weatherQuip" class="weather-quip">Get your sunnies on. ${data.name} is looking rather great today.</h1>
        `
      } else if (data.weather[0].main.includes("Clouds")) {
        body.className = "cloudy"
        middleSection.innerHTML = `
        <img id="weatherIcon" class="weather-icon" src="Designs/Design-2/icons/noun_Cloud_1188486.svg" />
        <h1 id="weatherQuip" class="weather-quip">Light a fire and get cosy. ${data.name} is looking grey today.</h1>
        `
      } else { // if the word == "Rain"
        body.className = "rainy"
        middleSection.innerHTML = `
        <img id="weatherIcon" class="weather-icon" src="Designs/Design-2/icons/noun_Umbrella_2030530.svg" />
        <h1 id="weatherQuip" class="weather-quip">Don't forget your umbrella. It's wet in ${data.name} today.</h1>
        `
      };
    
    
  });

  // Copy of the API_FORECAST fetch where I input lat & lon instead of city and country
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=1d70a07080ab5151e3f54886ea0d8389`)
    .then((res) => res.json())
    .then((data) => {
          console.log(`fetch forecast`, data)
          const filteredForecast = data.list.filter(item => item.dt_txt.includes('12:00')); //array with the next five days' forecast
          // console.log("filteredForecast '12:00'", filteredForecast)

          filteredForecast.forEach((dayObj) => {
            const d = new Date(dayObj.dt * 1000).toLocaleDateString("en", {
              weekday: "short"
            }).toLowerCase();
            
            const temp_ = Math.round(dayObj.main.temp) //we chose to not have one decimal for aesthetic reasons
            bottomSection.innerHTML += 
            `
            <div id="forecastContainer" class="forecast-container">
              <p class="weekday">${d}</p>
              <div class="forecast-container__right">
                <!---<img class="weatherIcon--small" width="50vw" src="http://openweathermap.org/img/wn/${dayObj.weather[0].icon}@2x.png"/>--->
                <p class="weekdayTemp">${temp_}°</p>
              </div>
            </div>
            <hr class="horizontal-rule">
            `
          })
          if (weatherDescriptionObj["desc"] === "Clear") {
            document.querySelectorAll(".horizontal-rule").forEach(item => item.className = "horizontal-rule hr--sunny")
          } else if (weatherDescriptionObj["desc"] === "Clouds") {
            document.querySelectorAll(".horizontal-rule").forEach(item => item.className = "horizontal-rule hr--cloudy")
          } else {
            document.querySelectorAll(".horizontal-rule").forEach(item => item.className = "horizontal-rule hr--rainy")
          }
            
      });
}

weatherApp();


// Today's Weather, Sunset & Sunrise
// fetch(API_WEATHER)
//   .then((res) => res.json())
//   .then((data) => {
//     // console.log('weather data', data);
//     // console.log(data.weather[0].main);
//     title.innerHTML = `${data.name} Weather`
//     const weatherDescription = data.weather[0].description
//     weatherDescriptionObj["desc"] = data.weather[0].main;

//     //SUNRISE_SUNSET section
//     //Converting sys sunrise in API from seconds to milliseconds  - then to local SE time HH:MM
//     const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString('sv-SE', {
//       hour: '2-digit', 
//       minute: '2-digit'
//     })
    
//     //Tried to apply sunriseTime to different time zones - returned the whole date string
//     // const sunriseTime = new Date((data.sys.sunrise + new Date().getTimezoneOffset()
//     //  * 60 + data.timezone) * 1000).toTimeString('sv-SE', {
//     //   hour: '2-digit', 
//     //   minute: '2-digit'
//     // })

//     //Converting sys sunset in API from seconds to milliseconds  - then to local SE time HH:MM
//     const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString('sv-SE', {
//       hour: '2-digit', 
//       minute: '2-digit'
//     })
    
//     //Adding sunriseTime + SunsetTime into correct HTML ID of topsection
//     //we chose to not have one decimal for aesthetic reasons
//      topSection.innerHTML =`
//      <p>${weatherDescriptionObj["desc"].toLowerCase()} | ${Math.round(data.main.temp)}°</p>
//      <p>sunrise ${sunriseTime}</p>
//      <p>sunset ${sunsetTime}</p>`

//     if (data.weather[0].main.includes("Clear")) {
//       body.className = "sunny"
//       middleSection.innerHTML = `
//       <img id="weatherIcon" class="weather-icon" src="Designs/Design-2/icons/noun_Sunglasses_2055147.svg" />
//       <h1 id="weatherQuip" class="weather-quip">Get your sunnies on. ${data.name} is looking rather great today.</h1>
//       `
//     } else if (data.weather[0].main.includes("Clouds")) {
//       body.className = "cloudy"
//       middleSection.innerHTML = `
//       <img id="weatherIcon" class="weather-icon" src="Designs/Design-2/icons/noun_Cloud_1188486.svg" />
//       <h1 id="weatherQuip" class="weather-quip">Light a fire and get cosy. ${data.name} is looking grey today.</h1>
//       `
//       console.log(document.querySelectorAll(".horizontal-rule"))
//     } else { // if the word == "Rain"
//       body.className = "rainy"
//       middleSection.innerHTML = `
//       <img id="weatherIcon" class="weather-icon" src="Designs/Design-2/icons/noun_Umbrella_2030530.svg" />
//       <h1 id="weatherQuip" class="weather-quip">Don't forget your umbrella. It's wet in ${data.name} today.</h1>
//       `
//     };
    
    
//   });

// 5 Day Forecast
// fetch(API_FORECAST)
// .then((res) => res.json())
// .then((data) => {
//       console.log(`fetch forecast`, data)
//       const filteredForecast = data.list.filter(item => item.dt_txt.includes('12:00')); //array with the next five days' forecast
//       // console.log("filteredForecast '12:00'", filteredForecast)

//       filteredForecast.forEach((dayObj) => {
//         const d = new Date(dayObj.dt * 1000).toLocaleDateString("en", {
//           weekday: "short"
//         }).toLowerCase();
        
//         const temp_ = Math.round(dayObj.main.temp) //we chose to not have one decimal for aesthetic reasons
//         bottomSection.innerHTML += 
//         `
//         <div id="forecastContainer" class="forecast-container">
//           <p class="weekday">${d}</p>
//           <div class="forecast-container__right">
//             <!---<img class="weatherIcon--small" width="50vw" src="http://openweathermap.org/img/wn/${dayObj.weather[0].icon}@2x.png"/>--->
//             <p class="weekdayTemp">${temp_}°</p>
//           </div>
//         </div>
//         <hr class="horizontal-rule">
//         `
//       })
//       if (weatherDescriptionObj["desc"] === "Clear") {
//         document.querySelectorAll(".horizontal-rule").forEach(item => item.className = "horizontal-rule hr--sunny")
//       } else if (weatherDescriptionObj["desc"] === "Clouds") {
//         document.querySelectorAll(".horizontal-rule").forEach(item => item.className = "horizontal-rule hr--cloudy")
//       } else {
//         document.querySelectorAll(".horizontal-rule").forEach(item => item.className = "horizontal-rule hr--rainy")
//       }
        
//   });

// weather[0].main: Clear = Sunny, Clouds = Cloud, Rain = Rain
// Documentation from openweathermap https://openweathermap.org/weather-conditions