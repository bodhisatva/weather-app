'use client'

import { FC, useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { CityData } from '@/app/api/cities/[name]/route'
import { Location, useLocationContext } from '@/context/LocationContext'
import { Weather } from './Weather'
import { WeatherData } from '@/app/api/[lat]/[lon]/weather/route'
import { Forecast } from './Forecast'

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

export const SearchWeather: FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [cityOptions, setCityOptions] = useState<CityData[]>([])
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCityOptions, setCityOptionsLoading] = useState<boolean>(false)
  const [weatherData, setWeatherData] = useState<WeatherData>()

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
    if (userLocationCoordinates && !weatherData) {
      fetchWeatherData(userLocationCoordinates)
    }
  }, [userLocationCoordinates, weatherData])

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

  const renderComponent = !loading && !isLoadingUserCoordinates && weatherData

  return (
    <div>
      <div>
        <Select
          isDisabled={loading || isLoadingUserCoordinates}
          options={cityOptions}
          value={selectedCity}
          onChange={(city) => onChangeHandler(city as CityData)}
          onInputChange={setInputValue}
          isLoading={loadingCityOptions}
          placeholder="Search city..."
        />
      </div>
      <br />

      <div>
        {loading || (isLoadingUserCoordinates && <div>Loading...</div>)}
        {renderComponent && (
          <div className="inlineRow">
            <Weather weatherData={weatherData} />
          </div>
        )}
        {!loading && (
          <div className="inlineRow">
            <Forecast />
          </div>
        )}
      </div>
    </div>
  )
}
