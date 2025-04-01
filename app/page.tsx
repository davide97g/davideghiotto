"use client";

import ProjectCard from "@/components/project-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function Home() {
  const handleContactClick = (type: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${type} copied to clipboard!`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Davide Ghiotto</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#projects"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Projects
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" asChild>
              <Link
                href="https://github.com/davideghiotto"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link
                href="https://linkedin.com/in/davideghiotto"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="size-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Hi, I&apos;m Davide Ghiotto
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A passionate developer crafting beautiful digital experiences
                  with modern web technologies.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild>
                  <Link href="#projects">
                    View My Work <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#contact">Contact Me</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative size-80 overflow-hidden rounded-full border-4 border-primary">
                <Image
                  src="/placeholder.svg?height=320&width=320"
                  alt="Davide Ghiotto"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="bg-muted py-16 md:py-24">
          <div className="container">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Projects
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Check out some of my recent work
              </p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <ProjectCard
                title="E-Commerce Platform"
                description="A full-featured online store built with Next.js and Stripe integration."
                image="/placeholder.svg?height=400&width=600"
                tags={["Next.js", "TypeScript", "Stripe", "Tailwind CSS"]}
                githubUrl="https://github.com/davideghiotto/ecommerce"
                demoUrl="https://ecommerce-demo.com"
                index={0}
              />
              <ProjectCard
                title="Task Management App"
                description="A productivity tool for organizing tasks with drag-and-drop functionality."
                image="/placeholder.svg?height=400&width=600"
                tags={["React", "TypeScript", "Firebase", "Framer Motion"]}
                githubUrl="https://github.com/davideghiotto/task-manager"
                demoUrl="https://task-manager-demo.com"
                index={1}
              />
              <ProjectCard
                title="Portfolio Website"
                description="A personal portfolio website showcasing projects and skills."
                image="/placeholder.svg?height=400&width=600"
                tags={[
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "Framer Motion",
                ]}
                githubUrl="https://github.com/davideghiotto/portfolio"
                demoUrl="https://portfolio-demo.com"
                index={2}
              />
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link
                  href="https://github.com/davideghiotto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View More on GitHub <Github className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24">
          <div className="container">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Me
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Get to know more about my skills and experience
              </p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold">My Journey</h3>
                <p className="text-muted-foreground">
                  I&apos;m a passionate web developer with a focus on creating
                  modern, responsive, and user-friendly applications. With
                  several years of experience in the industry, I&apos;ve worked
                  on a variety of projects ranging from small business websites
                  to complex web applications.
                </p>
                <p className="text-muted-foreground">
                  My approach to development is centered around creating clean,
                  maintainable code that delivers exceptional user experiences.
                  I&apos;m constantly learning and exploring new technologies to
                  stay at the forefront of web development.
                </p>
              </motion.div>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold">Skills & Technologies</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Frontend</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>React & Next.js</li>
                      <li>TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>Framer Motion</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Backend</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Node.js</li>
                      <li>Express</li>
                      <li>MongoDB</li>
                      <li>PostgreSQL</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Tools</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Git & GitHub</li>
                      <li>VS Code</li>
                      <li>Figma</li>
                      <li>Docker</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Other</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Responsive Design</li>
                      <li>SEO Optimization</li>
                      <li>Performance Tuning</li>
                      <li>Accessibility</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-muted py-16 md:py-24">
          <div className="container">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Get In Touch
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Have a project in mind or just want to say hello? Feel free to
                reach out!
              </p>
            </motion.div>
            <motion.div
              className="max-w-2xl mx-auto space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold">Contact Information</h3>
              <div className="space-y-4">
                <div
                  className="flex items-center space-x-3 p-3 rounded-md hover:bg-background/50 cursor-pointer transition-colors"
                  onClick={() =>
                    handleContactClick("Email", "hello@davideghiotto.com")
                  }
                >
                  <Mail className="size-5 text-primary" />
                  <span>hello@davideghiotto.com</span>
                </div>
                <div
                  className="flex items-center space-x-3 p-3 rounded-md hover:bg-background/50 cursor-pointer transition-colors"
                  onClick={() =>
                    handleContactClick("Twitter handle", "@davideghiotto")
                  }
                >
                  <Twitter className="size-5 text-primary" />
                  <span>@davideghiotto</span>
                </div>
                <div
                  className="flex items-center space-x-3 p-3 rounded-md hover:bg-background/50 cursor-pointer transition-colors"
                  onClick={() =>
                    handleContactClick(
                      "LinkedIn profile",
                      "linkedin.com/in/davideghiotto"
                    )
                  }
                >
                  <Linkedin className="size-5 text-primary" />
                  <span>linkedin.com/in/davideghiotto</span>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Connect with me</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link
                      href="https://github.com/davideghiotto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="size-4" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link
                      href="https://linkedin.com/in/davideghiotto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="size-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link
                      href="https://twitter.com/davideghiotto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="size-4" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="mailto:hello@davideghiotto.com">
                      <Mail className="size-4" />
                      <span className="sr-only">Email</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Davide Ghiotto. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
