/* eslint-disable react/jsx-props-no-spreading */

'use client'

import { FC, ReactNode, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { CSSObjectWithLabel, components, ValueContainerProps } from 'react-select'
import SearchIcon from 'public/icons/search.svg'
import CancelIcon from 'public/icons/cancel.svg'
import { CityData } from '@/app/api/cities/[name]/route'
import { useLocationContext } from '@/context/LocationContext'
import { Weather } from './Weather'
import { CurrentWeatherSkeleton } from './skeleton/CurrentWeatherSkeleton'
import { WeatherData, Location } from '@/app/api/types'

interface SelectedCity {
  label: string
  country: string
  coord: Location | undefined
}

const Select = dynamic(() => import('react-select'), { ssr: false })

const DropdownIndicator = () => null
const IndicatorSeparator = () => null

export const SearchWeather: FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [cityOptions, setCityOptions] = useState<CityData[]>([])
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [weatherData, setWeatherData] = useState<WeatherData>()
  const [clearWeatherData, setClearWeatherData] = useState<boolean>(false)

  const { setForecastVisibility, setSelectLocationCoordinates, setUserLocationInfo, state } =
    useLocationContext()
  const { loadingUserCoordinates } = state

  const fetchCityInfo = useCallback(async (value: string) => {
    try {
      const response = await fetch(`/api/cities/${value}`)
      const data: CityData[] = await response.json()

      if (data) {
        setCityOptions(data)
      }
    } catch (error) {
      console.error('Error:', error)
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
    setForecastVisibility(false)
  }

  const loadingWeatherData = loadingUserCoordinates || loading

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

  const noOptionsMessage = (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: 'slate-50',
    paddingRight: '3rem'
  })

  const formatOptionLabel = (data: unknown): ReactNode => {
    const { label } = data as CityData
    const startOfMatch = label.toLowerCase().indexOf(inputValue.toLowerCase())
    const enfOfMatch = startOfMatch + inputValue.length

    if (startOfMatch === -1 || !inputValue) {
      return label
    }

    const firstPartOfLabeltext = label.substring(0, startOfMatch)
    const boldedText = (
      <span className="font-bold" key={label}>
        {label.substring(startOfMatch, enfOfMatch)}
      </span>
    )
    const lastPartOfLabelText = label.substring(enfOfMatch)
    const labelWithBoldedMatch = [firstPartOfLabeltext, boldedText, lastPartOfLabelText]

    return <span>{labelWithBoldedMatch}</span>
  }

  return (
    <div>
      <Select
        styles={{
          control: (base) => styles(base),
          option: (provided, optionState) => option(provided, optionState),
          menu: (provided) => menu(provided),
          noOptionsMessage: (provided) => noOptionsMessage(provided)
        }}
        isDisabled={loading || loadingUserCoordinates}
        options={cityOptions}
        value={selectedCity}
        onFocus={onFocusHandler}
        onChange={(city) => onChangeHandler(city as CityData)}
        onInputChange={setInputValue}
        placeholder="Search city..."
        components={{ ValueContainer, DropdownIndicator, IndicatorSeparator }}
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  )
}
