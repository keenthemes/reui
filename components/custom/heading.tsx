export function Heading({
  badge,
  title,
  description,
}: {
  badge: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
}) {
  return (
    <div className="mb-12 flex flex-col gap-3.5">
      <h2 className="max-w-[400px] text-3xl font-bold lg:text-4xl">{title}</h2>
      <p className="text-muted-foreground max-w-[500px] text-lg leading-relaxed">
        {description}
      </p>
    </div>
  )
}
