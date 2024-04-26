import { type NextRequest } from 'next/server'
import { uniqBy } from 'lodash'
import cities from './finland.cities.json'
import { sortAlphabetically } from '@/utility/formatStrings'

interface ContextProps {
  params: {
    name: string
  }
}

export interface CityData {
  label: string
  country: string
  coord:
    | {
        lon: number
        lat: number
      }
    | undefined
}

export async function GET(request: NextRequest, context: ContextProps) {
  const { params } = context
  const { name } = params

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(name.toLowerCase())
  )

  if (!filteredCities) {
    return Response.json({ message: 'City not found' })
  }

  const response: CityData[] = uniqBy(
    filteredCities.map(({ name: cityName, country, coord }) => ({
      label: cityName,
      country,
      coord
    })),
    'label'
  )

  try {
    return Response.json(sortAlphabetically(response))
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    console.error('Error:', errorMessage)

    return Response.json({ message: errorMessage })
  }
}
