import { useQuery } from '@tanstack/react-query'
import { WeatherData } from '@/app/api/types'

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

export const useFetchWeather = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchWeather(lat, lon)
  })
}
