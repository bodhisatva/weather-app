import { useEffect, useState } from 'react'

export const useGetLocationPermission = () => {
  const [locationPermission, setLocationPermission] = useState<PermissionState | undefined>(
    undefined
  )

  useEffect(() => {
    const createPrompt = navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission('granted')
      },
      (error) => {
        console.error('Error getting user location:', error)
      }
    )

    const checkLocationPermission = async () => {
      navigator.permissions.query({ name: 'geolocation' }).then(({ state: geolocationState }) => {
        switch (geolocationState) {
          case 'granted':
            return setLocationPermission('granted')
          case 'prompt':
            return createPrompt
          default:
            return setLocationPermission('denied')
        }
      })
    }

    checkLocationPermission()
  }, [locationPermission])

  return { locationPermission: locationPermission || 'denied' }
}
