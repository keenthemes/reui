import { ImageResponse } from "next/og"

async function loadAssets(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import("./geist-regular-otf.json").then((mod) => mod.default || mod),
    import("./geistmono-regular-otf.json").then((mod) => mod.default || mod),
    import("./geist-semibold-otf.json").then((mod) => mod.default || mod),
  ])

  return [
    {
      name: "Geist",
      data: Buffer.from(normal, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist Mono",
      data: Buffer.from(mono, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: Buffer.from(semibold, "base64"),
      weight: 600 as const,
      style: "normal" as const,
    },
  ]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")
  const description = searchParams.get("description")

  const [fonts] = await Promise.all([loadAssets()])

  const response = new ImageResponse(
    <div
      tw="flex h-full w-full bg-black text-white"
      style={{ fontFamily: "Geist Sans" }}
    >
      <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 left-2 w-px" />
      <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 right-2 w-px" />
      <div tw="flex border absolute border-stone-700 inset-x-0 h-px top-2" />
      <div tw="flex border absolute border-stone-700 inset-x-0 h-px bottom-2" />
      <div tw="flex absolute flex-row bottom-12 right-12">
        <svg
          width="80"
          height="80"
          viewBox="0 0 101 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.2"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M67.1667 3.98153H33.8333C17.548 3.98153 4.34615 17.1834 4.34615 33.4687V66.802C4.34615 83.0874 17.548 96.2892 33.8333 96.2892H67.1667C83.452 96.2892 96.6538 83.0874 96.6538 66.802V33.4687C96.6538 17.1834 83.452 3.98153 67.1667 3.98153ZM33.8333 0.135376C15.4238 0.135376 0.5 15.0592 0.5 33.4687V66.802C0.5 85.2115 15.4238 100.135 33.8333 100.135H67.1667C85.5762 100.135 100.5 85.2115 100.5 66.802V33.4687C100.5 15.0592 85.5762 0.135376 67.1667 0.135376H33.8333Z"
            fill="white"
          />
          <circle cx="70.634" cy="29.8334" r="4.69799" fill="white" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M25.668 57.0144V29.8332C25.668 27.2385 27.7713 25.1352 30.366 25.1352V25.1352C32.9606 25.1352 35.0639 27.2385 35.0639 29.8332V57.0144C35.0639 61.833 38.9702 65.7392 43.7888 65.7392H57.2116C62.0302 65.7392 65.9364 61.833 65.9364 57.0144V43.7258C65.9364 41.1312 68.0398 39.0278 70.6344 39.0278V39.0278C73.229 39.0278 75.3324 41.1312 75.3324 43.7258V57.0144C75.3324 67.0222 67.2194 75.1352 57.2116 75.1352H43.7888C33.7809 75.1352 25.668 67.0222 25.668 57.0144Z"
            fill="white"
          />
        </svg>
      </div>
      <div tw="flex flex-col absolute w-[896px] justify-center inset-32">
        <div
          tw="tracking-tight flex-grow-1 flex flex-col justify-center leading-[1.1]"
          style={{
            textWrap: "balance",
            fontWeight: 600,
            fontSize: title && title.length > 20 ? 64 : 80,
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </div>
        <div
          tw="text-[40px] leading-[1.5] flex-grow-1 text-stone-400"
          style={{
            fontWeight: 500,
            textWrap: "balance",
          }}
        >
          {description}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 628,
      fonts,
    }
  )

  response.headers.set(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  )

  return response
}
