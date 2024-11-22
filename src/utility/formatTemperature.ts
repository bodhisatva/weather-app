const temperaturePrefix = (temperature: number) =>
  temperature > 0 ? `+${temperature}` : `${temperature}`

export const formatTemperature = (temperature: number) => temperaturePrefix(Math.floor(temperature))

export const formatClosestInteger = (number: number) => temperaturePrefix(Math.round(number))
