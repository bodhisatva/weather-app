import { type NextRequest } from 'next/server'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { formatClosestInteger } from '@/utility/formatTemperature'
import { ForecastApiData, ContextProps, ForecastData, Weather } from '@/app/api/types'
import { dailyTemperatures } from '@/utility/mapDailyTemperatures'
import { capitaliseFirstCharacter } from '@/utility/formatStrings'

export async function GET(request: NextRequest, context: ContextProps) {
  const { params } = context
  const { lat, lon } = await params

  const { WEATHER_API_FORECAST, API_KEY } = process.env

  const query = `${WEATHER_API_FORECAST}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  try {
    const response = await fetch(query, { next: { revalidate: 0 } })
    const daily: ForecastApiData = await response.json()

    const temperaturesInAfternoon = daily.list.filter(
      ({ dt_txt }) => format(dt_txt, 'kk:mm') === '15:00'
    )

    const { dailyTemperatureList } = dailyTemperatures(daily)

    const dailyMinAndMaXTemperatures = Object.entries(dailyTemperatureList).map(
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

    const responseArray: ForecastData[] = temperaturesInAfternoon.map(
      ({ dt, main, weather, rain }) => {
        const date = format(new Date(dt * 1000), 'EEEE d.M')
        const { description } = weather[0]

        return {
          id: uuidv4(),
          date,
          description: capitaliseFirstCharacter(description),
          temperatures: {
            day: formatClosestInteger(main.temp),
            min: findMinTemperature(date),
            max: findMaxTemperature(date)
          },
          icon: mapWeatherIcon(weather),
          rain: rain?.['3h'] || 0
        }
      }
    )

    return Response.json(responseArray)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    console.error('Error:', errorMessage)

    return Response.json({ message: errorMessage })
  }
}
