// Description: Animated loading dots
// Order: 10

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="bg-primary size-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
      <span className="bg-primary size-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
      <span className="bg-primary size-2 animate-bounce rounded-full" />
    </div>
  )
}
