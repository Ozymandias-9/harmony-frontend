"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Icon } from "@iconify/react";

export function Combobox({
  button = false,
  className,
  options,
  value,
  onChange,
  subject,
  create,
  remove = false,
}: {
  button?: boolean,
  className?: string,
  options: { value: string; label: string }[];
  value: any;
  onChange: (value: string) => void;
  create?: (x?: any) => any,
  subject: string,
  remove?: boolean,
}) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((o) => o.value === value) || null;

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {
          button ? <Button variant="outline" className={className ?? 'w-[150px] justify-start'}>
            {selectedOption ? <>{selectedOption.label}</> : <>+ { subject.replace(/\b\w/g, char => char.toUpperCase()) }</>}
          </Button> : <span className={className ?? 'w-[150px] justify-start'}>
            {selectedOption ? <>{selectedOption.label}</> : <>+ { subject.replace(/\b\w/g, char => char.toUpperCase()) }</>}
          </span>
        }
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandInput placeholder={`Change ${ subject }...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {
                create ? <CommandItem
                  onSelect={async () => {
                    onChange(await create());
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2 text-muted-foreground"><Icon icon="lucide:plus"/> Create new {subject}</span>
                </CommandItem> : null
              }
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
