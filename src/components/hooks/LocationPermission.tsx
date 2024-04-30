import { useCallback, useEffect, useState } from 'react'

export const useGetLocationPermission = () => {
  const [locationPermission, setLocationPermission] = useState<PermissionState | undefined>(
    undefined
  )

  const createPrompt = useCallback(() => {
    if (typeof navigator !== 'undefined') {
      navigator.permissions.query({ name: 'geolocation' }).then(({ state }) => {
        if (state === 'granted') {
          setLocationPermission('granted')
        } else if (state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            () => {
              setLocationPermission('granted')
            },
            (error) => {
              console.error('Error getting user location:', error)
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

  return { locationPermission: locationPermission || 'denied' }
}
