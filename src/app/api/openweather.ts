export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

const isValidCoordinate = (value: string, limit: number) => {
  if (value.trim() === '') return false

  const number = Number(value)
  const isNumber = Number.isFinite(number)
  const isInRange = Math.abs(number) <= limit

  return isNumber && isInRange
}

export const assertValidCoordinates = (lat: string, lon: string) => {
  const isValid = isValidCoordinate(lat, 90) && isValidCoordinate(lon, 180)

  if (!isValid) {
    throw new HttpError(400, 'Invalid coordinated')
  }
}

export const fetchOpenWeather = async <T>(
  baseUrl: string | undefined,
  lat: string,
  lon: string
): Promise<T> => {
  const apiKey = process.env.API_KEY

  if (!baseUrl || !apiKey) {
    throw new Error('Missing OpenWeather env variables')
  }

  const url = new URL(baseUrl)
  url.searchParams.set('lat', lat)
  url.searchParams.set('lon', lon)
  url.searchParams.set('appid', apiKey)
  url.searchParams.set('units', 'metric')

  const response = await fetch(url, { next: { revalidate: 300 } })

  if (response.status === 404) {
    throw new HttpError(404, 'Location not found')
  }

  if (!response.ok) {
    throw new HttpError(502, `OpenWeather responded ${response.status}`)
  }

  return response.json()
}

export const toErrorResponse = (error: unknown): Response => {
  if (error instanceof HttpError && error.status < 500) {
    return Response.json({ message: error.message }, { status: error.status })
  }

  console.error(error)

  const status = error instanceof HttpError ? error.status : 500
  const message = status === 502 ? 'Weather service unavailable' : 'Something went wrong'

  return Response.json({ message }, { status })
}
