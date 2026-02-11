"use client"

import React from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/custom/card"
import { Heading } from "@/components/custom/heading"

interface Testimonial {
  text: string
  author: {
    name: string
    handle: string
    avatar: string
    verified?: boolean
  }
}

const testimonials: Testimonial[] = [
  {
    text: "Nice. Looking forward to seeing what the community builds with the new styles.",
    author: {
      name: "shadcn",
      handle: "@shadcn",
      avatar: "https://unavatar.io/twitter/@shadcn",
      verified: true,
    },
  },
  {
    text: "This looks insane! 🔥 The 1,000+ curated patterns and blocks alone are going to save so many hours. Super excited for the shadcn primitives integration and theme support—can't wait to dive in when 2.0 drops! 🚀",
    author: {
      name: "FullStack Flow",
      handle: "@FullstackFlow",
      avatar: "https://unavatar.io/twitter/@FullstackFlow",
      verified: true,
    },
  },
  {
    text: "Good luck!! You got this 🚀",
    author: {
      name: "Vix Clotet 🐧",
      handle: "@vixclotet",
      avatar: "https://unavatar.io/twitter/@vixclotet",
      verified: true,
    },
  },
  {
    text: "If there are changes on how to consume the component from the last version, please provide a migration guide of possible. Appreciate all the work, this is by far my favorite component.",
    author: {
      name: "Ayoub Alfurjani",
      handle: "@ZeroDrive1",
      avatar: "https://unavatar.io/twitter/@ZeroDrive1",
      verified: false,
    },
  },
  {
    text: "I absolutely love this! - I’ve always struggled a lot with implementing this by hand xD How does it handle when a user presses delete? - does it auto remove the next-in-line filter? - and can it be extended to work with stuff like if a user types “s:” to it then becoming a filter",
    author: {
      name: "Jay ♡",
      handle: "@xwx_fox",
      avatar: "https://unavatar.io/twitter/@xwx_fox",
      verified: true,
    },
  },
  {
    text: "This looks pretty amazing! 🔥",
    author: {
      name: "supersheykh",
      handle: "@SuperSheykh",
      avatar: "https://unavatar.io/twitter/@SuperSheykh",
      verified: true,
    },
  },
  {
    text: "mindblowing, looks perfect with the menu rounded box",
    author: {
      name: "Fahreza",
      handle: "@10mfahreza",
      avatar: "https://unavatar.io/x/@10mfahreza",
      verified: false,
    },
  },
  {
    text: "The nuqs integration 🔥🔥Thank you guys amazing work you keep smashing this library out the park",
    author: {
      name: "WebCraft",
      handle: "@webcraftdes",
      avatar: "https://unavatar.io/twitter/@webcraftdes",
      verified: false,
    },
  },
  {
    text: "Good shit. Started using re ui for a few elements in one of the $1B+ apps out there",
    author: {
      name: "origami",
      handle: "@sevenfootpole",
      avatar: "https://unavatar.io/twitter/@sevenfootpole",
      verified: true,
    },
  },
  {
    text: "Really well done!",
    author: {
      name: "Byron Wade",
      handle: "@byron_c_wade",
      avatar: "https://unavatar.io/twitter/@byron_c_wade",
      verified: false,
    },
  },
  {
    text: "About a week later, and I love it ❤️. You guys have some great stuff on your website. I check it basically every day now",
    author: {
      name: "GARRETT",
      handle: "@GarrettPullis",
      avatar: "https://unavatar.io/twitter/@GarrettPullis",
      verified: true,
    },
  },
  {
    text: "Where was this in 2021 when I had a 1k line custom table component and had to self roll a shittier version of this. Insane work, the nuqs integration is :chefs_kiss:",
    author: {
      name: "smrth",
      handle: "@ialreadyshipped",
      avatar: "https://unavatar.io/twitter/@ialreadyshipped",
      verified: false,
    },
  },
  {
    text: "@shuxer  look i implemented the data grid in our Meta Ads bulk editing tool. and now i can complete it with the new filters components       ",
    author: {
      name: "Ife Ody",
      handle: "@Ife_Ody",
      avatar: "https://unavatar.io/twitter/@Ife_Ody",
      verified: false,
    },
  },
  {
    text: "Looks amazing! Thank you, this is exactly what I was looking for. I hope this works with any backend.",
    author: {
      name: "Divyesh Bhandari",
      handle: "@divyeshio",
      avatar: "https://unavatar.io/twitter/@divyeshio",
      verified: false,
    },
  },
  {
    text: "That's wonderful.  Influence and inspiration often flow in both directions.  What a testament to your work.",
    author: {
      name: "Himanshu Kumar",
      handle: "@codewithimanshu",
      avatar: "https://unavatar.io/twitter/@codewithimanshu",
      verified: true,
    },
  },
  {
    text: "Cool you have RTL support like that, it's unique from UI libs I've seen.A small overflow on mobile though 👀",
    author: {
      name: "Mo Bahrampour",
      handle: "@MHBahrampour",
      avatar: "https://unavatar.io/twitter/@MHBahrampour",
      verified: false,
    },
  },
  {
    text: "Great collaboration, love the tools",
    author: {
      name: "Frank",
      handle: "@duru_tobe",
      avatar: "https://unavatar.io/twitter/@duru_tobe",
      verified: true,
    },
  },
  {
    text: "Open source makes development faster for everyone.  This will be a great learning resource.",
    author: {
      name: "Himanshu Kumar",
      handle: "@codewithimanshu",
      avatar: "https://unavatar.io/twitter/@codewithimanshu",
      verified: true,
    },
  },
  {
    text: "As usual @reui_io always delivers; Quality UI, Code etc. I love the Data Grid + @tan_stack Table integration 🫶",
    author: {
      name: "David Benson",
      handle: "@DavidBensonX",
      avatar: "https://unavatar.io/twitter/@DavidBensonX",
      verified: false,
    },
  },
  {
    text: "I’ll be adding this to my CRM today. Very cool",
    author: {
      name: "Spanky McDoob",
      handle: "@59thProfile",
      avatar: "https://unavatar.io/twitter/@59thProfile",
      verified: true,
    },
  },
  {
    text: "Finally. A code I can steal for an easy  dnd feature.",
    author: {
      name: "Onyedikachi Ozoani",
      handle: "@onyedikachi224",
      avatar: "https://unavatar.io/twitter/@onyedikachi224",
      verified: false,
    },
  },
  {
    text: "love seeing sharp work like this",
    author: {
      name: "Mohd Kaif",
      handle: "@btwitskaif69",
      avatar: "https://unavatar.io/twitter/@btwitskaif69",
      verified: false,
    },
  },
  {
    text: "Absolutely love these animated text effects and file uploader also gonna use in my project",
    author: {
      name: "Aftab",
      handle: "@aahftab",
      avatar: "https://unavatar.io/twitter/@aahftab",
      verified: false,
    },
  },
  {
    text: "Incredible work & taste.",
    author: {
      name: "Pier",
      handle: "@Ark__PL",
      avatar: "https://unavatar.io/twitter/@Ark__PL",
      verified: true,
    },
  },
  {
    text: "Keep making cool components.When are you dropping Stepper, would love to have this soonest",
    author: {
      name: "David Benson",
      handle: "@DavidBensonX",
      avatar: "https://unavatar.io/twitter/@DavidBensonX",
      verified: false,
    },
  },
  {
    text: "That upload component is dope !!!!",
    author: {
      name: "Jidé ✨",
      handle: "@jidefr",
      avatar: "https://unavatar.io/twitter/@jidefr",
      verified: true,
    },
  },
  {
    text: "Cannot wait for this to drop. Using ReUI on a current project and am loving it.",
    author: {
      name: "Jalen Parham",
      handle: "@JalenParham97",
      avatar: "https://unavatar.io/twitter/@JalenParham97",
      verified: false,
    },
  },
  {
    text: "Love the customization options and drag and drop functionality, really takes table management to the next level",
    author: {
      name: "Mayank Singh",
      handle: "@mayanks_tw",
      avatar: "https://unavatar.io/twitter/@mayanks_tw",
      verified: false,
    },
  },
  {
    text: "Super clean.Implementing these in our admin dashboards ASAP",
    author: {
      name: "Joshua",
      handle: "@JoshuaThirteen",
      avatar: "https://unavatar.io/twitter/@JoshuaThirteen",
      verified: true,
    },
  },
  {
    text: "Those are sleek, nice job",
    author: {
      name: "Stas 🇺🇦",
      handle: "@stashladki",
      avatar: "https://unavatar.io/twitter/@stashladki",
      verified: false,
    },
  },
  {
    text: "This sounds amazing! Excited to see all the new features and the UI patterns you’ve put together. Can’t wait to try it out! @reui_io  🔥",
    author: {
      name: "ADil Sarfraz",
      handle: "@adilsarfraz02",
      avatar: "https://unavatar.io/twitter/@adilsarfraz02",
      verified: false,
    },
  },
  {
    text: "1000 component.Damn you guys really built",
    author: {
      name: "Wesley Eugene",
      handle: "@EugeneDevWesley",
      avatar: "https://unavatar.io/twitter/@EugeneDevWesley",
      verified: false,
    },
  },
  {
    text: "I love all your components",
    author: {
      name: "hlosamvrant",
      handle: "@hlosamvrant",
      avatar: "https://unavatar.io/twitter/@hlosamvrant",
      verified: false,
    },
  },
  {
    text: "I will use the data grid, looks amazing",
    author: {
      name: "Carlos Ziegler",
      handle: "@CARLOSZIEGLER",
      avatar: "https://unavatar.io/twitter/@CARLOSZIEGLER",
      verified: true,
    },
  },
  {
    text: "Data tables are just 🔥",
    author: {
      name: "Paras",
      handle: "@parasdevlife013",
      avatar: "https://unavatar.io/twitter/@parasdevlife013",
      verified: true,
    },
  },
  {
    text: "fire content bro",
    author: {
      name: "Guillem",
      handle: "@guillemcraft",
      avatar: "https://unavatar.io/twitter/@guillemcraft",
      verified: true,
    },
  },
  {
    text: "Your drop shadow usage is absolutely great",
    author: {
      name: "Furkan Deveci",
      handle: "@hifurki",
      avatar: "https://unavatar.io/twitter/@hifurki",
      verified: true,
    },
  },
  {
    text: "Absolutely awesome! This is going to simplify so many hurdles for me :D both for my dumb lil hobby projects - but also especially the things we build @ work! Amazing work ❤️",
    author: {
      name: "Jay ♡",
      handle: "@xwx_fox",
      avatar: "https://unavatar.io/twitter/@xwx_fox",
      verified: true,
    },
  },
  {
    text: "Amazing job , Can’t hold my self to ask when is the next release",
    author: {
      name: "Ashraf Elshaer 🇪🇬",
      handle: "@AshrafElshaer98",
      avatar: "https://unavatar.io/twitter/@AshrafElshaer98",
      verified: false,
    },
  },
  {
    text: "i use your components in my side-project, really awesome",
    author: {
      name: "Taqui",
      handle: "@md_taqui_imam",
      avatar: "https://unavatar.io/twitter/@md_taqui_imam",
      verified: true,
    },
  },
]

