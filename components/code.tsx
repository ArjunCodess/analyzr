import { Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function Code({ language }: { language: string }) {
  const { toast } = useToast();
  
  const javascriptCode = `const axios = require('axios');
  
const API_KEY = "YOUR_API_KEY";
const url = "https://getanalyzr.vercel.app/api/events";
const headers = {
    "Content-Type": "application/json",
    "Authorization": \`Bearer \${API_KEY}\`
};
  
const eventData = {
    name: "",        // required - event name
    domain: "",      // required - your website domain
    description: "", // required - event description
    emoji: "🔔",    // optional - emoji for Discord notification
    fields: [       // optional - additional fields for Discord notification
      {
        name: "Field Name",
        value: "Field Value",
        inline: true // optional - display fields in same line
      }
    ]
};
  
const sendRequest = async () => {
    try {
      const response = await axios.post(url, eventData, { headers });
      console.log("Event sent successfully", response.data);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
};
  
sendRequest();`;

  const pythonCode = `import requests
  
API_KEY = "YOUR_API_KEY"
url = "https://getanalyzr.vercel.app/api/events"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}
  
event_data = {
    "name": "",        # required - event name
    "domain": "",      # required - your website domain
    "description": "", # required - event description
    "emoji": "🔔",    # optional - emoji for Discord notification
    "fields": [       # optional - additional fields for Discord notification
      {
        "name": "Field Name",
        "value": "Field Value",
        "inline": True # optional - display fields in same line
      }
    ]
}
  
def send_request():
    try:
        response = requests.post(url, json=event_data, headers=headers)
        response.raise_for_status()
        print("Event sent successfully", response.json())
    except requests.exceptions.RequestException as error:
        print("Error:", error)
  
send_request()`;

  const copyCode = () => {
    navigator.clipboard.writeText(language === "javascript" ? javascriptCode : pythonCode);
    toast({
      title: "Code Copied",
      description: "Code snippet has been copied to clipboard",
      duration: 3000,
    });
  };

  return (
    <div className="w-full overflow-hidden rounded-md bg-neutral-950 border border-neutral-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Code2 className="h-5 w-5 text-neutral-400" />
          <span className="text-base font-medium text-neutral-300">
            Example Code
          </span>
        </div>
        <Button
          onClick={copyCode}
          variant="ghost"
          size="sm"
          className="text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 border border-neutral-700"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>
      <SyntaxHighlighter
        language={language === "javascript" ? "javascript" : "python"}
        style={oneDark}
        customStyle={{
          padding: '1rem',
          borderRadius: '0.375rem',
          border: '1px solid rgb(38, 38, 38)',
        }}
      >
        {language === "javascript" ? javascriptCode : pythonCode}
      </SyntaxHighlighter>
    </div>
  );
}