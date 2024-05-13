import { useCallback, useEffect, useState } from 'react'
import { useLocationContext } from '@/context/LocationContext'
import { LocationData } from '@/app/api/types'

const defaultLocationData = {
  cityName: '',
  country: ''
}

export const useGetLocation = () => {
  const [locationData, setLocationData] = useState<LocationData>(defaultLocationData)
  const [isLoading, setIsLoading] = useState(false)

  const {
    setIsLoadingUserCoordinates,
    setUserLocationCoordinates,
    setUserLocationInfo,
    setLocationPermissionState,
    state
  } = useLocationContext()

  const { userLocationCoordinates } = state

  const getUserLocationCoordinates = useCallback(async () => {
    setIsLoadingUserCoordinates(true)
    setIsLoading(true)

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
        setIsLoading(false)
      }
    )
  }, [])

  const setCityAndCountry = useCallback((cityName: string, country: string) => {
    setUserLocationInfo(cityName, country)
  }, [])

  useEffect(() => {
    if (!userLocationCoordinates) {
      getUserLocationCoordinates()
    }

    if (userLocationCoordinates) {
      const fetchWeatherData = async () => {
        const { lat, lon } = userLocationCoordinates

        try {
          const response = await fetch(`/api/${lat}/${lon}/location`)
          const data: LocationData = await response.json()

          if (data) {
            const { cityName, country } = data
            setLocationData(data)
            setCityAndCountry(cityName, country)
          }
        } catch (error) {
          console.error('Error:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchWeatherData()
    }
  }, [userLocationCoordinates, getUserLocationCoordinates, setCityAndCountry])

  return { locationData, isLoading }
}
