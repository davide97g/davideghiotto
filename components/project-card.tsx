"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  githubUrl: string
  demoUrl: string
  index: number
}

export default function ProjectCard({ title, description, image, tags, githubUrl, demoUrl, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardHeader>
          <h3 className="text-xl font-bold">{title}</h3>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 size-4" />
              Code
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 size-4" />
              Demo
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

