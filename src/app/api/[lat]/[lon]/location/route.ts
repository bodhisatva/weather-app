import { type NextRequest } from 'next/server'
import { ContextProps, LocationApiData, LocationData } from '@/app/api/types'
import { assertValidCoordinates, fetchOpenWeather, toErrorResponse } from '@/app/api/openweather'

export async function GET(request: NextRequest, context: ContextProps) {
  try {
    const { params } = context
    const { lon, lat } = await params

    assertValidCoordinates(lat, lon)

    // https://openweathermap.org/current
    const data = await fetchOpenWeather<LocationApiData>(process.env.WEATHER_API, lat, lon)

    const { name, sys } = data
    const { country } = sys

    const responseObject: LocationData = {
      cityName: name,
      country
    }

    return Response.json(responseObject)
  } catch (error) {
    return toErrorResponse(error)
  }
}
