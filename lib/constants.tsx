export const FEATURES = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    title: "Real-Time Event Tracking",
    desc: "Monitor user interactions, conversions, and system events as they happen. Get instant visibility into your application's performance.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
        />
      </svg>
    ),
    title: "Cross-Platform Analytics",
    desc: "Track user behavior across web, mobile, and desktop platforms. Understand how users interact with every part of your application.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
        />
      </svg>
    ),
    title: "Custom Event Monitoring",
    desc: "Track any event that matters to your business. From sign-ups to feature usage, get insights into every aspect of your application.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
    title: "Performance Metrics",
    desc: "Monitor application performance, load times, and user experience metrics. Keep your application running at peak efficiency.",
  },
];

export const PERFORMANCE_METRICS = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo",
];

export const DETAILED_METRICS = [
  {
    label: "First Contentful Paint",
    key: "firstContentfulPaint",
    format: "time",
  },
  {
    label: "Largest Contentful Paint",
    key: "largestContentfulPaint",
    format: "time",
  },
  { label: "Time to Interactive", key: "timeToInteractive", format: "time" },
  { label: "Total Blocking Time", key: "totalBlockingTime", format: "time" },
  {
    label: "Cumulative Layout Shift",
    key: "cumulativeLayoutShift",
    format: "shift",
  },
  { label: "Speed Index", key: "speedIndex", format: "time" },
];

export const TWEETS = [
  "https://x.com/kelmedev/status/1861146824767107505",
  "https://x.com/GbenegbaraM/status/1860760001842717098",
  "https://x.com/Adityaguptareal/status/1860702277683515899",
  "https://x.com/namish_855/status/1859569277444993512",
  "https://x.com/amiswa2005/status/1858299362801033720",
];

export const TESTIMONIALS = [
  {
    name: "Camin McCluskey",
    role: "Co-Founder & CTO @Stackfix",
    testimonial:
      `Congrats on the launch and wow what a superb onboarding experience. I needed something super quick to setup ahead of my PH launch and couldn't be bothered with the usual pain of GA or Segment. I found this literally 60s ago and I'm up and running with analytics. Fantastic job @arjuncodess! Also really cool that you've blogged about how you built it, looking forward to diving into that as well`,
    avatarSrc:
      "https://ph-avatars.imgix.net/2602606/bcf13036-8a9b-4c32-ba86-60308e59242f.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=2",
  },
  {
    name: "Sahith",
    role: "Product and Brand Marketing",
    testimonial:
      "looks like a great product. will give it a shot soon! Congos on the launch!",
    avatarSrc:
      "https://ph-avatars.imgix.net/1637320/368c9df7-48b8-4ef2-9a6c-db209507d8cd.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=2",
  },
  {
    name: "ZanBuildz",
    role: "AI enthusiast and SaaS builder",
    testimonial:
      "Really useful product and a great initiative! hats off to the maker @arjuncodess",
    avatarSrc:
      "https://ph-avatars.imgix.net/7861658/original.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=2",
  },
  {
    name: "Huzaifa Shoukat",
    role: "CEO @Accento AI",
    testimonial:
      "Congrats on the launch! GetAnalyzr looks like a game-changer for devs.",
    avatarSrc:
      "https://ph-avatars.imgix.net/6221718/1dae9053-aebc-4762-b5d9-db8777ab10b2.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=2",
  },
  {
    name: "Yusuf ZQ",
    role: "Founder & CEO of WordWeave",
    testimonial:
      "cool work, Arjun!",
    avatarSrc:
      "https://ph-avatars.imgix.net/7822537/e4aebbf0-84b3-424c-b073-48a4bd4cfbb1.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=2",
  },
  {
    name: "Fred Marcoux",
    role: "Founder @ weever.ai & Let's Spit",
    testimonial:
      "Very great design!",
    avatarSrc:
      "https://ph-avatars.imgix.net/5117975/20a331aa-c28f-4c97-8163-83eef2440518.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=2",
  },
];