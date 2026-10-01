import { FC } from 'react'

const pulse = 'animate-pulse bg-slate-200 rounded'

export const CurrentWeatherSkeleton: FC = () => {
  return (
    <>
      <div className="flex items-center h-12.5">
        <div className={`${pulse} h-10 w-22.5`} />
      </div>
      <div className="flex items-center h-12.5">
        <div className={`${pulse} h-10 w-50`} />
      </div>
      <div className="flex items-center h-7 mt-2 mb-6">
        <div className={`${pulse} h-6 w-45`} />
      </div>
      <div className="flex items-center h-5 mb-3">
        <div className={`${pulse} h-4 w-17.5`} />
      </div>
      <div className="flex items-center h-6.25">
        <div className={`${pulse} h-5 w-55`} />
      </div>
    </>
  )
}
