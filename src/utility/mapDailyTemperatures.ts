import { format } from 'date-fns'
import { ForecastApiData } from '@/app/api/types'

export const dailyTemperatures = (data: ForecastApiData) => {
  const dailyTemperatureList = data.list.reduce(
    (acc, { dt, main: m }) => {
      const date = format(new Date(dt * 1000), 'EEEE d.M')

      acc[date] = acc[date] || []
      acc[date].push(m.temp)

      return acc
    },
    {} as Record<string, number[]>
  )
  return { dailyTemperatureList }
}
