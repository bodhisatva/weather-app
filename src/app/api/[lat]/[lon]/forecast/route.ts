import { type NextRequest } from 'next/server'
import { format } from 'date-fns'
import { formatClosestInteger } from '@/utility/formatTemperature'
import { ForecastApiData, ContextProps, ForecastData } from '@/app/api/types'
import { dailyTemperatures } from '@/utility/mapDailyTemperatures'
import { capitaliseFirstCharacter } from '@/utility/formatStrings'
import { assertValidCoordinates, fetchOpenWeather, toErrorResponse } from '@/app/api/openweather'

export async function GET(request: NextRequest, context: ContextProps) {
  try {
    const { params } = context
    const { lat, lon } = await params

    assertValidCoordinates(lat, lon)

    const daily = await fetchOpenWeather<ForecastApiData>(
      process.env.WEATHER_API_FORECAST,
      lat,
      lon
    )

    const temperaturesInAfternoon = daily.list.filter(
      ({ dt_txt }) => format(dt_txt, 'kk:mm') === '15:00'
    )

    const { dailyTemperatureList } = dailyTemperatures(daily)

    const responseArray: ForecastData[] = temperaturesInAfternoon.map(
      ({ dt, main, weather, rain }) => {
        const date = format(new Date(dt * 1000), 'EEEE d.M')
        const { description, icon } = weather[0]
        const temperatures = dailyTemperatureList[date]

        return {
          id: String(dt),
          date,
          description: capitaliseFirstCharacter(description),
          temperatures: {
            day: formatClosestInteger(main.temp),
            min: formatClosestInteger(Math.min(...temperatures)),
            max: formatClosestInteger(Math.max(...temperatures))
          },
          icon,
          rain: rain?.['3h'] || 0
        }
      }
    )

    return Response.json(responseArray)
  } catch (error) {
    return toErrorResponse(error)
  }
}
