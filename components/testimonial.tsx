import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "./ui/button"
import Link from "next/link"

interface TestimonialCardProps {
  name: string
  role: string
  testimonial: string
  avatarSrc: string
}

const Testimonial: React.FC<TestimonialCardProps> = ({
  name,
  role,
  testimonial,
  avatarSrc,
}) => {
  return (
    <Card className="bg-[#15202b] hover:bg-[#1e2732] transition-colors duration-200 border border-[#425364] max-w-[550px] my-[1.5rem] rounded-[12px]">
      <CardContent className="p-3.5">
        <div className="flex items-center mb-4 space-x-4">
          <Avatar className="w-12 h-12 border-primary border-0">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-[#e7e9ea]">{name}</h3>
            <p className="text-sm text-[#71767b]">
              {role}
            </p>
          </div>
        </div>
        <blockquote className="text-[#e7e9ea] text-[1.1rem]">
          {testimonial}
        </blockquote>
        <Link href="https://www.producthunt.com/posts/getanalyzr"><Button className="h-8 mt-5 w-full font-bold text-[#6bc9fb] bg-transparent border border-[#425364] rounded-full hover:bg-[#28394d]">Read more on Product Hunt</Button></Link>
      </CardContent>
    </Card>
  )
}

export default Testimonial