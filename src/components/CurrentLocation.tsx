'use client'

import { FC, useCallback, useEffect } from 'react'
import { useLocationContext } from '@/context/LocationContext'
import { useGetLocation } from './hooks/GetLocationData'
import { SkeletonOneLine } from './skeleton/SkeletonOneLine'

export const CurrentLocation: FC = () => {
  const { setIsLoadingUserCoordinates, setUserLocationInfo, setUserLocationCoordinates, state } =
    useLocationContext()
  const { userLocationCoordinates } = state

  const { loading, locationData } = useGetLocation(userLocationCoordinates)
  const { cityName, country } = locationData

  const getUserLocationCoordinates = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoadingUserCoordinates(true)
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setIsLoadingUserCoordinates(false)
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

  const userLocation =
    loading && !cityName ? <SkeletonOneLine height="h-3" /> : `${cityName}, ${country}`

  return (
    <>
      <div className="font-semibold">Your current location:</div>
      <div data-cy="current-location">{userLocation}</div>
    </>
  )
}
