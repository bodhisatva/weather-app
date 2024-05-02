import { useCallback, useEffect, useState } from 'react'
import { Location, useLocationContext } from '@/context/LocationContext'
import { LocationDataProps } from '@/app/api/[lat]/[lon]/location/route'

const defaultLocationData = {
  cityName: '',
  country: ''
}

export const useGetLocation = () => {
  const [locationData, setLocationData] = useState<LocationDataProps>(defaultLocationData)
  const [userCoordinates, setUserCoordinates] = useState<Location | undefined>()
  const [locationPermission, setLocationPermission] = useState<PermissionState>('denied')
  const [isLoading, setIsLoading] = useState(false)

  const { setIsLoadingUserCoordinates, setUserLocationCoordinates, setUserLocationInfo } =
    useLocationContext()

  const getUserLocationCoordinates = useCallback(async () => {
    setIsLoadingUserCoordinates(true)

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsLoadingUserCoordinates(false)
        setLocationPermission('granted')

        const { latitude: lat, longitude: lon } = coords

        setUserLocationCoordinates({ lat, lon })
        setUserCoordinates({ lat, lon })
      },
      (error) => {
        console.error('Error getting user location:', error)

        setLocationPermission('denied')
        setIsLoadingUserCoordinates(false)
        setIsLoading(false)
      }
    )
  }, [])

  const setCityAndCountry = useCallback((cityName: string, country: string) => {
    setUserLocationInfo(cityName, country)
  }, [])

  useEffect(() => {
    setIsLoading(true)

    if (!userCoordinates) {
      getUserLocationCoordinates()
    }

    if (userCoordinates) {
      const fetchWeatherData = async () => {
        const { lat, lon } = userCoordinates

        try {
          const response = await fetch(`/api/${lat}/${lon}/location`)
          const data: LocationDataProps = await response.json()

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
  }, [userCoordinates, getUserLocationCoordinates, setCityAndCountry])

  return { locationData, locationPermission, isLoading }
}
