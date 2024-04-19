import { CurrentLocation } from '@/components/CurrentLocation'
import { SearchWeather } from '@/components/SearchWeather'

export default function Home() {
  return (
    <main>
      <div className="inlineRow">
        <p>Weather Site</p>
      </div>
      <div className="inlineRow">
        <CurrentLocation />
      </div>
      <div>
        <SearchWeather />
      </div>
    </main>
  )
}
