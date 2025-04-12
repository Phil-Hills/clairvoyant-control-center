"use client"

import { useState } from "react"
import { Check, ChevronDown, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// In a real app, you would fetch these from an API
const mockProjects = [
  { id: process.env.PROJECT_ID || "clairvoyant-project", name: "Clairvoyant Project", isActive: true },
  { id: "demo-project-1", name: "Demo Project 1", isActive: false },
  { id: "demo-project-2", name: "Demo Project 2", isActive: false },
]

export function ProjectSelector() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0])

  const handleSelectProject = (project: (typeof mockProjects)[0]) => {
    setSelectedProject(project)
    // In a real app, you would update the context or make an API call to switch projects
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 h-8 px-2 sm:px-3">
          <Cloud className="h-4 w-4" />
          <span className="hidden sm:inline-block max-w-[100px] truncate">{selectedProject.name}</span>
          <Badge variant="outline" className="h-5 px-1 text-xs hidden sm:flex">
            {selectedProject.id.substring(0, 8)}
          </Badge>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>GCP Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {mockProjects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleSelectProject(project)}
            >
              <div className="flex flex-col">
                <span>{project.name}</span>
                <span className="text-xs text-muted-foreground">{project.id}</span>
              </div>
              {selectedProject.id === project.id && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <span>Manage Projects</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
