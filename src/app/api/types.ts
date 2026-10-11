export interface Main {
  temp: number
  temp_min: number
  temp_max: number
}

export type Weather = {
  id: number
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
    dt_txt: string
  }[]
  city: {
    timezone: number
  }
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
  conditionId: number
  rain?: number
}

export interface ContextProps {
  params: Promise<{ lat: string; lon: string }>
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
  name: string
  sys: {
    country: string
  }
  main: Main
  weather: {
    id: number
    description: string
    icon: string
  }[]
  rain: Rain | null | undefined
}

export interface WeatherData {
  cityName: string
  country: string
  formattedTemperatures: Temperature
  weatherDescription: string
  rain: Rain | null | undefined
  icon: string
  conditionId: number
}
