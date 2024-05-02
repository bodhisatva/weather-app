import { useCallback, useEffect, useState } from 'react'
import { useLocationContext } from '@/context/LocationContext'

export const useGetLocationPermission = () => {
  const [locationPermission, setLocationPermission] = useState<PermissionState | undefined>()

  const { setIsLoadingUserCoordinates } = useLocationContext()

  const createPrompt = useCallback(() => {
    if (typeof navigator !== 'undefined') {
      navigator.permissions.query({ name: 'geolocation' }).then(({ state }) => {
        setIsLoadingUserCoordinates(true)
        if (state === 'granted') {
          setLocationPermission('granted')
        } else if (state === 'denied') {
          setLocationPermission('denied')
          setIsLoadingUserCoordinates(false)
        } else if (state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            () => {
              setLocationPermission('granted')
            },
            (error) => {
              console.error('Error getting user location:', error)
              setLocationPermission('denied')
              setIsLoadingUserCoordinates(false)
            }
          )
        }
      })
    }
  }, [])

  useEffect(() => {
    if (locationPermission === undefined) {
      navigator.permissions.query({ name: 'geolocation' }).then(({ state: geolocationState }) => {
        switch (geolocationState) {
          case 'granted':
            return setLocationPermission('granted')
          case 'prompt':
            return createPrompt()
          default:
            return setLocationPermission('denied')
        }
      })
    }
  }, [createPrompt, locationPermission])

  return { locationPermission: locationPermission || 'deny' }
}
