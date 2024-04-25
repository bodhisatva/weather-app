/* eslint-disable react/jsx-props-no-spreading */

'use client'

import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { CSSObjectWithLabel, components, ValueContainerProps } from 'react-select'
import SearchIcon from 'public/search.svg'
import CancelIcon from 'public/cancel.svg'
import { CityData } from '@/app/api/cities/[name]/route'
import { Location, useLocationContext } from '@/context/LocationContext'
import { Weather } from './Weather'
import { WeatherData } from '@/app/api/[lat]/[lon]/weather/route'

interface SelectedCity {
  label: string
  country: string
  coord:
    | {
        lat: number
        lon: number
      }
    | undefined
}

const Select = dynamic(() => import('react-select'), { ssr: false })

const DropdownIndicator = () => null
const IndicatorSeparator = () => null

export const SearchWeather: FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [cityOptions, setCityOptions] = useState<CityData[]>([])
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCityOptions, setCityOptionsLoading] = useState<boolean>(false)
  const [weatherData, setWeatherData] = useState<WeatherData>()
  const [clearWeatherData, setClearWeatherData] = useState<boolean>(false)

  const { setSelectLocationCoordinates, setUserLocationInfo, state } = useLocationContext()
  const { userLocationCoordinates, isLoadingUserCoordinates } = state

  const fetchCityInfo = useCallback(async (value: string) => {
    try {
      setCityOptionsLoading(true)

      const response = await fetch(`/api/cities/${value}`)
      const data: CityData[] = await response.json()

      if (data) {
        setCityOptions(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCityOptionsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (inputValue) {
      fetchCityInfo(inputValue)
    }
  }, [fetchCityInfo, inputValue])

  const fetchWeatherData = async (coordinates: Location) => {
    const { lat, lon } = coordinates

    try {
      setLoading(true)

      const response = await fetch(`/api/${lat}/${lon}/weather`)
      const weather: WeatherData = await response.json()

      if (weather) {
        setWeatherData(weather)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userLocationCoordinates && !clearWeatherData && !weatherData) {
      fetchWeatherData(userLocationCoordinates)
    }
  }, [clearWeatherData, userLocationCoordinates, weatherData])

  const handleSubmit = ({ coord, label, country }: CityData) => {
    if (coord) {
      fetchWeatherData(coord)
      setSelectLocationCoordinates(coord)
    }

    setCityOptions([])
    setInputValue('')
    setSelectedCity(null)

    setUserLocationInfo(label, country)
  }

  const onChangeHandler = (city: CityData) => {
    handleSubmit(city)
  }

  const onFocusHandler = () => {
    setClearWeatherData(true)
    setWeatherData(undefined)
  }

  const loadingWeatherData = isLoadingUserCoordinates || loading
  const renderComponent = !loading && !isLoadingUserCoordinates && weatherData

  const ValueContainer = useMemo(() => {
    return ({ children, ...props }: ValueContainerProps) => {
      const cancelOnClickHandler = () => {
        setCityOptions([])
        setInputValue('')
        setSelectedCity(null)
      }

      return (
        components.ValueContainer && (
          <>
            <SearchIcon className="mr-2" />
            <components.ValueContainer {...props}>{children}</components.ValueContainer>
            <CancelIcon onClick={cancelOnClickHandler} className="mr-2 cursor-pointer" />
          </>
        )
      )
    }
  }, [setCityOptions, setInputValue, setSelectedCity])

  const styles = (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: '24px',
    height: '3rem',
    padding: '0 1rem'
  })

  const option = (provided: CSSObjectWithLabel, optionState: { isSelected: boolean }) => ({
    ...provided,
    color: optionState.isSelected ? 'black' : '#fff',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  })

  const menu = (provided: CSSObjectWithLabel) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    paddingLeft: '3rem'
  })

  return (
    <div>
      <Select
        styles={{
          control: (base) => styles(base),
          option: (provided, optionState) => option(provided, optionState),
          menu: (provided) => menu(provided)
        }}
        isDisabled={loading || isLoadingUserCoordinates}
        options={cityOptions}
        value={selectedCity}
        onFocus={onFocusHandler}
        onChange={(city) => onChangeHandler(city as CityData)}
        onInputChange={setInputValue}
        isLoading={loadingCityOptions}
        placeholder="Search city..."
        components={{ ValueContainer, DropdownIndicator, IndicatorSeparator }}
      />
      <div className="grid place-items-center mt-28">
        {loadingWeatherData && <div>Loading...</div>}
        {renderComponent && <Weather weatherData={weatherData} />}
      </div>
    </div>
  )
}
