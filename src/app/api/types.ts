export interface Main {
  temp: number
  temp_min: number
  temp_max: number
}

export type Weather = {
  main: string
  icon: string
  description: string
}

export interface Location {
  lat: number
  lon: number
}

export interface ForecastApiData {
  list: {
    dt: number
    main: Main
    weather: Weather[]
    rain?: {
      '3h': number
    }
  }[]
}

export interface ForecastData {
  id: string
  date: string
  description: string
  temperatures: {
    day: string
    min: string
    max: string
  }
  icon: string
  rain?: number
}

export interface LocationApiData {
  name: string
  sys: { country: string }
}

export interface LocationData {
  cityName: string
  country: string
}

export interface ContextProps {
  params: Location
}

export interface Temperature {
  temperature: string | null
  minTemperature: string | null
  maxTemperature: string | null
}

interface Rain {
  '1h': number
  '3h'?: number
}

export interface WeatherApiData {
  main: Main
  weather: {
    description: string
    icon: string
  }[]
  rain: Rain | null | undefined
}

export interface WeatherData {
  formattedTemperatures: Temperature
  weatherDescription: string
  rain: Rain | null | undefined
  icon: string
}
