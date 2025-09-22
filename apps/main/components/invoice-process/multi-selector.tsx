"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { Command as CommandPrimitive } from "cmdk";

type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSelect = (value: string) => {
    onChange((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleRemove = (value: string) => {
    onChange((prev) => prev.filter((v) => v !== value));
  };

  return (
    <Command
      onKeyDown={(e) => {
        if (e.key === "Escape") inputRef.current?.blur();
      }}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <Badge key={value} variant="secondary">
                {option?.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => handleRemove(value)}
                  aria-label={`Remove ${option?.label}`}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select fields..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (
          <CommandList className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </div>
    </Command>
  );
}
