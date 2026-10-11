import { ForecastApiData } from '@/app/api/types'

const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' })

export const toLocalDate = (dt: number, timezone: number) => new Date((dt + timezone) * 1000)

export const formatDayLabel = (localDate: Date) =>
  `${weekdayFormatter.format(localDate)} ${localDate.getUTCDate()}.${localDate.getUTCMonth() + 1}`

export const dailyTemperatures = (data: ForecastApiData) => {
  const { timezone } = data.city

  const dailyTemperatureList = data.list.reduce(
    (acc, { dt, main: m }) => {
      const date = formatDayLabel(toLocalDate(dt, timezone))

      acc[date] = acc[date] || []
      acc[date].push(m.temp)

      return acc
    },
    {} as Record<string, number[]>
  )
  return { dailyTemperatureList }
}
