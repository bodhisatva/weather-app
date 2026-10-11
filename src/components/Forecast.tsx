import { FC, useCallback, useEffect, useState } from 'react'
import { useLocationContext } from '@/context/LocationContext'
import { ForecastData, Location } from '@/app/api/types'
import { createIcon } from '@/utility/mapWeatherIcon'

export const Forecast: FC = () => {
  const [forecastData, setForecastData] = useState<ForecastData[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { state } = useLocationContext()
  const { userLocationCoordinates, loadingUserCoordinates, cityCoordinates } = state

  const coord = cityCoordinates || userLocationCoordinates

  const fetchForecastData = useCallback(async (coordinates: Location) => {
    const { lat, lon } = coordinates

    try {
      setLoading(true)

      const response = await fetch(`/api/${lat}/${lon}/forecast`)
      const data: ForecastData[] = await response.json()

      if (data) {
        setForecastData(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loadingUserCoordinates) {
      fetchForecastData(coord)
    }
  }, [fetchForecastData, coord, loadingUserCoordinates])

  const renderComponent = !loading && forecastData
  const loadingComponent = loading || loadingUserCoordinates

  return (
    <div className="mt-12 md:mt-48">
      {loadingComponent && (
        <div className="flex items-center justify-center">
          <div className="text-3xl">Loading...</div>
        </div>
      )}
      {renderComponent && (
        <>
          <div
            className="text-2xl md:text-3xl font-bold mb-3 md:mb-6 text-center md:text-start"
            data-cy="forecast"
          >
            Upcoming Days
          </div>
          {forecastData.map(({ id, date, temperatures, rain, icon, description }) => {
            const { day: temperature, min, max } = temperatures

            const [weekday, dayMonth] = date.split(' ')

            const Icon = createIcon(icon)

            return (
              <div className="mb-4" data-cy="forecast-day" key={id}>
                <div className="border border-w-border rounded-[15px] p-4 flex flex-row">
                  <div className="basis-2/3 flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold">{weekday}</span>
                      <span className="text-sm opacity-70">{dayMonth}</span>
                    </div>
                    <div className="flex flex-row items-center gap-2 text-xs">
                      {Icon}
                      <span>{description}</span>
                    </div>
                  </div>
                  <dl className="basis-2/3 grid grid-cols-2 gap-y-3">
                    <dt className="opacity-70">Day</dt>
                    <dd className="text-lg font-semibold">{temperature}</dd>
                    <dt className="opacity-70">High</dt>
                    <dd>{max}</dd>
                    <dt className="opacity-70">Low</dt>
                    <dd>{min}</dd>
                    {rain ? (
                      <>
                        <dt className="opacity-70">Rain</dt>
                        <dd>{rain} mm</dd>
                      </>
                    ) : null}
                  </dl>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
