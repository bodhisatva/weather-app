'use client'

import { FC, useCallback, useEffect } from 'react'
import { useLocationContext } from '@/context/LocationContext'
import { useGetLocation } from './hooks/GetLocationData'

export const CurrentLocation: FC = () => {
  const { setUserLocationInfo, setUserLocationCoordinates, state } = useLocationContext()
  const { userLocationCoordinates } = state

  const { loading, locationData } = useGetLocation(userLocationCoordinates)
  const { cityName, country } = locationData

  const getUserLocationCoordinates = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude: lat, longitude: lon } = coords

        setUserLocationCoordinates({ lat, lon })
      })
    } else {
      console.error('Geolocation is not supported by this browser')
    }
  }, [])

  useEffect(() => {
    getUserLocationCoordinates()
  }, [getUserLocationCoordinates])

  const setLocationData = useCallback((city: string, countryCode: string) => {
    setUserLocationInfo(city, countryCode)
  }, [])

  useEffect(() => {
    if (cityName && country) {
      setLocationData(cityName, country)
    }
  }, [cityName, country, setLocationData])

  const userLocation = loading && !cityName ? 'Loading...' : `${cityName}, ${country}`

  return (
    <div>
      <p>
        Your current location: <span data-cy="current-location">{userLocation}</span>
      </p>
    </div>
  )
}
