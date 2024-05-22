'use client'

import { FC } from 'react'
import MaxTempIcon from 'public/icons/thermometer.svg'
import MinTempIcon from 'public/icons/thermometer-minus.svg'
import Rain from 'public/icons/rain.svg'
import { useLocationContext } from '@/context/LocationContext'
import { createIcon } from '@/utility/mapWeatherIcon'
import { CurrentWeatherSkeleton } from './skeleton/CurrentWeatherSkeleton'
import { useFetchWeather } from './hooks/useFetchWeather'
import { useFetchLocationData } from './hooks/useFetchLocationData'

export const Weather: FC = () => {
  const { state } = useLocationContext()
  const { userLocationCoordinates, loadingUserCoordinates, cityCoordinates } = state
  const { lat, lon } = cityCoordinates || userLocationCoordinates

  const { data, error } = useFetchWeather(lat, lon)
  const { data: locationData, error: locationError } = useFetchLocationData(lat, lon)

  if (error || locationError) {
    return <div>An error occured: {error?.message}</div>
  }

  if (!data || !locationData || loadingUserCoordinates) {
    return <CurrentWeatherSkeleton />
  }

  const { formattedTemperatures, weatherDescription, rain, icon } = data
  const { temperature, minTemperature, maxTemperature } = formattedTemperatures

  const { cityName } = locationData

  const weatherIcon = createIcon(icon)

  return (
    <>
      <div className="font-bold text-50" data-cy="current-temperature">
        {temperature}
      </div>
      <div className="font-bold text-50" data-cy="current-city">
        {cityName}
      </div>
      <div className="flex flex-row pt-2 pb-6">
        <div className="flex items-center">{weatherIcon}</div>
        <div className="text-lg font-semibold ml-2">{weatherDescription}</div>
      </div>
      <div className="flex items-center mb-3 text-sm">Forecast</div>
      <div className="flex flex-row space-x-4 ">
        <div className="flex items-center">
          <MaxTempIcon className="mr-1" /> <span>Max: {maxTemperature}</span>
        </div>
        <div className="flex items-center">
          <MinTempIcon className="mr-1" /> <span>Min: {minTemperature}</span>
        </div>
        <div>
          {rain ? (
            <div className="flex items-center">
              <Rain className="mr-1" />
              <span>Rain: {rain['1h']} mm</span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default Weather
