"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, BarChart2, Users, Globe } from "lucide-react";
import Link from "next/link";
import AddWebsite from "@/components/add-website";

const websites = [
  {
    id: 1,
    name: "landinga2i.co",
    visitors: 1234,
    pageviews: 5678,
    bounceRate: 45.6,
  },
  {
    id: 2,
    name: "webdevprep.com",
    visitors: 2345,
    pageviews: 7890,
    bounceRate: 38.2,
  },
  {
    id: 3,
    name: "landingai.co",
    visitors: 3456,
    pageviews: 9012,
    bounceRate: 42.8,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-900/10 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end items-center mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" /> Add Website
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 p-4">
              <DialogTitle className="sr-only">Add Website</DialogTitle>
              <AddWebsite />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <Link key={website.id} href={"/site/" + website.name}>
              <Card className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700 transition-colors duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {website.name}
                  </CardTitle>
                  <Globe className="h-4 w-4 text-neutral-400" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-2xl font-bold">
                        {website.visitors.toLocaleString()}
                      </span>
                      <span className="text-xs text-neutral-400 flex items-center">
                        <Users className="mr-1 h-3 w-3" /> Visitors
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-2xl font-bold">
                        {website.pageviews.toLocaleString()}
                      </span>
                      <span className="text-xs text-neutral-400 flex items-center">
                        <BarChart2 className="mr-1 h-3 w-3" /> Page Views
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Bounce Rate</span>
                      <span className="text-sm font-bold">
                        {website.bounceRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-50 rounded-full"
                        style={{ width: `${website.bounceRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
