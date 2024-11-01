"use client";

import { CustomEvent } from "@/types";
import { formatTimeStamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SiteCustomEventsProps {
  customEvents: CustomEvent[];
  groupedCustomEvents: Record<string, number>;
  activeCustomEventTab: string;
  setActiveCustomEventTab: (tab: string) => void;
}

export default function SiteCustomEvents({
  customEvents,
  groupedCustomEvents,
  activeCustomEventTab,
  setActiveCustomEventTab,
}: SiteCustomEventsProps) {
  if (Object.keys(groupedCustomEvents).length === 0) {
    return (
      <Card className="border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <p className="text-neutral-100">No custom events recorded yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Carousel className="w-full">
        <CarouselContent>
          {Object.entries(groupedCustomEvents).map(([eventName, count]) => (
            <CarouselItem
              key={eventName}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card
                className={`cursor-pointer border-neutral-800 bg-neutral-950/20 backdrop-blur-sm transition-all hover:bg-neutral-900 hover:shadow-lg ${
                  activeCustomEventTab === eventName
                    ? "border-neutral-600 shadow-lg"
                    : ""
                }`}
                onClick={() => setActiveCustomEventTab(eventName)}
              >
                <CardHeader>
                  <CardTitle className="text-neutral-300 text-sm md:text-base">
                    {eventName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base lg:text-lg font-bold tracking-tight text-white">
                    {count}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="border-neutral-800 bg-neutral-950/20 text-white hover:bg-neutral-900" />
        <CarouselNext className="border-neutral-800 bg-neutral-900/20 text-white hover:bg-neutral-900" />
      </Carousel>

      <Card className="mt-8 border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-neutral-300 text-sm md:text-base">Event Details</CardTitle>
          {activeCustomEventTab && (
            <Button
              onClick={() => setActiveCustomEventTab("")}
              variant="outline"
              className="border-neutral-800 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 hover:text-white"
            >
              Show All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {customEvents
              .filter((event) =>
                activeCustomEventTab
                  ? event.event_name === activeCustomEventTab
                  : true
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="border my-2 border-neutral-800 py-4 transition-colors hover:bg-neutral-900/20"
                >
                  <p className="mb-2 text-xs md:text-sm font-medium text-neutral-100">
                    {event.event_name}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-100">{event.message}</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    {formatTimeStamp(event.timestamp)}
                  </p>
                </div>
              ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
