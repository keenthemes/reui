export function getRegistryDeploymentId(): string {
  return (
    process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID ??
    process.env.VERCEL_DEPLOYMENT_ID ??
    "local"
  )
}
