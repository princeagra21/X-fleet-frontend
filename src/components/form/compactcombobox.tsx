'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ComboOption = { label: string; value: string };

type CompactComboboxProps = {
  value?: string;
  onChange: (v: string) => void;
  options: ComboOption[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
  buttonClassName?: string;
  inputPlaceholder?: string;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

export default function CompactCombobox({
  value,
  onChange,
  options,
  placeholder = 'Select',
  emptyText = 'No results',
  className,
  buttonClassName,
  inputPlaceholder = 'Search...',
  disabled,
  align = 'start',
  sideOffset = 4,
}: CompactComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between h-9 text-[13px] leading-tight', buttonClassName)}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>

      {/* Use fixed strategy so panels aren't clipped by overflow containers */}
      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        // @ts-ignore Radix supports this prop; shadcn forwards it
        strategy="fixed"
        className={cn(
          'z-50 p-0 w-[--radix-popover-trigger-width] min-w-[220px] rounded-md border bg-white text-gray-900 shadow-md',
          className
        )}
      >
        <Command className="bg-white text-gray-900">
          <CommandInput
            placeholder={inputPlaceholder}
            className="h-9 text-[13px] bg-white text-gray-900 placeholder:text-gray-400"
          />
          <CommandEmpty className="px-3 py-2 text-[12px] text-gray-500">
            {emptyText}
          </CommandEmpty>

          <CommandGroup className="max-h-[220px] overflow-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <CommandItem
                  key={opt.value}
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-1.5 text-[13px] cursor-pointer',
                    'hover:bg-gray-100',
                    isSelected && 'bg-gray-100'
                  )}
                >
                  {opt.label}
                  {isSelected && <Check className="h-4 w-4 opacity-70" />}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
