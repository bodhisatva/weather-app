'use client'

import { useState } from 'react'
import { CurrentLocation } from '@/components/CurrentLocation'
import { Forecast } from '@/components/Forecast'
import { SearchWeather } from '@/components/SearchWeather'
import Weather from '@/components/Weather'
import { useLocationContext } from '@/context/LocationContext'

export default function Home() {
  const { state } = useLocationContext()
  const { locationPermission } = state
  const [weatherDataVisibility, setWeatherDataVisibility] = useState(true)

  const renderComponent = locationPermission !== 'denied'

  const visibility = `${weatherDataVisibility ? '' : 'hidden'}`

  return (
    <div className="container mx-auto py-2">
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
        <div className="mx-4">
          <div className="flex flex-row mb-12 md:mb-16">
            <div className="basis-1/3 text-3xl font-bold">
              <div>Weather</div>
              <div>Site</div>
            </div>
            <div className="basis-2/3 text-right sm:text-end text-sm sm:text-base">
              {renderComponent && <div className="font-semibold">Your current location:</div>}
              <CurrentLocation />
            </div>
          </div>
          <SearchWeather setWeatherDataVisibility={setWeatherDataVisibility} />
          <div className={`grid place-items-center mt-8 md:mt-28 ${visibility}`}>
            <Weather />
          </div>
        </div>
        <div className="mx-4 sm:mx-8 md:mx-16 xl:mx-30">
          <Forecast />
        </div>
      </div>
    </div>
  )
}
