export interface Main {
  temp: number
  temp_min: number
  temp_max: number
}

export type Weather = {
  main: string
  icon: string
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
