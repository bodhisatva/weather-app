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

  const getUserLocationCoordinates = useCallback(async () => {
    setIsLoadingUserCoordinates(true)

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setIsLoadingUserCoordinates(false)

      const { latitude: lat, longitude: lon } = coords

      setUserLocationCoordinates({ lat, lon })
    })
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
    loading && !cityName ? (
      <div className="flex w-full justify-end">
        <SkeletonOneLine height="h-3" />
      </div>
    ) : (
      <div className="flex w-full justify-end">{`${cityName}, ${country}`}</div>
    )

  return (
    <>
      <div className="font-semibold">Your current location:</div>
      <div data-cy="current-location" className="flex w-full">
        {userLocation}
      </div>
    </>
  )
}
