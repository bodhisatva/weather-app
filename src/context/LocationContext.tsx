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
  loadingUserCoordinates: boolean
  locationPermission: PermissionState
  userLocationCoordinates: Location
}

interface ContextProps {
  state: State
  setIsLoadingUserCoordinates: (loading: boolean) => void
  setUserLocationCoordinates: (coordinates: Location) => void
  setCityCoordinates: (coordinates: Location) => void
  setLocationPermissionState: (locationPermission: PermissionState) => void
}

const LocationContext = createContext<ContextProps | null>(null)

const defaultState: State = {
  loadingUserCoordinates: true,
  locationPermission: 'prompt',
  userLocationCoordinates: { lat: 60.1699, lon: 24.9384 },
  cityCoordinates: null
}

export const LocationContextProvider: FC<PropsWithChildren<{ children: ReactNode }>> = ({
  children
}) => {
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

  const value = useMemo(
    () => ({
      state,
      setCityCoordinates,
      setIsLoadingUserCoordinates,
      setUserLocationCoordinates,
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
