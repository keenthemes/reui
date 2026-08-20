import type { SVGProps } from "react"

const Dropbox = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 64 56">
    <path fill="#0061FF" d="M16 0 0 10.5 16 21l16-10.5L16 0Z" />
    <path fill="#0061FF" d="m48 0-16 10.5L48 21l16-10.5L48 0Z" />
    <path fill="#0061FF" d="M16 21 0 31.5 16 42l16-10.5L16 21Z" />
    <path fill="#0061FF" d="M48 21 32 31.5 48 42l16-10.5L48 21Z" />
    <path fill="#0061FF" d="M32 35 16 45.5 32 56l16-10.5L32 35Z" />
  </svg>
)

export { Dropbox }
