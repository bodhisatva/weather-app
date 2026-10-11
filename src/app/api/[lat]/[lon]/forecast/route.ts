import { type NextRequest } from 'next/server'
import { formatClosestInteger } from '@/utility/formatTemperature'
import { ForecastApiData, ContextProps, ForecastData } from '@/app/api/types'
import { dailyTemperatures, formatDayLabel, toLocalDate } from '@/utility/mapDailyTemperatures'
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

    const { timezone } = daily.city

    const distanceFromAfternoon = (dt: number) => {
      const localDate = toLocalDate(dt, timezone)
      return Math.abs(localDate.getUTCHours() + localDate.getUTCMinutes() / 60 - 14)
    }

    const afternoonSlots = new Map<string, ForecastApiData['list'][number]>()

    daily.list.forEach((slot) => {
      const distance = distanceFromAfternoon(slot.dt)

      if (distance > 2) {
        return
      }

      const date = formatDayLabel(toLocalDate(slot.dt, timezone))
      const current = afternoonSlots.get(date)

      if (!current || distance < distanceFromAfternoon(current.dt)) {
        afternoonSlots.set(date, slot)
      }
    })

    const { dailyTemperatureList } = dailyTemperatures(daily)

    const responseArray: ForecastData[] = [...afternoonSlots.values()]
      .slice(0, 5)
      .map(({ dt, main, weather, rain }) => {
        const date = formatDayLabel(toLocalDate(dt, timezone))
        const { id: conditionId, description, icon } = weather[0]
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
          conditionId,
          rain: rain?.['3h'] || 0
        }
      })

    return Response.json(responseArray)
  } catch (error) {
    return toErrorResponse(error)
  }
}
