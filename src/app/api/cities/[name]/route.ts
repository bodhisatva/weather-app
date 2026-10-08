import { type NextRequest } from 'next/server'
import { Location } from '@/app/api/types'

interface ContextProps {
  params: Promise<{ name: string }>
}

export interface CityData {
  label: string
  country: string
  coord: Location | undefined
}

interface GeocodingResult {
  name: string
  latitude: number
  longitude: number
  country_code: string
  admin1?: string
}

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export async function GET(request: NextRequest, { params }: ContextProps) {
  const { name } = await params
  const url = new URL(GEOCODING_URL)

  url.searchParams.set('name', name)
  url.searchParams.set('count', '10')
  url.searchParams.set('language', 'en')

  const response = await fetch(url, { next: { revalidate: 86400 } })

  if (!response.ok) {
    return Response.json({ message: 'City search unavailable' }, { status: 502 })
  }

  const { results = [] }: { results?: GeocodingResult[] } = await response.json()

  const cities: CityData[] = results.map(
    ({ name: cityName, admin1, country_code, latitude, longitude }) => ({
      label: [cityName, admin1, country_code].filter(Boolean).join(', '),
      country: country_code,
      coord: { lat: latitude, lon: longitude }
    })
  )

  const uniqueCities = [...new Map(cities.map((city) => [city.label, city])).values()]

  return Response.json(uniqueCities)
}
