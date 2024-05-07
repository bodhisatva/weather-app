'use client'

import { FC, PropsWithChildren, createContext, useMemo, useState, useContext } from 'react'
import { Location } from '@/app/api/types'

interface State {
  isLoadingUserCoordinates: boolean
  userLocationCoordinates: Location | undefined
  userCity: string | undefined
  userCountry: string | undefined
  selectedLocationCoordinates: Location | undefined
  forecastVisibility: boolean
}

interface ContextProps {
  state: State
  setIsLoadingUserCoordinates: (loading: boolean) => void
  setUserLocationCoordinates: (coordinates: Location | undefined) => void
  setUserLocationInfo: (city: string, country: string) => void
  setSelectLocationCoordinates: (coordinates: Location | undefined) => void
  setForecastVisibility: (forecastData: boolean) => void
}

const LocationContext = createContext<ContextProps | null>(null)

export const LocationContextProvider: FC<PropsWithChildren<Record<string, never>>> = ({
  children
}) => {
  const defaultState = {
    isLoadingUserCoordinates: false,
    userLocationCoordinates: undefined,
    userCity: undefined,
    userCountry: undefined,
    selectedLocationCoordinates: undefined,
    forecastVisibility: false
  }

  const [state, setState] = useState<State>(defaultState)

  const setIsLoadingUserCoordinates = (loading: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isLoadingUserCoordinates: loading
    }))
  }

  const setUserLocationCoordinates = (userLocationCoordinates: Location | undefined) => {
    setState((prevState) => ({
      ...prevState,
      userLocationCoordinates
    }))
  }

  const setSelectLocationCoordinates = (selectedLocationCoordinates: Location | undefined) => {
    setState((prevState) => ({
      ...prevState,
      selectedLocationCoordinates
    }))
  }

  const setUserLocationInfo = (userCity: string, userCountry: string) => {
    setState((prevState) => ({
      ...prevState,
      userCity,
      userCountry
    }))
  }

  const setForecastVisibility = (forecastVisibility: boolean) => {
    setState((prevState) => ({
      ...prevState,
      forecastVisibility
    }))
  }

  const value = useMemo(
    () => ({
      state,
      setForecastVisibility,
      setIsLoadingUserCoordinates,
      setUserLocationCoordinates,
      setUserLocationInfo,
      setSelectLocationCoordinates
    }),
    [state]
  )

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export const useLocationContext = () => {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error('Missing location context provider')
  }
  return context
}
