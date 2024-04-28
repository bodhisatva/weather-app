import { FC } from 'react'

interface Props {
  height: string
}

export const SkeletonOneLine: FC<Props> = ({ height }) => {
  return <div className={`animate-pulse bg-slate-200 ${height} w-[80px] mt-2 rounded`} />
}
