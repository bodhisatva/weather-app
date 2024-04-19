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
  const { WEATHER_API, API_KEY } = process.env

  const query = `${WEATHER_API}${params.lat}&lon=${params.lon}&appid=${API_KEY}&units=metric`

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
    console.error('Error:', error)
    return Response.json({ message: error })
  }
}
