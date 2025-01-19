// Function to build query string dynamically
export const buildQueryString = (params: { [key: string]: any }) => {
  const searchParams = new URLSearchParams()

  // Iterate over the parameters and append only the defined values
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}
