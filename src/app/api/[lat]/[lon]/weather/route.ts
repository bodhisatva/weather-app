import { type NextRequest } from 'next/server'
import { formatClosestInteger, formatTemperature } from '@/utility/formatTemperature'
import { capitaliseFirstCharacter } from '@/utility/formatStrings'

interface Temperature {
  temperature: string | null
  minTemperature: string | null
  maxTemperature: string | null
}

export interface Main {
  temp: number
  temp_min: number
  temp_max: number
}

interface Rain {
  '1h': number
  '3h'?: number
}

interface WeatherApiData {
  main: Main
  weather: {
    description: string
  }[]
  rain: Rain | null | undefined
}

export interface WeatherData {
  formattedTemperatures: Temperature
  weatherDescription: string
  rain: Rain | null | undefined
}

interface ContextProps {
  params: {
    lat: number
    lon: number
  }
}

export async function GET(request: NextRequest, context: ContextProps) {
  const { params } = context
  const { lat, lon } = params
  const { WEATHER_API, API_KEY } = process.env

  const query = `${WEATHER_API}${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  try {
    const response = await fetch(query, { next: { revalidate: 0 } })
    const data: WeatherApiData = await response.json()

    const { main, weather, rain } = data
    const { temp, temp_min: tempMin, temp_max: tempMax } = main
    const { description } = weather[0]

    const formattedTemperatures: Temperature = {
      temperature: formatClosestInteger(temp),
      minTemperature: formatTemperature(tempMin),
      maxTemperature: formatTemperature(tempMax)
    }

    const responseObject: WeatherData = {
      formattedTemperatures,
      weatherDescription: capitaliseFirstCharacter(description),
      rain
    }

    return Response.json(responseObject)
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ message: error })
  }
}
