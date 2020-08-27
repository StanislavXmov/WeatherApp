

class FetchForecast {
  static key = 'APIKey';
  static getWeather = async (id) => {
    const base = `http://dataservice.accuweather.com/currentconditions/v1/`;
    const query = `${id}?apikey=${FetchForecast.key}`;
    const response = await fetch(base + query);
    const data = await response.json();
    return data[0];
  };
  static getCity = async (city) => {
    const base = `http://dataservice.accuweather.com/locations/v1/cities/search`;
    const query = `?apikey=${FetchForecast.key}&q=${city}`;
    const response = await fetch(base + query);
    const data = await response.json();
    return data[0];
  };
}

class WeatherApp {
  constructor() {
    this.locationForm = document.querySelector('.change-location');
    this.card = document.querySelector('.weather-card');
    this.details = document.querySelector('.details-weather');
    this.icon = document.querySelector('.icon-logo img');
  }

  update(data) {
    const {cityDets, weather} = data;
    this.details.innerHTML = `
      <h5 class="city">${cityDets.EnglishName}</h5>
        <div class="weather-desc">
          <div class="temp">
            <span>${weather.Temperature.Metric.Value}</span>
            <span>&deg;C</span>
          </div>
          <div class="condition">${weather.WeatherText}</div>
        </div>
    `;
    const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
    this.icon.setAttribute('src', iconSrc);
    if (this.card.classList.contains('none')) {
      this.card.classList.remove('none');
    }
  }
  async updateCity(city) {
    const cityDets = await FetchForecast.getCity(city);
    const weather = await FetchForecast.getWeather(cityDets.Key);
    return {
      cityDets,
      weather
    }
  }
  init () {
    this.locationForm.addEventListener('submit', e => {
      e.preventDefault();
      const city = this.locationForm.city.value.trim();
      this.locationForm.reset();
      this.updateCity(city).then(data => this.update(data))
      .catch(err => console.log(err))
    });
  }
}

const weatherApp = new WeatherApp();
weatherApp.init();
