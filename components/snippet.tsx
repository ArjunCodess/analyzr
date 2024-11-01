"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Snippet() {
  const { website } = useParams();
  const { toast } = useToast();

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

  const copySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    toast({
      title: "Snippet Copied",
      description: "Installation snippet has been copied to clipboard",
      duration: 3000,
    });
  };

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
            <div className="rounded-lg bg-neutral-950 border border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-neutral-400">
                  Add to your index.html:
                </p>
                <Button
                  onClick={() => copySnippet(react_snippet)}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-neutral-100"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <SyntaxHighlighter
                language="html"
                style={oneDark}
                customStyle={{
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgb(38, 38, 38)',
                }}
              >
                {react_snippet}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
          <TabsContent value="Next.js" className="mt-4">
            <div className="rounded-lg bg-neutral-950 border border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-neutral-400">
                  Add to your app/layout.tsx:
                </p>
                <Button
                  onClick={() => copySnippet(next_snippet)}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-neutral-100"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <SyntaxHighlighter
                language="jsx"
                style={oneDark}
                customStyle={{
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgb(38, 38, 38)',
                }}
              >
                {next_snippet}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}