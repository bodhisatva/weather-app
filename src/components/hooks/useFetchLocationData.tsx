import { useQuery } from '@tanstack/react-query'
import { LocationData } from '@/app/api/types'

const fetchLocation = async (lat: number, lon: number) => {
  try {
    const response = await fetch(`/api/${lat}/${lon}/location`)
    const data: LocationData = await response.json()

    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const useFetchLocationData = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['location-data', lat, lon],
    queryFn: () => fetchLocation(lat, lon)
  })
}
