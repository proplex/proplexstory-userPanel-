"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, CalendarIcon, ChevronDown } from "lucide-react";
import { DayPicker, SelectSingleEventHandler, DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomDatePickerProps {
  onDateSelect: (dates: { from: Date; to?: Date }) => void;
  initialDateRange?: { from: Date; to?: Date };
  className?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onDateSelect,
  initialDateRange,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDates, setSelectedDates] = React.useState<DateRange | undefined>({
    from: initialDateRange?.from,
    to: initialDateRange?.to,
  });
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [quickSelect, setQuickSelect] = React.useState<string>("");

  // Generate years array (last 10 years to next 10 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: 21 }, 
      (_, i) => currentYear - 10 + i
    );
  };

  const handleYearChange = (yearString: string) => {
    const year = parseInt(yearString);
    const newMonth = new Date(
      year, 
      currentMonth.getMonth(), 
      currentMonth.getDate()
    );
    setCurrentMonth(newMonth);
  };

  const handleMonthChange = (monthString: string) => {
    const month = parseInt(monthString);
    const newMonth = new Date(
      currentMonth.getFullYear(), 
      month, 
      currentMonth.getDate()
    );
    setCurrentMonth(newMonth);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const handleQuickSelect = (value: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to start of day
    let newFrom: Date = today;
    const newTo: Date = today;

   

    const newDates = { from: newFrom, to: newTo };
    setSelectedDates(newDates);
    onDateSelect({ from: newFrom, to: newTo });
    setIsOpen(false);
    setQuickSelect(value);
  };

  const handleDayClick = (range: DateRange | undefined) => {
    if (!range) return;

    // Ensure the selected date is not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (range.from && range.from > today) return;
    if (range.to && range.to > today) {
      range.to = today;
    }

    setSelectedDates(range);
    if (range.from) {
      onDateSelect({ from: range.from, to: range.from });
      setIsOpen(true);
    }
    if (range.from && range.to) {
      onDateSelect({ from: range.from, to: range.to });
      setIsOpen(false);
    }
    
    setQuickSelect("");
  };
  
  const footer = (
    <div className="px-4 pb-4 pt-0">
      <div className="text-sm text-center text-muted-foreground">
        {!selectedDates?.from 
          ? "Select start date" 
          : !selectedDates?.to 
            ? "Select end date (optional)" 
            : "Date range selected"}
      </div>
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white border-gray-200",
            !selectedDates?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className=" h-4 w-4 text-gray-500" />
          {selectedDates?.from ? (
            selectedDates?.to ? (
              <>
                {format(selectedDates?.from, "MMM dd, yyyy")} -{" "}
                {format(selectedDates?.to, "MMM dd, yyyy")}
              </>
            ) : (
              format(selectedDates?.from, "MMM dd, yyyy")
            )
          ) : (
            "Select Date Range"
          )}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-0"
        align="start"
        side="bottom"
      >
      
        <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:space-y-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePreviousMonth}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col sm:flex-row items-center space-y-0 sm:space-y-0 sm:space-x-2 w-full sm:w-[200px]">
            <Select 
              value={currentMonth.getMonth().toString()} 
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-full sm:w-[100px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[100px]">
                  {[...Array(12)].map((_, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {format(new Date(currentMonth.getFullYear(), index), 'MMMM')}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <Select 
              value={currentMonth.getFullYear().toString()} 
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-full sm:w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {generateYears().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNextMonth}
            className="w-full sm:w-auto"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <DayPicker
          mode="range"
          selected={selectedDates}
          onSelect={handleDayClick}
          footer={footer} 
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          disabled={{ after: new Date() }}
          className="p-0 w-full"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center hidden",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 text-gray-500 hover:text-gray-900"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] h-9 flex items-center justify-center",
            row: "flex w-full mt-2",
            cell: cn(
              "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
              "h-9 w-9 flex items-center justify-center"
            ),
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100"
            ),

            day_range_start: "bg-[#8968ff] text-white rounded-l-md",
            day_range_end: "bg-[#8968ff] text-white rounded-r-md",
            day_selected: "bg-[#9CA3AF] text-black focus:text-white hover:bg-[#9CA3AF] rounded-md",
            // day_today: "bg-[#8968ff] text-gray-900 rounded-md",

            day_outside: "text-gray-400 bg-[#8968ff] opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "ebg-[#9CA3AF] text-black focus:text-white hover:bg-[#9CA3AF] rounded-md  ",
            day_hidden: "invisible"
          }}
          components={{
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CustomDatePicker;
