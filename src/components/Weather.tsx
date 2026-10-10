'use client'

import { FC } from 'react'
import Rain from '@/icons/rain.svg'
import { useLocationContext } from '@/context/LocationContext'
import { CurrentWeatherSkeleton } from './skeleton/CurrentWeatherSkeleton'
import { useFetchWeather } from './hooks/useFetchWeather'
import { createIcon } from '@/utility/mapWeatherIcon'

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
      <div className="mt-2 font-bold text-50" data-cy="current-city">
        {selectedCityName ?? cityName}
      </div>
      <div className="flex flex-row items-center gap-2 pt-2 pb-6">
        {weatherIcon}
        <div className="text-lg font-medium">{weatherDescription}</div>
      </div>
      <div className="mb-2 text-xs uppercase tracking-wide opacity-70">Forecast</div>
      <div className="flex flex-row gap-4">
        {maxTemperature === minTemperature ? (
          <span>Around {maxTemperature}</span>
        ) : (
          <>
            <span>High: {maxTemperature}</span>
            <span>Low: {minTemperature}</span>
          </>
        )}
        {rain ? (
          <div className="flex items-center">
            <Rain className="mr-1" />
            <span>Rain: {rain['1h']} mm</span>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default Weather
