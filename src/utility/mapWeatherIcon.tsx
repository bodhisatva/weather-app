import Sun from '@/icons/clear-day.svg'
import PartlyCloudy from '@/icons/partly-cloudy-day.svg'
import Cloud from '@/icons/cloud.svg'
import Rain from '@/icons/rain.svg'
import Thunderstorm from '@/icons/thunderstorm.svg'
import Snowy from '@/icons/snowing.svg'
import Mist from '@/icons/mist.svg'

const mapWeatherIconCode = (iconCode: string) => {
  const iconMap: Record<string, any> = {
    '01d': Sun,
    '02d': PartlyCloudy,
    '03d': Cloud,
    '04d': Cloud,
    '09d': Rain,
    '10d': Rain,
    '11d': Thunderstorm,
    '13d': Snowy,
    '50d': Mist
  }

  return iconMap[iconCode]
}

export const createIcon = (iconCode: string) => {
  const Icon = mapWeatherIconCode(iconCode) || Sun

  return <Icon />
}

// const descriptionMap = {
//   '01d': 'sun',
//   '02d': 'few clouds',
//   '03d': 'scattered clouds',
//   '04d': 'broken clouds',
//   '09d': 'shower rain',
//   '10d': 'rain',
//   '11d': 'thunderstorm',
//   '13d': 'snow',
//   '50d': 'mist'
// }
