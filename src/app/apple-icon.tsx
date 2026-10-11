import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: 'linear-gradient(to bottom, #2f6a72, #1d3f4f)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 34,
          left: 84,
          width: 62,
          height: 62,
          borderRadius: '50%',
          background: '#ffd36e'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 74,
          left: 38,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#fff'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 58,
          left: 72,
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: '#fff'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 38,
          width: 106,
          height: 34,
          borderRadius: 17,
          background: '#fff'
        }}
      />
    </div>,
    { ...size }
  )
}
