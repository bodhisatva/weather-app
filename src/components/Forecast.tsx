import { FC, useCallback, useEffect, useState } from 'react'
import { ForecastData } from '@/app/api/[lat]/[lon]/forecast/route'
import { Location, useLocationContext } from '@/context/LocationContext'

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
      <br />
      {loading && <p>Loading...</p>}
      {renderComponent && (
        <>
          <h3 data-cy="forecast">Upcoming Days</h3>
          {forecastData.map(({ id, date, temperatures, rain }) => {
            const { day, min, max } = temperatures

            return (
              <div data-cy="forecast-day" key={id}>
                <h4>{date}</h4>
                <h5> {day}</h5>
                <div> Max: {min}</div>
                <div> Min: {max}</div>
                <div> {rain ? `Rain: ${rain} mm` : null}</div>
                <br />
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
