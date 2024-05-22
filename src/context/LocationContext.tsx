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
  cityCoordinates: Location | null
  forecastVisibility: boolean
  loadingUserCoordinates: boolean
  locationPermission: PermissionState
  userLocationCoordinates: Location
  userCity: string | undefined
  userCountry: string | undefined
}

interface ContextProps {
  state: State
  setIsLoadingUserCoordinates: (loading: boolean) => void
  setUserLocationCoordinates: (coordinates: Location) => void
  setCityCoordinates: (coordinates: Location) => void
  setUserLocationInfo: (city: string, country: string) => void
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
    cityCoordinates: null,
    userCity: undefined,
    userCountry: undefined
  }

  const [state, setState] = useState<State>(defaultState)

  const setUserLocationCoordinates = (userLocationCoordinates: Location) => {
    setState((prevState) => ({
      ...prevState,
      userLocationCoordinates
    }))
  }

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

  const setCityCoordinates = (cityCoordinates: Location) => {
    setState((prevState) => ({
      ...prevState,
      cityCoordinates
    }))
  }

  const setUserLocationInfo = (userCity: string, userCountry: string) => {
    setState((prevState) => ({
      ...prevState,
      userCity,
      userCountry
    }))
  }

  const value = useMemo(
    () => ({
      state,
      setCityCoordinates,
      setIsLoadingUserCoordinates,
      setUserLocationCoordinates,
      setUserLocationInfo,
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
