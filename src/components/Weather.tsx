'use client'

import { FC } from 'react'
import MaxTempIcon from 'public/icons/thermometer.svg'
import MinTempIcon from 'public/icons/thermometer-minus.svg'
import Rain from 'public/icons/rain.svg'
import { useLocationContext } from '@/context/LocationContext'
import { WeatherData } from '@/app/api/types'
import { createIcon } from '@/utility/mapWeatherIcon'

interface WeatherProps {
  weatherData: WeatherData
}

export const Weather: FC<WeatherProps> = ({ weatherData }) => {
  const { state } = useLocationContext()
  const { userCity } = state

  const { formattedTemperatures, weatherDescription, rain, icon } = weatherData
  const { temperature, minTemperature, maxTemperature } = formattedTemperatures

  const weatherIcon = createIcon(icon)

  return (
    <>
      <div className="font-bold text-50" data-cy="current-temperature">
        {temperature}
      </div>
      <div className="font-bold text-50" data-cy="current-city">
        {userCity}
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
