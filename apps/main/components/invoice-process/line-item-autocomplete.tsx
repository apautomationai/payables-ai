"use client";

import React, { useState, useMemo } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@workspace/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import type { QuickBooksAccount, QuickBooksItem } from "@/lib/services/quickbooks.service";

interface AutocompleteProps<T extends QuickBooksAccount | QuickBooksItem> {
  items: T[];
  value: string | null;
  onSelect: (id: string, item: T) => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  getDisplayName: (item: T) => string;
}

export function LineItemAutocomplete<T extends QuickBooksAccount | QuickBooksItem>({
  items,
  value,
  onSelect,
  placeholder = "Search...",
  isLoading = false,
  disabled = false,
  getDisplayName,
}: AutocompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedItem = useMemo(() => {
    if (!value) return null;
    return items.find((item) => item.Id === value) || null;
  }, [items, value]);

  const filteredItems = useMemo(() => {
    if (!searchValue.trim()) {
      return items;
    }
    const searchTerms = searchValue.toLowerCase().trim().split(/\s+/);
    return items.filter((item) => {
      const displayName = getDisplayName(item).toLowerCase();
      // Check if all search terms are found in the display name (anywhere, not necessarily together)
      return searchTerms.every(term => displayName.includes(term));
    });
  }, [items, searchValue, getDisplayName]);

  const handleSelect = (item: T) => {
    console.log("handleSelect called with:", item);
    onSelect(item.Id, item);
    // Use setTimeout to ensure the callback completes before closing
    setTimeout(() => {
      setOpen(false);
      setSearchValue("");
    }, 0);
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if we're not in the middle of a selection
    if (!newOpen) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  console.log("filteredItems", filteredItems[0]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9"
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-muted-foreground">Loading...</span>
            </>
          ) : selectedItem ? (
            <span className="truncate">{getDisplayName(selectedItem)}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // @ts-ignore
                if (filteredItems[0]) {
                  handleSelect(filteredItems[0]);
                }
              }
            }}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No results found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.Id}
                  value={getDisplayName(item)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.Id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{getDisplayName(item) + ' - ' + item.Id}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

