
<br/>

<p align="center"  style="border-radius: 10px;">
  <img  width="150" alt="title" src="https://github.com/bodhisatva/weather-app/assets/7481706/1f1fbf93-b6f6-4dc3-aec2-a4550010e64d" >
</p>

# Weather Site

The weather app offers the current temperature based on your location, allows you to search for weather conditions in specific areas within Finland, and provides a five-day forecast.

## Getting Started

First, create a free account on [OpenWeather](https://openweathermap.org/appid).

Create **.env.local** file in the project root and add variables. Replace the value of **API_KEY** with your account's API key.


```bash
API_KEY={your-open-weather-map API key}
WEATHER_API=https://api.openweathermap.org/data/2.5/weather
WEATHER_API_FORECAST=https://api.openweathermap.org/data/2.5/forecast
```

To start the project run:

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing

To run **e2e** test:

```bash
yarn run cypress
```

###

View Weather Site in **Vercel**: [https://weather-app-mauve-eight-31.vercel.app/](https://weather-app-mauve-eight-31.vercel.app/)
