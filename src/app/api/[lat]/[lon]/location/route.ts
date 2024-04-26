import { type NextRequest } from 'next/server'

interface LocationApiDataProps {
  name: string
  sys: { country: string }
}

export interface LocationDataProps {
  cityName: string
  country: string
}

interface ContextProps {
  params: {
    lat: number
    lon: number
  }
}

export async function GET(request: NextRequest, context: ContextProps) {
  const { params } = context
  const { lon, lat } = params
  const { WEATHER_API, API_KEY } = process.env

  const query = `${WEATHER_API}${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  try {
    const response = await fetch(query)
    const data: LocationApiDataProps = await response.json()

    const { name, sys } = data
    const { country } = sys

    const responseObject: LocationDataProps = {
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
