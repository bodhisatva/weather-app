import { FC, useCallback, useEffect, useState } from 'react'
import Rain from 'public/icons/rain.svg'
import MaxTempIcon from 'public/icons/thermometer.svg'
import MinTempIcon from 'public/icons/thermometer-minus.svg'
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
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (coord) {
      fetchForecastData(coord)
    }
  }, [fetchForecastData, coord])

  const renderComponent = !loading && forecastData && !loadingUserCoordinates
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

            const Icon = createIcon(icon)

            return (
              <div className="mb-4" data-cy="forecast-day" key={id}>
                <div className="border border-[#4F6A94] rounded-[15px] pt-4 px-4">
                  <div className="flex flex-row w-full">
                    <div className="basis-2/3">{date}</div>
                    <div className="flex items-center mb-3 basis-1/3">{Icon}</div>
                    <div className="basis-1/3">{temperature}</div>
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="basis-2/3 text-xs">{description}</div>
                    <div className="flex items-center mb-3 basis-1/3">
                      <MaxTempIcon className="mr-1" />
                    </div>
                    <div className="basis-1/3">Max: {max}</div>
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="basis-2/3" />
                    <div className="flex items-center mb-3 basis-1/3">
                      <MinTempIcon className="mr-1" />
                    </div>
                    <div className="basis-1/3">Min: {min}</div>
                  </div>

                  {rain ? (
                    <div className="flex flex-row w-full mb-4">
                      <div className="basis-2/3" />
                      <div className="flex items-center basis-1/3">
                        <Rain className="mr-1" />
                      </div>
                      <div className="basis-1/3">{`Rain ${rain} mm`}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
