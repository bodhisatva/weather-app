import { FC } from 'react'
import { useGetLocation } from './hooks/GetLocationData'
import { SkeletonOneLine } from './skeleton/SkeletonOneLine'
import { useLocationContext } from '@/context/LocationContext'

export const CurrentLocation: FC = () => {
  const { locationData, isLoading } = useGetLocation()
  const { cityName, country } = locationData

  const { state } = useLocationContext()
  const { locationPermission } = state

  const renderComponent = locationPermission === 'granted' && cityName

  return (
    <>
      {renderComponent && (
        <div data-cy="current-location" className="flex w-full">
          <div className="flex w-full justify-end">{`${cityName}, ${country}`}</div>
        </div>
      )}
      {isLoading && (
        <div className="flex w-full justify-end">
          <SkeletonOneLine height="h-3" width="w-20" />
        </div>
      )}
    </>
  )
}
