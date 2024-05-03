import { type NextRequest } from 'next/server'
import { ContextProps, LocationApiData, LocationData } from '@/app/api/types'

export async function GET(request: NextRequest, context: ContextProps) {
  const { params } = context
  const { lon, lat } = params
  const { WEATHER_API, API_KEY } = process.env

  const query = `${WEATHER_API}${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  try {
    const response = await fetch(query)
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
