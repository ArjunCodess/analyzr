import React from "react";

interface SafariProps {
  url?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Safari({ url = "", className, children }: SafariProps) {
  return (
    <div className={className}>
      {/* Browser Chrome/Header */}
      <div className="bg-[#404040] rounded-t-lg">
        <div className="bg-[#262626] rounded-t-lg">
          <div className="flex items-center px-2 py-2">
            {/* Traffic lights */}
            <div className="flex gap-1.5 absolute">
              <div className="w-2.5 h-2.5 rounded-full bg-[#404040]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#404040]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#404040]" />
            </div>
            
            {/* URL Bar */}
            <div className="flex-1 flex justify-center">
              <div className="bg-[#404040] rounded-full px-3 py-0.5 flex items-center gap-1.5 text-[#A3A3A3] text-[11px] min-w-[140px]">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
                </svg>
                <span className="flex-1 text-center">{url}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="bg-[#404040] p-[1px] rounded-b-lg">
        <div className="bg-[#262626] rounded-b-lg overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
