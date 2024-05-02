'use client'

import { FC } from 'react'
import { useGetLocation } from './hooks/GetLocationData'
import { SkeletonOneLine } from './skeleton/SkeletonOneLine'

export const CurrentLocation: FC = () => {
  const { locationData, locationPermission, isLoading } = useGetLocation()
  const { cityName, country } = locationData

  return (
    <>
      {locationPermission === 'granted' && cityName && (
        <>
          <div className="font-semibold">Your current location:</div>
          <div data-cy="current-location" className="flex w-full">
            <div className="flex w-full justify-end">{`${cityName}, ${country}`}</div>
          </div>
        </>
      )}
      {isLoading && (
        <>
          <div className="flex w-full justify-end mb-1">
            <SkeletonOneLine height="h-3" />
          </div>
          <div className="flex w-full justify-end">
            <SkeletonOneLine height="h-3" />
          </div>
        </>
      )}
    </>
  )
}
