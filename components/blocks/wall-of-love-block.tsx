"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/custom/card"
import { Heading } from "@/components/custom/heading"
import { PageGridBackdrop } from "@/components/page-grid-backdrop"

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
    text: "Yes ReUI is part of the trusted registries. One of the best out there",
    author: {
      name: "shadcn",
      handle: "@shadcn",
      avatar:
        "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "There are thousands of shadcn libraries out there and you're the only one that knows what we need.",
    author: {
      name: "Ignacio Giri",
      handle: "@wearebuiltwell",
      avatar:
        "https://pbs.twimg.com/profile_images/1646905865595658247/56h8V1ro_400x400.png",
      verified: false,
    },
  },
  {
    text: "Everything your guys are producing is next level.",
    author: {
      name: "Richard Thermo",
      handle: "@RThermo56",
      avatar:
        "https://pbs.twimg.com/profile_images/1966799722938855424/KHxXsg7z_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "Congrats! Amazing things you guys shipped huge fan!",
    author: {
      name: "talha_ux",
      handle: "@talha_ux",
      avatar:
        "https://pbs.twimg.com/profile_images/2049000388448387072/5EjBOt9p_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "The data grid alone saved me weeks. Incredible work.",
    author: {
      name: "Anthony Miller",
      handle: "@nthonymiller",
      avatar:
        "https://pbs.twimg.com/profile_images/1537747609934176261/0w-tBCaI_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "This looks insane! 🔥 The 1,000+ curated patterns and blocks alone are going to save so many hours. Super excited for the shadcn primitives integration and theme support—can't wait to dive in when 2.0 drops! 🚀",
    author: {
      name: "FullStack Flow",
      handle: "@FullstackFlow",
      avatar:
        "https://pbs.twimg.com/profile_images/1981703201004097536/4jtzObjB_400x400.png",
      verified: true,
    },
  },
  {
    text: "About a week later, and I love it ❤️. You guys have some great stuff on your website. I check it basically every day now",
    author: {
      name: "GARRETT",
      handle: "@GarrettPullis",
      avatar:
        "https://pbs.twimg.com/profile_images/1952175845163900929/q8HIsPXN_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Looks amazing! Thank you, this is exactly what I was looking for. I hope this works with any backend.",
    author: {
      name: "Divyesh Bhandari",
      handle: "@divyeshio",
      avatar:
        "https://pbs.twimg.com/profile_images/1834849508242735108/MwXoJiAE_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "Love the customization options and drag and drop functionality, really takes table management to the next level",
    author: {
      name: "Mayank Singh",
      handle: "@mayanks_tw",
      avatar:
        "https://pbs.twimg.com/profile_images/1952601956846804992/Brku_Dly_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "Good luck!! You got this 🚀",
    author: {
      name: "Vix Clotet 🐧",
      handle: "@vixclotet",
      avatar:
        "https://pbs.twimg.com/profile_images/2027700764315967488/wgEHDrrN_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "If there are changes on how to consume the component from the last version, please provide a migration guide of possible. Appreciate all the work, this is by far my favorite component.",
    author: {
      name: "Ayoub Alfurjani",
      handle: "@ZeroDrive1",
      avatar:
        "https://pbs.twimg.com/profile_images/1942138811045015553/thkFtwcR_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "This looks pretty amazing! 🔥",
    author: {
      name: "supersheykh",
      handle: "@SuperSheykh",
      avatar:
        "https://pbs.twimg.com/profile_images/1356684661255200770/m39jTumT_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "mindblowing, looks perfect with the menu rounded box",
    author: {
      name: "Fahreza",
      handle: "@10mfahreza",
      avatar:
        "https://pbs.twimg.com/profile_images/1908800540953526272/UllvXOZ9_400x400.png",
      verified: false,
    },
  },
  {
    text: "The nuqs integration 🔥🔥Thank you guys amazing work you keep smashing this library out the park",
    author: {
      name: "WebCraft",
      handle: "@webcraftdes",
      avatar:
        "https://pbs.twimg.com/profile_images/1773451880221319168/HheH4-r5_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "Good shit. Started using re ui for a few elements in one of the $1B+ apps out there",
    author: {
      name: "origami",
      handle: "@sevenfootpole",
      avatar:
        "https://pbs.twimg.com/profile_images/2001383011426729986/5TdN15tG_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Really well done!",
    author: {
      name: "Byron Wade",
      handle: "@byron_c_wade",
      avatar:
        "https://pbs.twimg.com/profile_images/1869046034493784064/hZw22XeV_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "@shuxer  look i implemented the data grid in our Meta Ads bulk editing tool. and now i can complete it with the new filters components       ",
    author: {
      name: "Ife Ody",
      handle: "@Ife_Ody",
      avatar:
        "https://pbs.twimg.com/profile_images/1978203573310599168/adqoS0VO_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "That's wonderful.  Influence and inspiration often flow in both directions.  What a testament to your work.",
    author: {
      name: "Himanshu Kumar",
      handle: "@codewithimanshu",
      avatar:
        "https://pbs.twimg.com/profile_images/2025653770273849344/Hu4W4WjX_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Cool you have RTL support like that, it's unique from UI libs I've seen.A small overflow on mobile though 👀",
    author: {
      name: "Mo Bahrampour",
      handle: "@MHBahrampour",
      avatar:
        "https://pbs.twimg.com/profile_images/1964752647199608832/5QKJYxn8_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "Open source makes development faster for everyone.  This will be a great learning resource.",
    author: {
      name: "Himanshu Kumar",
      handle: "@codewithimanshu",
      avatar:
        "https://pbs.twimg.com/profile_images/2025653770273849344/Hu4W4WjX_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "As usual @reui_io always delivers; Quality UI, Code etc. I love the Data Grid + @tan_stack Table integration 🫶",
    author: {
      name: "David Benson",
      handle: "@DavidBensonX",
      avatar:
        "https://pbs.twimg.com/profile_images/1903029895934152704/f8vW0Rab_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "I’ll be adding this to my CRM today. Very cool",
    author: {
      name: "Spanky McDoob",
      handle: "@59thProfile",
      avatar:
        "https://pbs.twimg.com/profile_images/1883901517117149184/KMZX9gR8_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Finally. A code I can steal for an easy  dnd feature.",
    author: {
      name: "Onyedikachi Ozoani",
      handle: "@onyedikachi224",
      avatar:
        "https://pbs.twimg.com/profile_images/2021195538935250944/C7cL-oBX_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "love seeing sharp work like this",
    author: {
      name: "Mohd Kaif",
      handle: "@btwitskaif69",
      avatar:
        "https://pbs.twimg.com/profile_images/2057758785473777664/ozQiuDBI_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "Absolutely love these animated text effects and file uploader also gonna use in my project",
    author: {
      name: "Aftab",
      handle: "@aahftab",
      avatar:
        "https://pbs.twimg.com/profile_images/1893005262258094080/RCrQDuMV_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "Incredible work & taste.",
    author: {
      name: "Pier",
      handle: "@Ark__PL",
      avatar:
        "https://pbs.twimg.com/profile_images/2036069525804781568/9bgwx82Z_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Keep making cool components.When are you dropping Stepper, would love to have this soonest",
    author: {
      name: "David Benson",
      handle: "@DavidBensonX",
      avatar:
        "https://pbs.twimg.com/profile_images/1903029895934152704/f8vW0Rab_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "That upload component is dope !!!!",
    author: {
      name: "Jidé ✨",
      handle: "@jidefr",
      avatar:
        "https://pbs.twimg.com/profile_images/1745503582873346048/qv8gj3aS_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Cannot wait for this to drop. Using ReUI on a current project and am loving it.",
    author: {
      name: "Jalen Parham",
      handle: "@JalenParham97",
      avatar:
        "https://pbs.twimg.com/profile_images/1957492446700392448/VEL-bt9f_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "Super clean.Implementing these in our admin dashboards ASAP",
    author: {
      name: "Joshua",
      handle: "@JoshuaThirteen",
      avatar:
        "https://pbs.twimg.com/profile_images/1778987804845879296/IRQGE2r4_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Those are sleek, nice job",
    author: {
      name: "Stas 🇺🇦",
      handle: "@stashladki",
      avatar:
        "https://pbs.twimg.com/profile_images/1673191791212806144/_4_vcEVh_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "This sounds amazing! Excited to see all the new features and the UI patterns you’ve put together. Can’t wait to try it out! @reui_io  🔥",
    author: {
      name: "ADil Sarfraz",
      handle: "@adilsarfraz02",
      avatar:
        "https://pbs.twimg.com/profile_images/2029202885184270336/ZkyZHG5j_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "1000 component.Damn you guys really built",
    author: {
      name: "Wesley Eugene",
      handle: "@EugeneDevWesley",
      avatar:
        "https://pbs.twimg.com/profile_images/2067675902272569344/liyLQ9DY_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "I love all your components",
    author: {
      name: "hlosamvrant",
      handle: "@hlosamvrant",
      avatar:
        "https://pbs.twimg.com/profile_images/1893565914273968129/yDKeP36a_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "I will use the data grid, looks amazing",
    author: {
      name: "Carlos Ziegler",
      handle: "@CARLOSZIEGLER",
      avatar:
        "https://pbs.twimg.com/profile_images/1568523690098262017/5QUUdxQf_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Data tables are just 🔥",
    author: {
      name: "Paras",
      handle: "@parasdevlife013",
      avatar:
        "https://pbs.twimg.com/profile_images/1764674660413702146/BzF8GGpX_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "fire content bro",
    author: {
      name: "Guillem",
      handle: "@guillemcraft",
      avatar:
        "https://pbs.twimg.com/profile_images/1947616942417666048/w1bKRPLP_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Your drop shadow usage is absolutely great",
    author: {
      name: "Furkan Deveci",
      handle: "@hifurki",
      avatar:
        "https://pbs.twimg.com/profile_images/1991802349375938560/8xEYx8SG_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Amazing job , Can’t hold my self to ask when is the next release",
    author: {
      name: "Ashraf Elshaer 🇪🇬",
      handle: "@AshrafElshaer98",
      avatar:
        "https://pbs.twimg.com/profile_images/1759709438364012544/qDoA6KDT_400x400.jpg",
      verified: false,
    },
  },
  {
    text: "i use your components in my side-project, really awesome",
    author: {
      name: "Taqui",
      handle: "@md_taqui_imam",
      avatar:
        "https://pbs.twimg.com/profile_images/2009977729740091396/57OsMG_h_400x400.jpg",
      verified: true,
    },
  },
  {
    text: "Dude my saas project frontend depends on reui. The components are production-ready right out of the box, it's been a huge time-saver! 😉",
    author: {
      name: "Tayeb 🇩🇿 🇵🇸",
      handle: "@tay_khed",
      avatar:
        "https://pbs.twimg.com/profile_images/1685893224479547392/ATvaaS91_400x400.jpg",
      verified: false,
    },
  },
]

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

export function WallOfLoveBlock() {
  return (
    <section
      className="relative overflow-hidden py-12 lg:py-24"
      style={{ contentVisibility: "auto", containIntrinsicSize: "2400px" }}
    >
      {/* Section heading halo: shared grid texture with an early top fade. */}
      <PageGridBackdrop variant="section" />
      <div className="relative z-10 container">
        <Heading
          badge="Feedbacks"
          title="Wall of Love"
          description="Hear from our community about their hands-on experience and feedback."
        />
        <div className="columns-1 gap-2.5 space-y-3 sm:columns-2 lg:columns-3 xl:columns-4">
          {testimonials.map((testimonial, i) => (
            <Card key={i}>
              <div className="flex h-full flex-col gap-4">
                <p className="text-site-foreground/90 text-sm leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="mt-auto flex items-center gap-2.5 pt-2">
                  <Avatar className="border-site-border h-9 w-9 border">
                    {/* Only render the image when we have a resolved URL;
                          an empty src would otherwise re-request the page. */}
                    {testimonial.author.avatar ? (
                      <AvatarImage
                        src={testimonial.author.avatar}
                        alt={testimonial.author.name}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    <AvatarFallback>
                      {testimonial.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-site-foreground truncate text-sm font-semibold">
                        {testimonial.author.name}
                      </span>
                      {testimonial.author.verified && (
                        <TwitterVerifiedIcon className="h-3.5 w-3.5 shrink-0" />
                      )}
                    </div>
                    <Link
                      href={`https://x.com/${testimonial.author.handle}`}
                      className="text-site-muted-foreground truncate text-xs hover:underline"
                    >
                      {testimonial.author.handle}
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
