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
import { assertValidCoordinates, fetchOpenWeather, toErrorResponse } from '@/app/api/openweather'

export async function GET(request: NextRequest, context: ContextProps) {
  try {
    const { params } = context
    const { lat, lon } = await params

    assertValidCoordinates(lat, lon)

    // https://openweathermap.org/current and https://openweathermap.org/forecast5
    const [currentData, forecastData] = await Promise.all([
      fetchOpenWeather<WeatherApiData>(process.env.WEATHER_API, lat, lon),
      fetchOpenWeather<ForecastApiData>(process.env.WEATHER_API_FORECAST, lat, lon)
    ])

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
    return toErrorResponse(error)
  }
}
