import { FC } from 'react'
import { useGetLocationPermission } from './hooks/useGetLocationPermission'
import { SkeletonOneLine } from './skeleton/SkeletonOneLine'
import { useLocationContext } from '@/context/LocationContext'
import { useFetchWeather } from './hooks/useFetchWeather'

export const CurrentLocation: FC = () => {
  useGetLocationPermission()

  const { state, clearCityCoordinates } = useLocationContext()
  const { locationPermission, userLocationCoordinates, cityCoordinates } = state
  const { lat, lon } = userLocationCoordinates

  const enabled = locationPermission === 'granted'

  const { data, error } = useFetchWeather(lat, lon, enabled)

  if (locationPermission === 'denied') {
    return null
  }

  if (error) {
    return <div>An error occured: {error.message}</div>
  }

  if (!data) {
    return (
      <div className="flex w-full justify-end">
        <SkeletonOneLine height="h-3" width="w-20" />
      </div>
    )
  }

  const { cityName, country } = data
  const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(country) ?? country

  return (
    <div data-cy="current-location" className="flex w-full">
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={clearCityCoordinates}
          disabled={!cityCoordinates}
          className="transition-opacity enabled:cursor-pointer enabled:hover:opacity-70 focus-visible:outline"
        >
          {`${cityName}, ${countryName}`}
        </button>
      </div>
    </div>
  )
}
