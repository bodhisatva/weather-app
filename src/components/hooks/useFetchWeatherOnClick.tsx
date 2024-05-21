import { WeatherData } from '@/app/api/types'
import { useQuery } from '@tanstack/react-query'

const fetchWeather = async (lat: number, lon: number) => {
  try {
    const response = await fetch(`/api/${lat}/${lon}/weather`)
    const data: WeatherData = await response.json()

    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const useFetchWeatherOnClick = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['weather-onclick'],
    queryFn: () => fetchWeather(lat, lon),
    enabled: false
  })
}
