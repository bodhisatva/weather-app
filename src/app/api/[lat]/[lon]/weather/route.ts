import { type NextRequest } from 'next/server'
import { format } from 'date-fns'
import { formatClosestInteger } from '@/utility/formatTemperature'
import { capitaliseFirstCharacter } from '@/utility/formatStrings'
import { ForecastApiData } from '@/app/api/types'

interface Temperature {
  temperature: string | null
  minTemperature: string | null
  maxTemperature: string | null
}

export interface Main {
  temp: number
  temp_min: number
  temp_max: number
}

interface Rain {
  '1h': number
  '3h'?: number
}

interface WeatherApiData {
  main: Main
  weather: {
    description: string
  }[]
  rain: Rain | null | undefined
}

export interface WeatherData {
  formattedTemperatures: Temperature
  weatherDescription: string
  rain: Rain | null | undefined
}

interface ContextProps {
  params: {
    lat: number
    lon: number
  }
}

export async function GET(request: NextRequest, context: ContextProps) {
  const { params } = context
  const { lat, lon } = params
  const { WEATHER_API, API_KEY, WEATHER_API_FORECAST } = process.env

  const currentWeatherQuery = `${WEATHER_API}${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  const forecastQuery = `${WEATHER_API_FORECAST}${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  try {
    const currentWeatherResponse = await fetch(currentWeatherQuery, { next: { revalidate: 0 } })
    const currentData: WeatherApiData = await currentWeatherResponse.json()

    const response = await fetch(forecastQuery, { next: { revalidate: 0 } })
    const forecastData: ForecastApiData = await response.json()

    const { main, weather, rain } = currentData
    const { temp } = main
    const { description } = weather[0]

    const dailyTemperatures = forecastData.list.reduce(
      (acc, { dt, main: m }) => {
        const date = format(new Date(dt * 1000), 'EEEE d.M')

        acc[date] = acc[date] || []
        acc[date].push(m.temp)

        return acc
      },
      {} as Record<string, number[]>
    )

    const dailyMinAndMaXTemperatures = Object.entries(dailyTemperatures).map(
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
      rain
    }

    return Response.json(responseObject)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    console.error('Error:', errorMessage)

    return Response.json({ message: errorMessage })
  }
}
