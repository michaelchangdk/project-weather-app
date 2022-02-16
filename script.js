// Global DOM Selectors
const body = document.querySelector('body')
const topSection = document.getElementById('topSection')
const middleSection = document.getElementById('middleSection')
// const weatherQuip = document.createElement('h1');
const bottomSection = document.getElementById('bottomSection')

//Global variable
// const weekday = ["sun","mon","tue","wed","thu","fri","sat"];
// const d = new Date();
// let weekdayCounter = 1;
// let dayIndex = d.getDay()
// let weekdayIndex = dayIndex + weekdayCounter

fetch('https://api.openweathermap.org/data/2.5/forecast?q=Gothenburg,Sweden&units=metric&APPID=1d70a07080ab5151e3f54886ea0d8389')
  .then((res) => res.json())
  .then((data) => {
        console.log(`fetch forecast`, data)
        const filteredForecast = data.list.filter(item => item.dt_txt.includes('12:00')); //array with the next five days' forecast
        console.log("filteredForecast '12:00'", filteredForecast)

        filteredForecast.forEach((dayObj) => {
          const d = new Date(dayObj.dt * 1000).toLocaleDateString("en", {
            weekday: "short"
          }).toLowerCase();
          
          // weekdayIndex++
          // if (weekdayIndex > 6) {
          //   weekdayCounter = 0;
          //   weekdayIndex = 0;
          // }
          
          // let dayIndex = d.getDay()
          // let day = weekday[dayIndex];
          // let day = weekday[weekdayIndex];
          const temp_ = Math.round(dayObj.main.temp)
          bottomSection.innerHTML += 
          `
          <div id="forecastContainer" class="forecast-container">
            <p class="weekday">${d}</p>
            <div class="forecast-container__right">
              <img class="weatherIcon--small" width="50vw" src="http://openweathermap.org/img/wn/${dayObj.weather[0].icon}@2x.png"/>
              <p class="weekdayTemp">${temp_}°</p>
            </div>
          </div>
          <hr class="horizontal-rule">
          `
        })
    });


fetch('https://api.openweathermap.org/data/2.5/weather?q=Gothenburg,Sweden&units=metric&APPID=1d70a07080ab5151e3f54886ea0d8389')
  .then((res) => res.json())
  .then((data) => {
    console.log('weather data', data);
    // console.log(data.weather[0].main);
    const weatherDescription = data.weather[0].description
    if (data.weather[0].main.includes("Clear")) {
      body.classList.add("sunny")
      body.classList.remove("cloudy")
      body.classList.remove("rainy")
    } else if (data.weather[0].main.includes("Clouds")) {
      body.classList.remove("sunny")
      body.classList.add("cloudy")
      body.classList.remove("rainy")
    } else { // if the word == "Rain"
      body.classList.remove("sunny")
      body.classList.remove("cloudy")
      body.classList.add("rainy")
    }
    const todayTemp = Math.round(data.main.temp)
    middleSection.innerHTML = `
    <h1>${data.name}</h1>
    <p>${todayTemp}°</p>
    <p>${weatherDescription}</p>
    `
  });

// weather[0].main: Clear = Sunny, Clouds = Cloud, Rain = Rain
// Documentation from openweathermap https://openweathermap.org/weather-conditions