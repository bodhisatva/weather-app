import { useCallback, useEffect, useState } from 'react'
import { useLocationContext } from '@/context/LocationContext'

export const useGetLocationPermission = () => {
  const [locationPermission, setLocationPermission] = useState<PermissionState | undefined>()

  const { setIsLoadingUserCoordinates } = useLocationContext()

  const createPrompt = useCallback(() => {
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
  }, [])

  return { locationPermission: locationPermission || 'deny' }
}
