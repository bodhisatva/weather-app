'use client'

import { FC } from 'react'
import { useGetLocation } from './hooks/GetLocationData'
import { SkeletonOneLine } from './skeleton/SkeletonOneLine'

export const CurrentLocation: FC = () => {
  const { locationData } = useGetLocation()
  const { cityName, country } = locationData

  const userLocation = !cityName ? (
    <div className="flex w-full justify-end">
      <SkeletonOneLine height="h-3" />
    </div>
  ) : (
    <div className="flex w-full justify-end">{`${cityName}, ${country}`}</div>
  )

  return (
    <>
      <div className="font-semibold">Your current location:</div>
      <div data-cy="current-location" className="flex w-full">
        {userLocation}
      </div>
    </>
  )
}
