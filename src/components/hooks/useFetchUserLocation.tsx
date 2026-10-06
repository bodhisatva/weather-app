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

export const useFetchUserLocation = (lat: number, lon: number, enabled = true) => {
  return useQuery({
    queryKey: ['user-location', lat, lon],
    queryFn: () => fetchLocation(lat, lon),
    enabled,
    gcTime: 0,
    staleTime: 0
  })
}
