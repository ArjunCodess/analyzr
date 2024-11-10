import { Clock } from "lucide-react";
import Image from "next/image";

interface DiscordField {
  name: string;
  value: string;
  inline: boolean;
}

interface DiscordMessageProps {
  avatarSrc: string;
  avatarAlt: string;
  username: string;
  timestamp: string;
  title: string;
  description?: string;
  fields: DiscordField[];
  emoji: string;
}

export const DiscordMessage = ({
  avatarAlt,
  avatarSrc,
  fields,
  timestamp,
  title,
  description,
  username,
  emoji,
}: DiscordMessageProps) => {
  return (
    <div className="w-full flex items-start justify-start">
      <div className="flex items-center mb-2">
        <Image
          src={avatarSrc}
          alt={avatarAlt}
          width={32}
          height={32}
          className="object-cover rounded-full mr-3 size-8 lg:size-10"
        />
      </div>

      <div className="w-full max-w-xl">
        <div className="flex items-center">
          <p className="font-normal lg:font-semibold text-sm lg:text-base text-white">
            {username}
          </p>
          <span className="ml-1.5 lg:ml-2 px-1 lg:px-1.5 py-0.5 text-[10px] lg:text-xs font-normal lg:font-semibold bg-brand-600 text-white rounded bg-blue-600">
            APP
          </span>
          <span className="text-gray-400 ml-1 lg:ml-1.5 text-[10px] lg:text-xs font-normal">
            {timestamp}
          </span>
        </div>

        <div className="bg-[#2f3136] w-full rounded p-2 lg:p-3 mb-3 lg:mb-4 mt-1 lg:mt-1.5">
          <div className="flex flex-row items-center justify-between mb-1.5 lg:mb-2">
            <p className="text-white order-1 text-sm lg:text-base font-normal lg:font-semibold leading-5 lg:leading-7">
              {emoji} {title}
            </p>
          </div>

          {description && (
            <p className="text-[#dcddde] text-xs lg:text-sm leading-5 lg:leading-6 mb-2">
              {description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {fields.map((field, index) => (
              <div
                key={index}
                className={field.inline ? "col-span-1" : "col-span-2"}
              >
                <p className="text-[#dcddde] text-xs lg:text-sm leading-5 lg:leading-6">
                  <span className="text-[#b9bbbe] font-bold">
                    {field.name}
                    {field.value ? ":" : ""}
                  </span>{" "}
                  {field.value}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[#72767d] text-[10px] lg:text-xs mt-1.5 lg:mt-2 flex items-center">
            <Clock className="size-2.5 lg:size-3 mr-1 stroke-[1.5]" />
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};
