import { FC } from 'react'

interface Props {
  height: string
  width: string
}

export const SkeletonOneLine: FC<Props> = ({ height, width }) => {
  return <div className={`animate-pulse bg-slate-200 ${height} ${width} mt-2 rounded`} />
}
