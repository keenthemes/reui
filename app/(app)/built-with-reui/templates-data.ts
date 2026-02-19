import { Icons } from "@/components/icons"

type Template = {
  title: string
  previewUrl: string
  purchaseUrl?: string
  description: string
  popular?: boolean
  stack?: string[]
  new?: boolean
  thumbnail?: string
  price?: string
  free?: boolean
  market?: string
}

export const templates: Template[] = [
  {
    title: "Metronic",
    purchaseUrl: "https://1.envato.market/Vm7VRE",
    previewUrl:
      "https://keenthemes.com/metronic?utm_source=reui_website&utm_medium=menu&utm_campaign=product_link&utm_content=metronic",
    description:
      "Metronic is a premium admin template used by 118,000 developers that is built with React, Next.js, TypeScript, Supabase, Prisma ORM and Tailwind CSS.",
    stack: [
      "react",
      "nextjs",
      "tailwind",
      "motion",
      "reui",
      "shadcn",
      "radix",
      "supabase",
      "prisma",
    ],
    thumbnail: "metronic-1.png",
    price: "$49",
    market: "Themeforest",
  },
  {
    title: "Summit",
    purchaseUrl:
      "https://keenthemes.com/products/summit-nextjs?utm_source=reui_website&utm_medium=menu&utm_campaign=product_link&utm_content=summit",
    previewUrl:
      "https://summit-nextjs.keenthemes.com?utm_source=reui_website&utm_medium=menu&utm_campaign=product_link&utm_content=summit",
    description:
      "Summit is a premium admin template built with React, Next.js, TypeScript and Tailwind CSS using ReUI & shadcn/ui components.",
    stack: ["react", "nextjs", "tailwind", "reui", "shadcn", "radix"],
    thumbnail: "summit.png",
    price: "$99",
    market: "Keenthemes",
  },
  {
    title: "SaaSify",
    previewUrl:
      "https://keenthemes.com/products/saasify?utm_source=reui_website&utm_medium=menu&utm_campaign=product_link&utm_content=saasify",
    description:
      "SaaSify is a premium landing page template for marketing and product showcase built with React, Next.js, TypeScript, Motion and Tailwind CSS.",
    price: "$59",
    stack: ["react", "nextjs", "tailwind", "shadcn", "reui", "radix", "motion"],
    thumbnail: "saasify-1.png",
    market: "Keenthemes",
  },
]
