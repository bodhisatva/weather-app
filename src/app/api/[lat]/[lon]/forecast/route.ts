import { type NextRequest } from 'next/server'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { formatClosestInteger } from '@/utility/formatTemperature'
import { Main } from '../weather/route'

type Weather = {
  main: string
  icon: string
}

interface ForecastApiData {
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

  const { WEATHER_API_FORECAST, API_KEY } = process.env

  // I had problems with the onecall API, it was returning a 401 error and probably related to subscription
  // so I used the forecast API instead (5 days forecast)

  const query = `${WEATHER_API_FORECAST}${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  try {
    const res = await fetch(query, { next: { revalidate: 0 } })
    const daily: ForecastApiData = await res.json()

    const temperaturesAtAfternoon = daily.list.filter(
      ({ dt }) => format(new Date(dt * 1000), 'kk:mm') === '15:00'
    )

    const dailyTemperatures = daily.list.reduce(
      (acc, { dt, main }) => {
        const date = format(new Date(dt * 1000), 'EEEE d.M')

        acc[date] = acc[date] || []
        acc[date].push(main.temp)

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

    const mapWeatherIcon = (weather: Weather[]) => {
      const { icon } = weather[0]

      return icon
    }

    const findMinTemperature = (date: string) => {
      const currentDate = dailyMinAndMaXTemperatures.filter(({ date: day }) => day === date)
      return formatClosestInteger(currentDate[0].min)
    }

    const findMaxTemperature = (date: string) => {
      const currentDate = dailyMinAndMaXTemperatures.filter(({ date: day }) => day === date)
      return formatClosestInteger(currentDate[0].max)
    }

    const response: ForecastData[] = temperaturesAtAfternoon.map(({ dt, main, weather, rain }) => {
      const date = format(new Date(dt * 1000), 'EEEE d.M')
      return {
        id: uuidv4(),
        date,
        temperatures: {
          day: formatClosestInteger(main.temp),
          min: findMinTemperature(date),
          max: findMaxTemperature(date)
        },
        icon: mapWeatherIcon(weather),
        rain: rain?.['3h'] || 0
      }
    })

    return Response.json(response)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    console.error('Error:', errorMessage)
    return Response.json({ message: errorMessage })
  }
}
