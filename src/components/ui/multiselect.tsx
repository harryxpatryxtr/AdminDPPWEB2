"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

export interface MultiselectOption {
  value: string;
  label: string;
}

interface MultiselectProps {
  options: MultiselectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Multiselect({
  options,
  value,
  onChange,
  placeholder = "Selecciona opciones",
  disabled = false,
  className
}: MultiselectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOptions = options.filter(option => value.includes(option.value))

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter(v => v !== optionValue))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between min-h-9 h-auto",
            !value.length && "text-muted-foreground",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-xs"
                >
                  {option.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => handleRemove(option.value, e)}
                  />
                </span>
              ))
            )}
          </div>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No hay opciones disponibles
            </div>
          ) : (
            <div className="p-1">
              {options.map((option) => {
                const isSelected = value.includes(option.value)
                return (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                    onClick={() => handleToggle(option.value)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(option.value)}
                    />
                    <label className="flex-1 cursor-pointer text-sm">
                      {option.label}
                    </label>
                    {isSelected && (
                      <CheckIcon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

