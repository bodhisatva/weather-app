import { FC } from 'react'
import { useGetLocationPermission } from './hooks/useGetLocationPermission'
import { SkeletonOneLine } from './skeleton/SkeletonOneLine'
import { useLocationContext } from '@/context/LocationContext'
import { useFetchUserLocation } from './hooks/useFetchUserLocation'

export const CurrentLocation: FC = () => {
  useGetLocationPermission()

  const { state } = useLocationContext()
  const { locationPermission, userLocationCoordinates, loadingUserCoordinates } = state
  const { lat, lon } = userLocationCoordinates

  const { data, error } = useFetchUserLocation(lat, lon)

  if (error) {
    return <div>An error occured: {error.message}</div>
  }

  if (!data || loadingUserCoordinates) {
    return (
      <div className="flex w-full justify-end">
        <SkeletonOneLine height="h-3" width="w-20" />
      </div>
    )
  }

  const { cityName, country } = data

  const renderComponent = locationPermission === 'granted'

  return (
    <>
      {renderComponent && (
        <div data-cy="current-location" className="flex w-full">
          <div className="flex w-full justify-end">{`${cityName}, ${country}`}</div>
        </div>
      )}
    </>
  )
}
