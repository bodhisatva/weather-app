import { type NextRequest } from 'next/server'
import { ContextProps, LocationApiData, LocationData } from '@/app/api/types'

export async function GET(request: NextRequest, context: ContextProps) {
  const { params } = context
  const { lon, lat } = await params
  const { WEATHER_API, API_KEY } = process.env

  // https://openweathermap.org/api/geocoding-api#description Reverse geocoding
  const query = `${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  try {
    const response = await fetch(query, { next: { revalidate: 0 } })
    const data: LocationApiData = await response.json()

    const { name, sys } = data
    const { country } = sys

    const responseObject: LocationData = {
      cityName: name,
      country
    }

    return Response.json(responseObject)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    console.error('Error:', errorMessage)

    return Response.json({ message: errorMessage })
  }
}
