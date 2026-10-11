import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Weather Site',
    short_name: 'Weather',
    start_url: '/',
    display: 'standalone',
    background_color: '#1d3f4f',
    theme_color: '#2f6a72',
    icons: [{ src: '/apple-icon', sizes: '180x180', type: 'image/png' }]
  }
}