const INITIAL_DISPLAY_COUNT = 36

const TwitterVerifiedIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-label="Verified account"
    className={cn("fill-[#1d9bf0]", className)}
  >
    <g>
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.08s-2.47-1.27-4.08-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.97-.2-4.08.81s-1.27 2.47-.81 4.08c-1.31.66-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 4.08s2.47 1.27 4.08.81c.66 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.97.2 4.08-.81s1.27-2.47.81-4.08c1.32-.66 2.2-1.91 2.2-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.35-6.2 6.78z"></path>
    </g>
  </svg>
)

export function WallOfLove() {
  const [showAll, setShowAll] = React.useState(false)

  const displayedTestimonials = showAll
    ? testimonials
    : testimonials.slice(0, INITIAL_DISPLAY_COUNT)

  return (
    <section className="py-12 lg:py-24">
      <div className="container">
        <Heading
          badge="Feedback"
          title="Wall of Love"
          description="Hear from our community about their hands-on experience and feedback."
        />
        <div className="relative">
          <div
            className={cn(
              "columns-1 gap-2.5 space-y-3 sm:columns-2 lg:columns-3 xl:columns-4",
              !showAll && "overflow-hidden"
            )}
          >
            {displayedTestimonials.map((testimonial, i) => (
              <Card key={i}>
                <div className="flex h-full flex-col gap-4">
                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="mt-auto flex items-center gap-2.5 pt-2">
                    <Avatar className="border-border h-9 w-9 border">
                      <AvatarImage
                        src={testimonial.author.avatar}
                        alt={testimonial.author.name}
                      />
                      <AvatarFallback>
                        {testimonial.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-foreground truncate text-sm font-semibold">
                          {testimonial.author.name}
                        </span>
                        {testimonial.author.verified && (
                          <TwitterVerifiedIcon className="h-3.5 w-3.5 shrink-0" />
                        )}
                      </div>
                      <Link
                        href={`https://x.com/${testimonial.author.handle}`}
                        className="text-muted-foreground truncate text-xs hover:underline"
                      >
                        {testimonial.author.handle}
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {!showAll && (
            <div className="from-background to-gray-100/ pointer-events-none absolute inset-x-0 bottom-0 hidden h-60 bg-linear-to-t to-5%" />
          )}
        </div>
        {testimonials.length > INITIAL_DISPLAY_COUNT && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="px-8"
            >
              {showAll ? "Show less" : "Show more"}
              {showAll ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
