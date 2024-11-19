"use client"

import { cn } from "@/lib/utils"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Copy } from "lucide-react"

interface CodeBlockProps {
  setupFiles: {
    name: string
    code: string
    language: string
    filename?: string
  }[]
  eventFiles: {
    name: string
    code: string
    language: string
    filename?: string
  }[]
  showLineNumbers?: boolean
  className?: string
}

export default function CodeBlock({
  setupFiles,
  eventFiles,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [activeSetupFile, setActiveSetupFile] = useState(0)
  const [activeEventFile, setActiveEventFile] = useState(0)
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
      duration: 2000,
    })
  }

  const customStyle = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: "transparent",
      margin: 0,
      padding: 0,
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: "transparent",
    },
    keyword: { color: "#EC4899" },
    property: { color: "#93C5FD" },
    string: { color: "#93C5FD" },
    number: { color: "#e5e7eb" },
    punctuation: { color: "#9CA3AF" },
    function: { color: "#93C5FD" },
  }

  return (
    <div className={cn("flex flex-col space-y-5", className)}>
      {/* Setup Column */}
      <div className="rounded-xl overflow-hidden bg-[#0B1120] backdrop-blur-xl border border-neutral-800/50 shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 bg-[#0B1120]/80 border-b border-neutral-800">
          <h3 className="text-white font-medium">Setup</h3>
          <div className="flex gap-2">
            {setupFiles.map((file, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveSetupFile(index)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                  index === activeSetupFile
                    ? "bg-blue-900 text-white"
                    : "text-neutral-400 hover:text-neutral-300"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {file.name}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="p-4 font-mono text-sm bg-[#0B1120] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSetupFile}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <SyntaxHighlighter
                language={setupFiles[activeSetupFile].language}
                style={customStyle}
                showLineNumbers={showLineNumbers}
                wrapLines={true}
                lineNumberStyle={{
                  minWidth: "2.5em",
                  paddingRight: "1em",
                  color: "#4B5563",
                  textAlign: "right",
                }}
                customStyle={{
                  margin: 0,
                  background: "transparent",
                  fontSize: "0.875rem",
                  lineHeight: "1.5rem",
                }}
              >
                {setupFiles[activeSetupFile].code}
              </SyntaxHighlighter>
            </motion.div>
          </AnimatePresence>
          <motion.button
            className="absolute top-2 right-2 text-neutral-400 hover:text-white bg-neutral-800/50 rounded-md p-1.5"
            onClick={() => copyToClipboard(setupFiles[activeSetupFile].code)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Events Column */}
      <div className="rounded-xl overflow-hidden bg-[#0B1120] backdrop-blur-xl border border-neutral-800/50 shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 bg-[#0B1120]/80 border-b border-neutral-800">
          <h3 className="text-white font-medium">Events</h3>
          <div className="flex gap-2">
            {eventFiles.map((file, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveEventFile(index)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                  index === activeEventFile
                    ? "bg-blue-900 text-white"
                    : "text-neutral-400 hover:text-neutral-300"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {file.name}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="p-4 font-mono text-sm bg-[#0B1120] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEventFile}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <SyntaxHighlighter
                language={eventFiles[activeEventFile].language}
                style={customStyle}
                showLineNumbers={showLineNumbers}
                wrapLines={true}
                lineNumberStyle={{
                  minWidth: "2.5em",
                  paddingRight: "1em",
                  color: "#4B5563",
                  textAlign: "right",
                }}
                customStyle={{
                  margin: 0,
                  background: "transparent",
                  fontSize: "0.875rem",
                  lineHeight: "1.5rem",
                }}
              >
                {eventFiles[activeEventFile].code}
              </SyntaxHighlighter>
            </motion.div>
          </AnimatePresence>
          <motion.button
            className="absolute top-2 right-2 text-neutral-400 hover:text-white bg-neutral-800/50 rounded-md p-1.5"
            onClick={() => copyToClipboard(eventFiles[activeEventFile].code)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}