import Sun from '@/icons/clear-day.svg'
import PartlyCloudy from '@/icons/partly-cloudy-day.svg'
import Cloud from '@/icons/cloud.svg'
import Rain from '@/icons/rain.svg'
import Thunderstorm from '@/icons/thunderstorm.svg'
import Snowy from '@/icons/snowing.svg'
import Mist from '@/icons/mist.svg'
import Moon from '@/icons/clear-night.svg'
import PartlyCloudyNight from '@/icons/partly-cloudy-night.svg'
import Showers from '@/icons/rainy-light.svg'
import { FC, SVGProps } from 'react'

const mapWeatherIconCode = (iconCode: string) => {
  const iconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
    '01d': Sun, // clear sky
    '01n': Moon, // clear sky at night
    '02d': PartlyCloudy, // few clouds
    '02n': PartlyCloudyNight, // few clouds at night
    '03d': Cloud, // scattered clouds
    '03n': Cloud, // scattered clouds at night
    '04d': Cloud, // broken clouds
    '04n': Cloud, // broken clouds at night
    '09d': Showers, // shower rain
    '09n': Showers, // shower rain at night
    '10d': Rain, // rain
    '10n': Rain, // rain at night
    '11d': Thunderstorm, // thunderstorm
    '11n': Thunderstorm, // thunderstorm at night
    '13d': Snowy, // snow
    '13n': Snowy, // snow at night
    '50d': Mist, // mist
    '50n': Mist // mist at night
  }

  return iconMap[iconCode]
}

export const createIcon = (iconCode: string) => {
  const Icon = mapWeatherIconCode(iconCode) || Sun

  return <Icon />
}

const iconColors: Record<string, string> = {
  '01d': '[&>svg]:fill-amber-200',
  '01n': '[&>svg]:fill-indigo-100',
  '02d': '[&>svg]:fill-amber-50',
  '02n': '[&>svg]:fill-indigo-100',
  '03': '[&>svg]:fill-slate-100',
  '04': '[&>svg]:fill-slate-100',
  '09': '[&>svg]:fill-sky-200',
  '10': '[&>svg]:fill-sky-200',
  '11': '[&>svg]:fill-amber-200',
  '13': '[&>svg]:fill-cyan-100',
  '50': '[&>svg]:fill-slate-100'
}

export const weatherIconColor = (iconCode: string) =>
  iconColors[iconCode] ?? iconColors[iconCode.slice(0, 2)] ?? ''

const iconAnimations: Record<string, string> = {
  '01d': 'motion-safe:animate-spin-slow',
  '01n': 'motion-safe:animate-sway',
  '02': 'motion-safe:animate-drift',
  '03': 'motion-safe:animate-drift',
  '04': 'motion-safe:animate-drift',
  '09': 'motion-safe:animate-bob',
  '10': 'motion-safe:animate-bob',
  '11': 'motion-safe:animate-flicker',
  '13': 'motion-safe:animate-bob',
  '50': 'motion-safe:animate-drift'
}

export const weatherIconAnimation = (iconCode: string) =>
  iconAnimations[iconCode] ?? iconAnimations[iconCode.slice(0, 2)] ?? ''
