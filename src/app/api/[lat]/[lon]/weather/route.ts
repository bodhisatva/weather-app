import { type NextRequest } from 'next/server'
import { formatClosestInteger } from '@/utility/formatTemperature'
import { capitaliseFirstCharacter } from '@/utility/formatStrings'
import {
  ContextProps,
  ForecastApiData,
  Temperature,
  WeatherApiData,
  WeatherData
} from '@/app/api/types'
import { dailyTemperatures } from '@/utility/mapDailyTemperatures'

export async function GET(request: NextRequest, context: ContextProps) {
  const { params } = context
  const { lat, lon } = params
  const { WEATHER_API, API_KEY, WEATHER_API_FORECAST } = process.env

  const currentWeatherQuery = `${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  const forecastQuery = `${WEATHER_API_FORECAST}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  try {
    const currentWeatherResponse = await fetch(currentWeatherQuery, { next: { revalidate: 0 } })
    const currentData: WeatherApiData = await currentWeatherResponse.json()

    const response = await fetch(forecastQuery, { next: { revalidate: 0 } })
    const forecastData: ForecastApiData = await response.json()

    const { main, weather, rain } = currentData
    const { temp } = main
    const { description, icon } = weather[0]

    const { dailyTemperatureList } = dailyTemperatures(forecastData)

    const dailyMinAndMaXTemperatures = Object.entries(dailyTemperatureList).map(
      ([date, temperatures]) => {
        return {
          date,
          min: Math.min(...temperatures),
          max: Math.max(...temperatures)
        }
      }
    )

    const maxTemperature = dailyMinAndMaXTemperatures[0].max
    const minTemperature = dailyMinAndMaXTemperatures[0].min

    const formattedTemperatures: Temperature = {
      temperature: formatClosestInteger(temp),
      minTemperature: formatClosestInteger(minTemperature),
      maxTemperature: formatClosestInteger(maxTemperature)
    }

    const responseObject: WeatherData = {
      formattedTemperatures,
      weatherDescription: capitaliseFirstCharacter(description),
      rain,
      icon
    }

    return Response.json(responseObject)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    console.error('Error:', errorMessage)

    return Response.json({ message: errorMessage })
  }
}
