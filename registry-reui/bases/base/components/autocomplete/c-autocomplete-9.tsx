// Description: With search results
// Order: 9

"use client"

import { ReactNode, useEffect, useState } from "react"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@/registry-reui/bases/base/reui/autocomplete"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [searchValue, setSearchValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Developer[]>([])
  const [error, setError] = useState<string | null>(null)

  const { contains } = AutocompletePrimitive.useFilter({ sensitivity: "base" })

  useEffect(() => {
    if (!searchValue) {
      setSearchResults([])
      setIsLoading(false)
      return undefined
    }

    setIsLoading(true)
    setError(null)

    let ignore = false

    async function fetchDevelopers() {
      try {
        const results = await searchDevelopers(searchValue, contains)
        if (!ignore) {
          setSearchResults(results)
        }
      } catch {
        if (!ignore) {
          setError("Failed to fetch developers. Please try again.")
          setSearchResults([])
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    const timeoutId = setTimeout(fetchDevelopers, 300)

    return () => {
      clearTimeout(timeoutId)
      ignore = true
    }
  }, [searchValue, contains])

  let status: ReactNode = ""

  if (isLoading) {
    status = (
      <div className="flex items-center gap-2">
        <IconPlaceholder
          lucide="LoaderCircleIcon"
          tabler="IconLoader2"
          hugeicons="Loading02Icon"
          phosphor="CircleNotchIcon"
          remixicon="RiLoader4Line"
          className="size-4 animate-spin"
          aria-hidden
        />
        Searching developers...
      </div>
    )
  } else if (error) {
    status = error
  } else if (searchResults.length === 0 && searchValue) {
    status = `No developers found for "${searchValue}"`
  } else if (searchResults.length > 0) {
    status = `${searchResults.length} developer${searchResults.length === 1 ? "" : "s"} found`
  } else if (!searchValue) {
    status = "Start typing to search developers..."
  }

  const shouldRenderPopup = searchValue !== ""

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        items={searchResults}
        value={searchValue}
        onValueChange={setSearchValue}
        itemToStringValue={(item: unknown) => (item as Developer).name}
        filter={null}
      >
        <AutocompleteInput
          placeholder="e.g. John Smith, React, San Francisco"
          showTrigger
          showClear
        />
        {shouldRenderPopup && (
          <AutocompleteContent>
            <AutocompleteStatus>{status}</AutocompleteStatus>
            <AutocompleteList>
              {(developer: Developer) => (
                <AutocompleteItem
                  key={developer.id}
                  value={developer}
                  className="rounded-lg"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={developer.avatar}
                        alt={developer.name}
                      />
                      <AvatarFallback>
                        {developer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">
                        {developer.name}
                      </div>
                      <div className="text-muted-foreground truncate text-sm">
                        {developer.role} • {developer.location}
                      </div>
                    </div>
                  </div>
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        )}
      </Autocomplete>
    </div>
  )
}

async function searchDevelopers(
  query: string,
  filter: (item: string, query: string) => boolean
): Promise<Developer[]> {
  // Simulate network delay
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 800 + 200)
  })

  // Simulate occasional network errors (2% chance)
  if (Math.random() < 0.02 || query === "error") {
    throw new Error("Network error")
  }

  return topDevelopers.filter(
    (developer) =>
      filter(developer.name, query) ||
      filter(developer.role, query) ||
      filter(developer.location, query) ||
      developer.skills.some((skill) => filter(skill, query))
  )
}

interface Developer {
  id: string
  name: string
  role: string
  location: string
  skills: string[]
  experience: number
  rating: number
  avatar: string
}

const topDevelopers: Developer[] = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Senior Full-Stack Developer",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    experience: 8,
    rating: 4.9,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Frontend Architect",
    location: "New York, NY",
    skills: ["Vue.js", "JavaScript", "CSS", "Webpack", "Figma"],
    experience: 10,
    rating: 4.8,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    role: "Backend Engineer",
    location: "Austin, TX",
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Kubernetes"],
    experience: 6,
    rating: 4.7,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    name: "Emily Wang",
    role: "DevOps Engineer",
    location: "Seattle, WA",
    skills: ["AWS", "Terraform", "Jenkins", "Docker", "Linux"],
    experience: 7,
    rating: 4.9,
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "5",
    name: "David Kim",
    role: "Mobile Developer",
    location: "Los Angeles, CA",
    skills: ["React Native", "Swift", "Kotlin", "Firebase", "GraphQL"],
    experience: 5,
    rating: 4.6,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "6",
    name: "Lisa Thompson",
    role: "Data Engineer",
    location: "Boston, MA",
    skills: ["Python", "Spark", "Airflow", "Snowflake", "dbt"],
    experience: 9,
    rating: 4.8,
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: "7",
    name: "James Wilson",
    role: "Cloud Solutions Architect",
    location: "Chicago, IL",
    skills: ["AWS", "Azure", "Terraform", "Kubernetes", "Microservices"],
    experience: 12,
    rating: 4.9,
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: "8",
    name: "Maria Garcia",
    role: "UI/UX Developer",
    location: "Miami, FL",
    skills: ["React", "Figma", "CSS-in-JS", "Storybook", "Accessibility"],
    experience: 4,
    rating: 4.5,
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: "9",
    name: "Robert Taylor",
    role: "Machine Learning Engineer",
    location: "Denver, CO",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "Docker"],
    experience: 6,
    rating: 4.7,
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: "10",
    name: "Jennifer Lee",
    role: "Blockchain Developer",
    location: "San Diego, CA",
    skills: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "Rust"],
    experience: 5,
    rating: 4.6,
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    id: "11",
    name: "Christopher Brown",
    role: "Security Engineer",
    location: "Portland, OR",
    skills: ["Cybersecurity", "Penetration Testing", "OWASP", "SIEM", "Python"],
    experience: 8,
    rating: 4.8,
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "12",
    name: "Amanda Davis",
    role: "Game Developer",
    location: "Orlando, FL",
    skills: ["Unity", "C#", "Unreal Engine", "3D Modeling", "VR/AR"],
    experience: 7,
    rating: 4.7,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "13",
    name: "Kevin Zhang",
    role: "AI Research Engineer",
    location: "Palo Alto, CA",
    skills: ["Python", "PyTorch", "Transformers", "NLP", "Computer Vision"],
    experience: 6,
    rating: 4.9,
    avatar: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    id: "14",
    name: "Rachel Green",
    role: "QA Automation Engineer",
    location: "Phoenix, AZ",
    skills: ["Selenium", "Cypress", "Jest", "Python", "Test Automation"],
    experience: 5,
    rating: 4.6,
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    id: "15",
    name: "Daniel Martinez",
    role: "System Administrator",
    location: "Dallas, TX",
    skills: [
      "Linux",
      "Windows Server",
      "Active Directory",
      "PowerShell",
      "VMware",
    ],
    experience: 10,
    rating: 4.8,
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    id: "16",
    name: "Sophie Anderson",
    role: "Product Manager",
    location: "San Jose, CA",
    skills: [
      "Product Strategy",
      "Agile",
      "Analytics",
      "User Research",
      "Figma",
    ],
    experience: 8,
    rating: 4.7,
    avatar: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    id: "17",
    name: "Mark Thompson",
    role: "Database Administrator",
    location: "Atlanta, GA",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Performance Tuning"],
    experience: 11,
    rating: 4.9,
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    id: "18",
    name: "Jessica White",
    role: "Technical Writer",
    location: "Raleigh, NC",
    skills: [
      "Technical Writing",
      "Markdown",
      "API Documentation",
      "Git",
      "Confluence",
    ],
    experience: 6,
    rating: 4.5,
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    id: "19",
    name: "Andrew Clark",
    role: "Site Reliability Engineer",
    location: "Nashville, TN",
    skills: [
      "Monitoring",
      "Incident Response",
      "Python",
      "Terraform",
      "Kubernetes",
    ],
    experience: 7,
    rating: 4.8,
    avatar: "https://randomuser.me/api/portraits/men/19.jpg",
  },
  {
    id: "20",
    name: "Nicole Taylor",
    role: "Frontend Developer",
    location: "Minneapolis, MN",
    skills: ["Angular", "TypeScript", "RxJS", "SCSS", "Jest"],
    experience: 4,
    rating: 4.6,
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
  },
  {
    id: "21",
    name: "Ryan Murphy",
    role: "Backend Developer",
    location: "Kansas City, MO",
    skills: ["Java", "Spring Boot", "Microservices", "MongoDB", "Docker"],
    experience: 6,
    rating: 4.7,
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
  },
  {
    id: "22",
    name: "Stephanie Lewis",
    role: "Full-Stack Developer",
    location: "Salt Lake City, UT",
    skills: ["React", "Node.js", "GraphQL", "PostgreSQL", "AWS"],
    experience: 5,
    rating: 4.6,
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: "23",
    name: "Brandon Wright",
    role: "Cloud Engineer",
    location: "Las Vegas, NV",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Python"],
    experience: 8,
    rating: 4.8,
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
  },
  {
    id: "24",
    name: "Ashley Hall",
    role: "DevOps Engineer",
    location: "Columbus, OH",
    skills: ["CI/CD", "Jenkins", "GitLab", "Docker", "AWS"],
    experience: 6,
    rating: 4.7,
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    id: "25",
    name: "Tyler Young",
    role: "Mobile App Developer",
    location: "Tampa, FL",
    skills: ["Flutter", "Dart", "Firebase", "REST APIs", "Git"],
    experience: 4,
    rating: 4.5,
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
  },
]
