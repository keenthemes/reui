import {
  buildComponentSourceRequestUrl,
  getComponentSourcePayloadCacheKey,
  type ComponentSourcePayload,
  type ComponentSourceRequestOptions,
} from "@/lib/component-source-request"

const payloadCache = new Map<string, ComponentSourcePayload>()
const inFlightPayloads = new Map<
  string,
  Promise<ComponentSourcePayload | null>
>()

export async function loadComponentSourcePayloadFromApi(
  options: ComponentSourceRequestOptions
) {
  const cacheKey = getComponentSourcePayloadCacheKey(options)
  const cachedPayload = payloadCache.get(cacheKey)

  if (cachedPayload) {
    return cachedPayload
  }

  const inFlightPayload = inFlightPayloads.get(cacheKey)
  if (inFlightPayload) {
    return inFlightPayload
  }

  const request = fetch(buildComponentSourceRequestUrl(options), {
    cache: "force-cache",
  })
    .then(async (response) => {
      if (response.status === 404) {
        return null
      }

      if (!response.ok) {
        throw new Error(`Failed to load component source: ${response.status}`)
      }

      const payload = (await response.json()) as ComponentSourcePayload
      payloadCache.set(cacheKey, payload)
      return payload
    })
    .finally(() => {
      inFlightPayloads.delete(cacheKey)
    })

  inFlightPayloads.set(cacheKey, request)

  return request
}
