import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { BlurFade } from "@/components/ui/blur-fade";
import { features } from "@/lib/constants";
import { MockDiscordUI } from "@/components/mock-discord-ui";
import { AnimatedList } from "@/components/ui/animated-list";
import { DiscordMessage } from "@/components/discord-message";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col divide-y divide-neutral-800">
      <div className="absolute h-screen w-screen bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(37,99,235,0.3),rgba(255,255,255,0))]"></div>

      <section className="relative max-w-full mx-auto md:pb-8">
        <div className="max-w-screen-xl mx-auto px-4 pb-14 pt-20 gap-12 text-neutral-600 md:px-8">
          <div className="space-y-8 max-w-5xl leading-0 lg:leading-5 mx-auto text-center">
            <BlurFade delay={0.1}>
              <span className="text-sm text-neutral-400 group mx-auto px-5 py-2 bg-gradient-to-tr from-neutral-300/5 via-neutral-400/5 to-transparent border-[2px] border-white/5 rounded-3xl w-fit cursor-pointer">
                Event Monitoring & Analytics
                <ChevronDown className="inline w-4 h-4 ml-2 group-hover:translate-y-1 duration-300" />
              </span>
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
                Monitor every aspect of your application in real-time. Track user journeys, capture events, 
                and make data-driven decisions with our comprehensive analytics platform.
              </p>
            </BlurFade>
            

            <BlurFade delay={0.4}>
              <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
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
                      href="/docs"
                      className="inline-flex rounded-full text-center items-center justify-center bg-neutral-900 text-neutral-300 border-neutral-800 border hover:bg-neutral-900/80 transition-colors py-3 px-10 md:text-base"
                    >
                      Open Docs
                    </Link>
                  </div>
                </span>
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.5} yOffset={20}>
            <div className="mt-20 mx-10">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                thumbnailSrc="/hero.png"
                thumbnailAlt="Analytics Dashboard Preview"
                url="analyzr.vercel.app"
              />
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
                  Powerful event tracking and analytics that scales with your application. Deploy in minutes 
                  and start monitoring your key metrics instantly.
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
                {features.map((item, idx) => (
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
                  Get instant Discord notifications for critical events, conversion milestones, and user activities. 
                  Stay on top of your application&apos;s performance 24/7.
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
                      timestamp="Today at 9:15 AM"
                      title="New Event: purchase_completed"
                      content={{
                        "Purchase completed successfully": "",
                        Website: "ecommerce-store.com",
                        Event: "purchase_completed",
                        User: "ID: f82c4a91-3d7e-42b8-9f3d-15e8c736a4b2",
                      }}
                    />
                    <DiscordMessage
                      avatarSrc="/logo.png"
                      avatarAlt="Analyzr Avatar"
                      username="Analyzr"
                      timestamp="Today at 9:12 AM"
                      title="New Event: user_signup"
                      content={{
                        "New user registration": "",
                        Website: "saas-platform.io",
                        Event: "user_signup",
                        User: "ID: 7d9e5b23-8c41-4a18-b6f9-2d3a8f5e9c14",
                      }}
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
            <h1 className="text-left md:text-center tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] leading-tight">
              Powerful analytics for modern applications
            </h1>
            <div className="text-[0.84rem] text-zinc-400 text-left md:text-center md:text-lg max-w-2xl md:mx-auto">
              Track user behavior, monitor performance metrics, and receive real-time notifications across all your platforms. 
              Get the insights you need to optimize your application and drive growth.
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
    </main>
  );
}