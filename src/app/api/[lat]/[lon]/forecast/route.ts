import { type NextRequest } from 'next/server'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import forecast from './forecast.json'
import { formatClosestInteger } from '@/utility/formatTemperature'

type Weather = {
  main: string
  icon: string
}

export interface ForecastData {
  id: string
  date: string
  temperatures: {
    day: string
    min: string
    max: string
  }
  icon: string
  rain?: number
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

  const { WEATHER_API_ONECALL, API_KEY } = process.env

  const exclude = 'exclude=current,minutely,hourly,alerts'

  // I had problems with the onecall API, it was returning a 401 error and probably related to subscription
  // so I mocked the response with the forecast.json file to simulate the API response. You get the point.

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const query = `${WEATHER_API_ONECALL}${lat}&lon=${lon}&${exclude}&appid=${API_KEY}&units=metric`

  const { daily } = forecast

  try {
    // Query the API
    // const response = await fetch(query, { next: { revalidate: 0 } })
    // const daily = await response.json()

    const mapWeatherIcon = (weather: Weather[]) => {
      const { icon } = weather[0]

      return icon
    }

    // Because of mocked data. No need when using query (line 40).
    const convertToCelsius = (kelvin: number) => kelvin - 273.15

    const response: ForecastData[] = daily.map(({ dt, temp, weather, rain }) => ({
      id: uuidv4(),
      date: format(new Date(dt * 1000), 'EEEE d.M'),
      temperatures: {
        day: formatClosestInteger(convertToCelsius(temp.day)),
        min: formatClosestInteger(convertToCelsius(temp.min)),
        max: formatClosestInteger(convertToCelsius(temp.max))
      },
      icon: mapWeatherIcon(weather),
      rain: rain || 0
    }))

    return Response.json(response)
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ message: error })
  }
}
