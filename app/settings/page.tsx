"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Copy, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUser from "@/hooks/useUser";
import { supabase } from "@/config/supabase";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/loading";
import { UserData } from "@/types";
import Code from "@/components/code";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Current user:", user);
    console.log("Current apiKey:", apiKey);
    console.log("Loading state:", loading);
  }, [user, apiKey, loading]);

  const generateApiKey = async () => {
    setLoading(true);
    if (loading || !user) return;

    const randomString =
      Math.random().toString(36).substring(2, 300) +
      Math.random().toString(36).substring(2, 300);

    const { data, error } = await supabase
      .from("users")
      .insert([{ api: randomString, user_id: user.id }])
      .select()
      .returns<UserData[]>();

    if (error) console.log(error);
    if (data && data[0]) setApiKey(data[0].api);
    setLoading(false);
  };

  const getUserAPIs = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .returns<UserData[]>();

    if (userError) {
      toast({
        title: "Error fetching API key",
        description: userError.message,
        variant: "destructive",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    if (userData && userData.length > 0) {
      if (userData[0].api) {
        setApiKey(userData[0].api);
      } else {
        console.log("No API key found in user data:", userData[0]);
      }
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    if (!supabase || !user) return;
    getUserAPIs();
  }, [user, getUserAPIs]);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied",
      description: "Your API key has been copied to the clipboard.",
      duration: 3000,
    });
  };

  if (!user) return <Loading text="Redirecting..." />;

  if (loading) return <Loading text="Loading your API settings..." />;

  return (
    <div className="flex min-h-[90vh] w-full flex-col items-center justify-center px-4 py-8 bg-black text-white">
      <Card className="w-full max-w-3xl border-neutral-800 bg-neutral-900 shadow-2xl">
        <CardHeader className="border-b border-neutral-800 pb-7">
          <CardTitle className="text-2xl font-bold text-neutral-100">
            API Settings
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Manage your API key and view usage instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!apiKey ? (
            <Button
              onClick={generateApiKey}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
            >
              <Key className="mr-2 h-5 w-5" /> Generate API Key
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="api-key"
                  className="text-sm font-medium text-neutral-300"
                >
                  Your API Key:
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="api-key"
                    type="text"
                    value={apiKey}
                    readOnly
                    className="bg-neutral-800 text-neutral-200 border-neutral-700 focus:border-neutral-600"
                  />
                  <Button
                    onClick={copyApiKey}
                    size="icon"
                    variant="outline"
                    className="bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t border-neutral-800 pt-6">
          <h2 className="mb-4 text-xl font-semibold text-neutral-100">
            Usage Instructions
          </h2>
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
              <TabsTrigger
                value="javascript"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
              >
                JavaScript
              </TabsTrigger>
              <TabsTrigger
                value="python"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
              >
                Python
              </TabsTrigger>
            </TabsList>
            <TabsContent value="javascript">
              <Code language="javascript" />
            </TabsContent>
            <TabsContent value="python">
              <Code language="python" />
            </TabsContent>
          </Tabs>
        </CardFooter>
      </Card>
    </div>
  );
}
