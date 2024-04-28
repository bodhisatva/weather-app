import { FC, useCallback, useEffect, useState } from 'react'
import TemperatureIcon from 'public/temperature.svg'
import Rain from 'public/rain.svg'
import MaxTempIcon from 'public/max-temp.svg'
import MinTempIcon from 'public/min-temp.svg'
import { Location, useLocationContext } from '@/context/LocationContext'
import { ForecastData } from '@/app/api/[lat]/[lon]/forecast/route'

export const Forecast: FC = () => {
  const [forecastData, setForecastData] = useState<ForecastData[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { state } = useLocationContext()
  const { selectedLocationCoordinates } = state

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
    if (selectedLocationCoordinates) {
      fetchForecastData(selectedLocationCoordinates)
    }
  }, [fetchForecastData, selectedLocationCoordinates])

  const renderComponent = !loading && forecastData

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center mt-24">
          <div className="text-3xl">Loading...</div>
        </div>
      )}
      {renderComponent && (
        <>
          <div className="text-3xl font-bold mb-6 mt-48" data-cy="forecast">
            Upcoming Days
          </div>
          {forecastData.map(({ id, date, temperatures, rain }) => {
            const { day: temperature, min, max } = temperatures

            return (
              <div className="mb-4" data-cy="forecast-day" key={id}>
                <div className="border border-[#4F6A94] rounded-[25px] p-4">
                  <div className="flex flex-row w-full">
                    <div className="basis-2/3">{date}</div>
                    <div className="flex items-center mb-3 basis-1/3">
                      <TemperatureIcon className="mr-1" />
                    </div>
                    <div className="basis-1/3">{temperature}</div>
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="basis-2/3" />
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
                    <div className="flex flex-row w-full">
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
