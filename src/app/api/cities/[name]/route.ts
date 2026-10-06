import { type NextRequest } from 'next/server'
import { uniqBy } from 'lodash'
import Fuse from 'fuse.js'
import cities from './finland.cities.json'
import { Location } from '@/app/api/types'

interface ContextProps {
  params: Promise<{ name: string }>
}

export interface CityData {
  label: string
  country: string
  coord: Location | undefined
}

export async function GET(request: NextRequest, context: ContextProps) {
  const { params } = context
  const { name } = await params

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(name.toLowerCase())
  )

  const uniqueCityList: CityData[] = uniqBy(
    filteredCities.map(({ name: cityName, country, coord }) => ({
      label: cityName,
      country,
      coord
    })),
    'label'
  )

  const fuseData = new Fuse<CityData>(uniqueCityList, { keys: ['label'] })
  const sortedDataList = fuseData.search(name)
  const response = sortedDataList.map(({ item }) => item)

  return Response.json(response)
}
