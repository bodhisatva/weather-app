'use client'

import { FC, ReactNode, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { CSSObjectWithLabel, components, ValueContainerProps } from 'react-select'
import SearchIcon from '@/icons/search.svg'
import CancelIcon from '@/icons/cancel.svg'
import { CityData } from '@/app/api/cities/[name]/route'
import { useLocationContext } from '@/context/LocationContext'
import { Location } from '@/app/api/types'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { useFetchCities } from './hooks/useFetchCities'

interface SelectedCity {
  label: string
  details: string
  country: string
  coord: Location | undefined
}

const Select = dynamic(() => import('react-select'), { ssr: false })

const DropdownIndicator = () => null
const IndicatorSeparator = () => null

interface Props {
  visibility: (visibility: boolean) => void
}

export const LocationComboBox: FC<Props> = ({ visibility }) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null)

  const debouncedInput = useDebouncedValue(inputValue, 250)
  const { data: cityOptions = [], isFetching } = useFetchCities(debouncedInput)

  const { setCityCoordinates, state } = useLocationContext()
  const { loadingUserCoordinates } = state

  const onInputChange = (value: string) => {
    setInputValue(value)

    if (value) {
      visibility(false)
    }
  }

  const handleSubmit = () => {
    visibility(true)

    setInputValue('')
    setSelectedCity(null)
  }

  const onChangeHandler = (city: CityData) => {
    const { coord, label } = city

    if (coord) {
      const { lat: latitude, lon: longitude } = coord
      setCityCoordinates({ lat: latitude, lon: longitude }, label)
      handleSubmit()
    }
  }

  const ValueContainer = useMemo(() => {
    return function ValueContainer({ children, ...props }: ValueContainerProps) {
      const cancelOnClickHandler = () => {
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
  }, [setInputValue, setSelectedCity])

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

  const highlightMatch = (label: string): ReactNode => {
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

    return [firstPartOfLabeltext, boldedText, lastPartOfLabelText]
  }

  const formatOptionLabel = (data: unknown): ReactNode => {
    const { label, details } = data as CityData

    return (
      <div>
        <div>{highlightMatch(label)}</div>
        {details && <div className="text-xs opacity-60">{details}</div>}
      </div>
    )
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
        isDisabled={loadingUserCoordinates}
        options={cityOptions}
        filterOption={null}
        isLoading={isFetching}
        value={selectedCity}
        onFocus={() => visibility(false)}
        onChange={(city) => onChangeHandler(city as CityData)}
        onInputChange={onInputChange}
        placeholder="Search city..."
        components={{ ValueContainer, DropdownIndicator, IndicatorSeparator }}
        formatOptionLabel={formatOptionLabel}
        onMenuClose={() => visibility(true)}
      />
    </div>
  )
}
