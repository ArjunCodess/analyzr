"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";

export default function Snippet() {
  const { website } = useParams();

  const react_snippet = `<script
  defer
  data-domain="${website}"
  src="https://getanalyzr.vercel.app/tracking-script.js"
>
</script>`;
  const next_snippet = `<Script
  defer
  data-domain="${website}"
  src="https://getanalyzr.vercel.app/tracking-script.js"
/>`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Installation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="JavaScript/React.js" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-neutral-800">
            <TabsTrigger value="JavaScript/React.js">JavaScript / React.js</TabsTrigger>
            <TabsTrigger value="Next.js">Next.js</TabsTrigger>
          </TabsList>
          <TabsContent value="JavaScript/React.js" className="mt-4">
            <div className="rounded-lg bg-neutral-50 border p-4">
              <p className="mb-2 text-sm text-neutral-600">
                Add to your index.html:
              </p>
              <pre className="overflow-x-auto rounded bg-neutral-950 p-4 font-mono text-sm text-neutral-200">
                {react_snippet}
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="Next.js" className="mt-4">
            <div className="rounded-lg bg-neutral-50 border p-4">
              <p className="mb-2 text-sm text-neutral-600">
                Add to your app/layout.tsx:
              </p>
              <pre className="overflow-x-auto rounded bg-neutral-950 p-4 font-mono text-sm text-neutral-200">
                {next_snippet}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}