'use client'

import { FC } from 'react'
import { useLocationContext } from '@/context/LocationContext'
import { CurrentWeatherSkeleton } from './skeleton/CurrentWeatherSkeleton'
import { useFetchWeather } from './hooks/useFetchWeather'
import { createIcon, weatherIconAnimation } from '@/utility/mapWeatherIcon'

export const Weather: FC = () => {
  const { state } = useLocationContext()
  const {
    userLocationCoordinates,
    loadingUserCoordinates,
    cityCoordinates,
    cityName: selectedCityName
  } = state
  const { lat, lon } = cityCoordinates || userLocationCoordinates

  const enabled = !loadingUserCoordinates

  const { data, error } = useFetchWeather(lat, lon, enabled)

  if (error) {
    return <div>An error occured: {error.message}</div>
  }

  if (!data) {
    return <CurrentWeatherSkeleton />
  }

  const { cityName, formattedTemperatures, weatherDescription, rain, icon } = data
  const { temperature, minTemperature, maxTemperature } = formattedTemperatures

  const weatherIcon = createIcon(icon)

  return (
    <>
      <div className="font-bold text-50" data-cy="current-temperature">
        {temperature}
      </div>
      <div
        className="mt-2 w-full text-center text-4xl font-bold leading-tight text-balance wrap-anywhere sm:text-50"
        data-cy="current-city"
      >
        {selectedCityName ?? cityName}
      </div>
      <div className="flex flex-row items-center gap-2 pt-2 pb-6">
        <div className={`flex ${weatherIconAnimation(icon)}`}>{weatherIcon}</div>
        <div className="text-lg font-medium">{weatherDescription}</div>
      </div>
      <div className="mb-2 text-xs uppercase tracking-wide opacity-80">Forecast</div>
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
        {maxTemperature === minTemperature ? (
          <span>Around {maxTemperature}</span>
        ) : (
          <div className="flex gap-4">
            <span>High: {maxTemperature}</span>
            <span>Low: {minTemperature}</span>
          </div>
        )}
        {rain ? <span className="text-sm opacity-80">Rain {rain['1h'].toFixed(1)} mm</span> : null}
      </div>
    </>
  )
}

export default Weather
