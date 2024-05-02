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
  const { setIsLoadingUserCoordinates, setUserLocationCoordinates } = useLocationContext()

  const getUserLocationCoordinates = useCallback(async () => {
    setIsLoadingUserCoordinates(true)

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setIsLoadingUserCoordinates(false)

      const { latitude: lat, longitude: lon } = coords

      setUserLocationCoordinates({ lat, lon })
      setUserCoordinates({ lat, lon })
    })
  }, [])

  useEffect(() => {
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
            setLocationData(data)
          }
        } catch (error) {
          console.error('Error:', error)
        }
      }

      fetchWeatherData()
    }
  }, [userCoordinates, getUserLocationCoordinates])

  return { locationData }
}
