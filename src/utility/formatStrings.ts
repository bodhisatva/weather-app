import { CityData } from '@/app/api/cities/[name]/route'

export const capitaliseFirstCharacter = (character: string) =>
  character.charAt(0).toUpperCase() + character.slice(1)

export const sortAlphabetically = (cities: CityData[]) =>
  cities.sort((a, b) => a.label.localeCompare(b.label, 'fi', { sensitivity: 'base' }))
