import { createSearchParamsCache, parseAsString } from "nuqs/server"

// Define search params parsers for patterns
export const searchParamsParsers = {
  search: parseAsString.withDefault(""),
}

// Create a server-side cache for search params
export const searchParamsCache = createSearchParamsCache(searchParamsParsers)
