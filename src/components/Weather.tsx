'use client'

import { FC } from 'react'
import { WeatherData } from '@/app/api/[lat]/[lon]/weather/route'
import { useLocationContext } from '@/context/LocationContext'

interface WeatherProps {
  weatherData: WeatherData
}

export const Weather: FC<WeatherProps> = ({ weatherData }) => {
  const { state } = useLocationContext()
  const { userCity } = state

  const { formattedTemperatures, weatherDescription, rain } = weatherData
  const { temperature, minTemperature, maxTemperature } = formattedTemperatures

  return (
    <div>
      <div>
        <h2>{temperature}</h2>
        <h2>{userCity}</h2>
      </div>
      <h5>{weatherDescription}</h5>
      <div>Max: {maxTemperature} </div>
      <div>Min: {minTemperature} </div>
      <div>{rain ? <div>Rain: {rain['1h']} mm</div> : null}</div>
    </div>
  )
}
