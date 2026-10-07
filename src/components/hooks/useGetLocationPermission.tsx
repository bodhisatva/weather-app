import { useCallback, useEffect } from 'react'
import { useLocationContext } from '@/context/LocationContext'

export const useGetLocationPermission = () => {
  const {
    setIsLoadingUserCoordinates,
    setUserLocationCoordinates,
    setLocationPermissionState,
    state
  } = useLocationContext()

  const { locationPermission } = state

  const promptLocationPermission = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationPermissionState('denied')
      setIsLoadingUserCoordinates(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsLoadingUserCoordinates(false)
        setLocationPermissionState('granted')

        const { latitude: lat, longitude: lon } = coords

        setUserLocationCoordinates({ lat, lon })
      },
      (error) => {
        console.error('Error getting user location:', error)

        setLocationPermissionState('denied')
        setIsLoadingUserCoordinates(false)
      }
    )
  }, [setIsLoadingUserCoordinates, setLocationPermissionState, setUserLocationCoordinates])

  useEffect(() => {
    if (locationPermission === 'prompt') {
      promptLocationPermission()
    }
  }, [locationPermission, promptLocationPermission])
}
