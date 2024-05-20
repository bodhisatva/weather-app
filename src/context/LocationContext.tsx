'use client'

import {
  FC,
  PropsWithChildren,
  createContext,
  useMemo,
  useState,
  useContext,
  ReactNode
} from 'react'
import { Location } from '@/app/api/types'

interface State {
  forecastVisibility: boolean
  loadingUserCoordinates: boolean
  locationPermission: PermissionState
  userLocationCoordinates: Location
  userCity: string | undefined
  userCountry: string | undefined
  selectedLocationCoordinates: Location | undefined
}

interface ContextProps {
  state: State
  setIsLoadingUserCoordinates: (loading: boolean) => void
  setUserLocationCoordinates: (coordinates: Location) => void
  setUserLocationInfo: (city: string, country: string) => void
  setSelectLocationCoordinates: (coordinates: Location) => void
  setForecastVisibility: (forecastData: boolean) => void
  setLocationPermissionState: (locationPermission: PermissionState) => void
}

const LocationContext = createContext<ContextProps | null>(null)

export const LocationContextProvider: FC<PropsWithChildren<{ children: ReactNode }>> = ({
  children
}) => {
  const defaultState = {
    forecastVisibility: false,
    loadingUserCoordinates: false,
    locationPermission: 'prompt' as PermissionState,
    userLocationCoordinates: { lat: 60.1699, lon: 24.9384 },
    userCity: undefined,
    userCountry: undefined,
    selectedLocationCoordinates: undefined
  }

  const [state, setState] = useState<State>(defaultState)

  const setIsLoadingUserCoordinates = (loading: boolean) => {
    setState((prevState) => ({
      ...prevState,
      loadingUserCoordinates: loading
    }))
  }

  const setLocationPermissionState = (locationPermission: PermissionState) => {
    setState((prevState) => ({
      ...prevState,
      locationPermission
    }))
  }

  const setUserLocationCoordinates = (userLocationCoordinates: Location) => {
    setState((prevState) => ({
      ...prevState,
      userLocationCoordinates
    }))
  }

  const setSelectLocationCoordinates = (selectedLocationCoordinates: Location) => {
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
      setSelectLocationCoordinates,
      setLocationPermissionState
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
