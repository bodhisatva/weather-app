import { useQuery } from '@tanstack/react-query'
import { CityData } from '@/app/api/cities/[name]/route'

const fetchCities = async (name: string, signal: AbortSignal) => {
  const response = await fetch(`/api/cities/${encodeURIComponent(name)}`, { signal })

  if (!response.ok) {
    throw new Error('City search unavailable')
  }

  const data: CityData[] = await response.json()
  return data
}

export const useFetchCities = (name: string) => {
  return useQuery({
    queryKey: ['cities', name],
    queryFn: ({ signal }) => fetchCities(name, signal),
    enabled: name.length > 1,
    staleTime: Infinity,
    refetchInterval: false
  })
}
