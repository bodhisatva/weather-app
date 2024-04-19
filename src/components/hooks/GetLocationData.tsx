import { useEffect, useState } from 'react'
import { Location } from '@/context/LocationContext'
import { LocationDataProps } from '@/app/api/[lat]/[lon]/location/route'

const defaultLocationData = {
  cityName: '',
  country: ''
}

export const useGetLocation = (userLocationCoordinates: Location | undefined) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [locationData, setLocationData] = useState<LocationDataProps>(defaultLocationData)

  useEffect(() => {
    if (userLocationCoordinates) {
      const fetchWeatherData = async () => {
        const { lat, lon } = userLocationCoordinates

        try {
          setLoading(true)
          const response = await fetch(`/api/${lat}/${lon}/location`)
          const data: LocationDataProps = await response.json()

          if (data) {
            setLocationData(data)
          }
        } catch (error) {
          console.error('Error:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchWeatherData()
    }
  }, [userLocationCoordinates])

  return { loading, locationData }
}
