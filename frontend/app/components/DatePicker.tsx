"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DatePickerWithRange({
  date,
  onDateChange,
  className,
}: DatePickerWithRangeProps) {
  const clearDates = () => onDateChange(undefined);

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 rounded-full px-4 py-2 bg-[#0C0C0C] text-gray-200 hover:bg-[#481E14] transition">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            {date?.from ? (
              <span className="flex items-center gap-2 bg-[#9B3922] text-white px-3 py-1 rounded-full text-sm">
                {date.to ? (
                  <>
                    {format(date.from, "MMM dd")} →{" "}
                    {format(date.to, "MMM dd, y")}
                  </>
                ) : (
                  format(date.from, "MMM dd, y")
                )}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-[#F2613F]"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDates();
                  }}
                />
              </span>
            ) : (
              <span className="text-sm text-gray-400">Select range</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-4 w-auto rounded-xl border border-[#481E14] bg-[#0C0C0C] text-gray-200 shadow-lg"
          align="start"
        >
          <div className="space-y-3">
            <div className="text-sm font-semibold text-[#F2613F]">
              Choose a date range
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={2}
              className="rounded-lg border border-[#9B3922] bg-[#1a1a1a] text-gray-100"
            />
            {date?.from && (
              <button
                onClick={clearDates}
                className="text-xs text-[#F2613F] hover:underline self-end"
              >
                Clear selection
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
