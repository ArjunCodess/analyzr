import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { FEATURES } from "@/lib/constants";
import { MockDiscordUI } from "@/components/mock-discord-ui";
import { AnimatedList } from "@/components/ui/animated-list";
import { DiscordMessage } from "@/components/discord-message";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Safari from "@/components/ui/safari";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <main className="flex flex-col divide-y divide-neutral-800">
      <div className="absolute left-1/2 -translate-x-1/2 h-[80vh] w-[80vw] bg-[radial-gradient(ellipse_50%_80%_at_50%_-20%,rgba(37,99,235,0.3),rgba(255,255,255,0))]"></div>

      <section className="relative max-w-full mx-auto md:pb-8">
        <div className="max-w-screen-xl mx-auto px-4 pb-14 pt-20 gap-12 text-neutral-600 md:px-8">
          <div className="space-y-8 max-w-5xl leading-0 lg:leading-5 mx-auto text-center">
            <BlurFade delay={0.1}>
              <Link
                target="_blank"
                href="https://www.producthunt.com/posts/getanalyzr?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-getanalyzr"
                className="flex justify-center"
              >
                <Image
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=586803&theme=dark"
                  alt="GetAnalyzr - Real-time analytics for modern applications | Product Hunt"
                  className="w-[180px] h-[40px] md:w-[250px] md:h-[54px]"
                  width={250}
                  height={54}
                  unoptimized
                />
              </Link>
            </BlurFade>

            <BlurFade delay={0.2}>
              <h2 className="text-4xl tracking-tighter bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] text-transparent mx-auto md:text-6xl">
                Know Your Users.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
                  Grow Your SaaS.
                </span>
              </h2>
            </BlurFade>

            <BlurFade delay={0.3}>
              <p className="max-w-2xl mx-auto text-neutral-300">
                Monitor every aspect of your application in real-time. Track
                user journeys, capture events, and make data-driven decisions
                with our comprehensive analytics platform.
              </p>
            </BlurFade>

            <BlurFade delay={0.4}>
              <div className="items-center justify-center space-x-3 space-y-3 sm:flex sm:space-y-0">
                <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93C5FD_0%,#1D4ED8_50%,#93C5FD_100%)]" />
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 text-xs font-medium text-neutral-50 backdrop-blur-3xl">
                    <Link
                      href="/dashboard"
                      className="relative inline-flex rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-neutral-300/5 via-blue-400/20 to-transparent text-white hover:bg-transparent/90 transition-colors sm:w-auto py-3 px-10 md:text-base"
                    >
                      Get Started
                    </Link>
                  </div>
                </span>
                <span className="relative inline-block overflow-hidden rounded-full p-[0.75px]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93C5FD_0%,#1D4ED8_50%,#93C5FD_100%)]" />
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 text-xs font-medium text-neutral-50 backdrop-blur-3xl">
                    <Link
                      href="https://github.com/ArjunCodess/analyzr#readme"
                      className="inline-flex rounded-full text-center items-center justify-center bg-neutral-900 text-neutral-300 border-neutral-800 border hover:bg-neutral-900/80 transition-colors py-3 px-10 md:text-base"
                    >
                      Open Documentation
                    </Link>
                  </div>
                </span>
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.5} yOffset={20}>
            <div className="mt-20 mx-10">
              <Safari url="https://getanalyzr.vercel.app">
                <Image
                  alt="Hero Image"
                  src="/hero.png"
                  width={2000}
                  height={1000}
                />
              </Safari>
            </div>
          </BlurFade>
        </div>
      </section>

      <BlurFade delay={0.7}>
        <section className="py-14 md:py-20 relative">
          <div className="max-w-screen-xl mx-auto px-4 text-gray-400 md:px-8">
            <div className="relative max-w-2xl mx-auto sm:text-center">
              <div className="relative">
                <h3 className="text-gray-200 text-3xl font-normal tracking-tighter md:text-5xl sm:text-4xl">
                  Built for modern applications
                </h3>
                <p className="mt-3 text-gray-200">
                  Powerful event tracking and analytics that scales with your
                  application. Deploy in minutes and start monitoring your key
                  metrics instantly.
                </p>
              </div>
              <div
                className="absolute inset-0 max-w-xs mx-auto h-44 blur-[118px]"
                style={{
                  background:
                    "linear-gradient(152.92deg, rgba(37, 99, 235, 0.2) 4.54%, rgba(59, 130, 246, 0.26) 34.2%, rgba(37, 99, 235, 0.1) 77.55%)",
                }}
              ></div>
            </div>
            <div className="relative mt-12">
              <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 max-w-6xl mx-auto">
                {FEATURES.map((item, idx) => (
                  <BlurFade
                    key={idx}
                    delay={0.8 + idx * 0.1}
                    className="h-full"
                  >
                    <li className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 space-y-4 h-full flex flex-col">
                      <div className="bg-[#1A1A1A] rounded-xl p-3 w-fit">
                        {item.icon}
                      </div>
                      <h4 className="text-white text-xl font-medium">
                        {item.title}
                      </h4>
                      <p className="text-[#888888] text-sm flex-grow">
                        {item.desc}
                      </p>
                    </li>
                  </BlurFade>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </BlurFade>

      <section className="py-14 relative">
        <BlurFade delay={0.8}>
          <div
            className="absolute inset-0 max-w-xs mx-auto h-44 blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(37, 99, 235, 0.2) 4.54%, rgba(59, 130, 246, 0.26) 34.2%, rgba(37, 99, 235, 0.1) 77.55%)",
            }}
          />
        </BlurFade>

        <div className="px-4 text-gray-400 md:px-8">
          <div className="relative max-w-2xl mx-auto sm:text-center mb-12">
            <BlurFade delay={1}>
              <div className="relative z-10">
                <h3 className="text-gray-200 mt-4 text-3xl font-normal tracking-tighter md:text-5xl sm:text-4xl">
                  Real-time event monitoring
                </h3>
                <p className="mt-3 text-gray-200">
                  Get instant Discord notifications for critical events,
                  conversion milestones, and user activities. Stay on top of
                  your application&apos;s performance 24/7.
                </p>
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={1.2}>
            <div className="h-full max-w-[1200px] mx-auto">
              <div className="rounded-xl bg-[#313338] p-4 ring-1 ring-inset ring-[#2B2D31] lg:rounded-2xl lg:p-6">
                <MockDiscordUI>
                  <AnimatedList delay={800}>
                    <DiscordMessage
                      avatarSrc="/logo.png"
                      avatarAlt="Analyzr Avatar"
                      username="Analyzr"
                      timestamp="Today at 5:20 PM"
                      title="New Event: Production Database Error"
                      description="A critical error has been detected in the production environment that requires immediate attention."
                      emoji="🚨"
                      fields={[
                        {
                          name: "Domain",
                          value: "something.vercel.app",
                          inline: true,
                        },
                        {
                          name: "Error Code",
                          value: "ERR_CONNECTION_LIMIT",
                          inline: true,
                        },
                        {
                          name: "Affected Services",
                          value: "User Authentication, Payment Processing",
                          inline: false,
                        },
                        {
                          name: "Timestamp",
                          value: "2024-03-20 15:30:45 UTC",
                          inline: true,
                        },
                        { name: "Current Load", value: "98%", inline: true },
                      ]}
                    />
                    <DiscordMessage
                      avatarSrc="/logo.png"
                      avatarAlt="Analyzr Avatar"
                      username="Analyzr"
                      timestamp="Today at 5:38 PM"
                      title="New Event: Performance Alert"
                      description="Performance degradation detected in application endpoints. This may affect user experience."
                      emoji="⚠️"
                      fields={[
                        { name: "Domain", value: "nothing.com", inline: true },
                        {
                          name: "Average Response Time",
                          value: "2.5s",
                          inline: true,
                        },
                        {
                          name: "Affected Region",
                          value: "EU WEST",
                          inline: true,
                        },
                        { name: "Impact Level", value: "Medium", inline: true },
                        {
                          name: "Recommended Action",
                          value:
                            "Scale up server instances and investigate potential bottlenecks",
                          inline: false,
                        },
                      ]}
                    />
                  </AnimatedList>
                </MockDiscordUI>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <section className="px-4 py-28 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-left md:text-center tracking-tight font-bold text-transparent bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] lg:leading-[1.15] text-3xl md:text-5xl sm:text-4xl">
              Analytics that work for <br /> you and your team
            </h1>
            <div className="text-[0.84rem] text-zinc-400 text-left md:text-center md:text-lg max-w-2xl md:mx-auto">
              Track user behavior, monitor performance metrics, and receive
              real-time notifications across all your platforms. Get the
              insights you need to optimize your application and drive growth.
            </div>
            <div
              className="absolute inset-0 max-w-xs h-44 blur-[118px] -z-50"
              style={{
                background:
                  "linear-gradient(152.92deg, rgba(37, 99, 235, 0.3) 4.54%, rgba(59, 130, 246, 0.4) 34.2%, rgba(37, 99, 235, 0.2) 77.55%)",
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 md:justify-center">
            <Link href="/dashboard">
              <Button className="border border-neutral-800 hover:bg-neutral-800">
                Get Started
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="px-8 py-16">
          <div className="mx-auto max-w-3xl space-y-12">
            <div className="relative max-w-2xl mx-auto sm:text-center">
              <div className="relative">
                <h3 className="text-gray-200 text-3xl font-normal tracking-tighter md:text-5xl sm:text-4xl">
                  Frequently Asked Questions
                </h3>
                <p className="mt-3 text-gray-200">
                  Get answers to frequently asked questions about our analytics platform. Learn how Analyzr can help you track and understand your website&apos;s performance while keeping your data secure.
                </p>
              </div>
              <div
                className="absolute inset-0 max-w-xs mx-auto h-44 blur-[118px] -z-10"
                style={{
                  background:
                    "linear-gradient(152.92deg, rgba(37, 99, 235, 0.2) 4.54%, rgba(59, 130, 246, 0.26) 34.2%, rgba(37, 99, 235, 0.1) 77.55%)",
                }}
              ></div>
            </div>

            <Accordion type="single" collapsible className="mt-16 space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Is Analyzr really free?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! We&apos;re 100% free and open source. There are no hidden fees or premium features. You can even self-host it if you want.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Will this slow down my website?</AccordionTrigger>
                <AccordionContent>
                  Nope! Our tracking script is tiny (less than 6KB) and loads asynchronously so it won&apos;t block your page. We use edge functions for super-fast response times.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Is my data private and secure?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely! We use Supabase for secure data storage. Your data is never sold or shared, and you can delete it anytime. We don&apos;t track personal user information.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I use this with any website?</AccordionTrigger>
                <AccordionContent>
                  Yes! Analyzr works with Next.js, React, Vue, plain HTML, and more. Our analytics solution is designed to be framework-agnostic.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What&apos;s the difference between Analyzr and other analytics tools?</AccordionTrigger>
                <AccordionContent>
                  Analyzr stands out by offering free custom event tracking (which others charge for), built-in Discord notifications, and a privacy-focused approach. There&apos;s no complex setup needed, and being completely open source means you have full transparency and control.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  );
}
