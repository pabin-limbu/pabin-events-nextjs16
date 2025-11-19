export interface EventItem {
  title: string
  image: string
  slug: string
  location: string
  date: string // human-readable date (e.g., "March 18, 2026")
  time: string // human-readable time (e.g., "09:00 AM UTC")
}

export const events: EventItem[] = [
  {
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "March 18, 2026",
    time: "09:00 AM UTC"
  },
  {
    title: "Next.js Conf 2026",
    image: "/images/event2.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA, USA",
    date: "April 22, 2026",
    time: "10:00 AM PDT"
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event3.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "May 12, 2026",
    time: "09:30 AM CEST"
  },
  {
    title: "HackMIT 2026",
    image: "/images/event4.png",
    slug: "hackmit-2026",
    location: "Cambridge, MA, USA",
    date: "January 24, 2026",
    time: "08:00 AM EST"
  },
  {
    title: "ETHGlobal London 2026",
    image: "/images/event5.png",
    slug: "ethglobal-london-2026",
    location: "London, UK",
    date: "June 5, 2026",
    time: "09:00 AM BST"
  },
  {
    title: "Flutter Forward 2026",
    image: "/images/event6.png",
    slug: "flutter-forward-2026",
    location: "New York, NY, USA",
    date: "September 14, 2026",
    time: "10:00 AM EDT"
  },
  {
    title: "GitHub Universe 2025",
    image: "/images/event-full.png",
    slug: "github-universe-2025",
    location: "Virtual / San Francisco, CA, USA",
    date: "November 12, 2025",
    time: "04:00 PM PST"
  }
]
export default events;