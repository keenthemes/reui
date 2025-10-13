'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/default/ui/command';
import { createFilter, Filters, type Filter, type FilterFieldConfig } from '@/registry/default/ui/filters';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { Slider, SliderThumb } from '@/registry/default/ui/slider';
import {
  endOfMonth,
  endOfYear,
  format,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { Calendar as CalendarIcon, Clock, FunnelX, MapPin, Sliders } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

// Type for custom renderer props
type CustomRendererProps = {
  values: unknown[];
  onChange: (values: unknown[]) => void;
};

// Custom Date Range Input Component
function CustomDateRangeInput({ values, onChange }: CustomRendererProps) {
  const [date, setDate] = useState<DateRange | undefined>(
    values?.[0] && typeof values[0] === 'string'
      ? {
          from: new Date(values[0] as string),
          to: values[1] && typeof values[1] === 'string' ? new Date(values[1] as string) : undefined,
        }
      : undefined,
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    if (date?.from) {
      const fromStr = date.from.toISOString().split('T')[0];
      const toStr = date.to ? date.to.toISOString().split('T')[0] : fromStr;
      onChange([fromStr, toStr]);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleSelect = (selected: DateRange | undefined) => {
    setDate(selected);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="cursor-pointer">
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
            </>
          ) : (
            format(date.from, 'LLL dd, y')
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={date?.from}
          showOutsideDays={false}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Custom Date Range with Presets Input Component
function CustomDateRangeWithPresetsInput({ values, onChange }: CustomRendererProps) {
  const today = useMemo(() => new Date(), []);

  const presets = useMemo(
    () => [
      { label: 'Today', range: { from: today, to: today } },
      { label: 'Yesterday', range: { from: subDays(today, 1), to: subDays(today, 1) } },
      { label: 'Last 7 days', range: { from: subDays(today, 6), to: today } },
      { label: 'Last 30 days', range: { from: subDays(today, 29), to: today } },
      { label: 'Month to date', range: { from: startOfMonth(today), to: today } },
      { label: 'Last month', range: { from: startOfMonth(subMonths(today, 1)), to: endOfMonth(subMonths(today, 1)) } },
      { label: 'Year to date', range: { from: startOfYear(today), to: today } },
      { label: 'Last year', range: { from: startOfYear(subYears(today, 1)), to: endOfYear(subYears(today, 1)) } },
    ],
    [today],
  );

  const [month, setMonth] = useState(today);
  const [date, setDate] = useState<DateRange | undefined>(
    values?.[0] && typeof values[0] === 'string'
      ? {
          from: new Date(values[0] as string),
          to: values[1] && typeof values[1] === 'string' ? new Date(values[1] as string) : undefined,
        }
      : undefined,
  );
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const matchedPreset = presets.find(
      (preset) =>
        isEqual(startOfDay(preset.range.from), startOfDay(date?.from || new Date(0))) &&
        isEqual(startOfDay(preset.range.to), startOfDay(date?.to || new Date(0))),
    );
    setSelectedPreset(matchedPreset?.label || null);
  }, [date, presets]);

  const handleApply = () => {
    if (date?.from) {
      const fromStr = date.from.toISOString().split('T')[0];
      const toStr = date.to ? date.to.toISOString().split('T')[0] : fromStr;
      onChange([fromStr, toStr]);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleSelect = (selected: DateRange | undefined) => {
    setDate({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    });
    setSelectedPreset(null);
  };

  const handlePresetSelect = (preset: (typeof presets)[0]) => {
    setDate(preset.range);
    setMonth(preset.range.from || today);
    setSelectedPreset(preset.label);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="cursor-pointer">
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
            </>
          ) : (
            format(date.from, 'LLL dd, y')
          )
        ) : (
          <span>Pick a date range with presets</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center" sideOffset={8}>
        <div className="flex max-sm:flex-col">
          <div className="relative border-border max-sm:order-1 max-sm:border-t sm:w-32">
            <div className="h-full border-border sm:border-e py-2">
              <div className="flex flex-col px-2 gap-[2px]">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    className={cn('h-8 w-full justify-start', selectedPreset === preset.label && 'bg-accent')}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Calendar
            autoFocus
            mode="range"
            month={month}
            onMonthChange={setMonth}
            showOutsideDays={false}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </div>
        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Custom DateTime Input Component
function CustomDateTimeInput({ values, onChange }: CustomRendererProps) {
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(
    values?.[0] && typeof values[0] === 'string' ? new Date(values[0] as string) : undefined,
  );
  const [time, setTime] = useState<string | undefined>(
    values?.[0] && typeof values[0] === 'string' ? new Date(values[0] as string).toTimeString().slice(0, 5) : '10:00',
  );
  const [isOpen, setIsOpen] = useState(false);

  const timeSlots = [
    { time: '09:00', available: false },
    { time: '09:30', available: false },
    { time: '10:00', available: true },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: false },
    { time: '12:30', available: true },
    { time: '13:00', available: true },
    { time: '13:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: false },
    { time: '15:00', available: false },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
    { time: '18:00', available: true },
    { time: '18:30', available: true },
    { time: '19:00', available: true },
    { time: '19:30', available: true },
    { time: '20:00', available: true },
    { time: '20:30', available: true },
    { time: '21:00', available: true },
    { time: '21:30', available: true },
    { time: '22:00', available: true },
    { time: '22:30', available: true },
    { time: '23:00', available: true },
    { time: '23:30', available: true },
  ];

  const handleApply = () => {
    if (date && time) {
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      dateTime.setHours(hours, minutes, 0, 0);
      onChange([dateTime.toISOString()]);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="cursor-pointer">
        {date ? format(date, 'PPP') + (time ? ` - ${time}` : '') : <span>Pick a date and time</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
                setTime(undefined);
              }
            }}
            className="p-2 sm:pe-5"
            disabled={[{ before: today }]}
          />
          <div className="relative w-full max-sm:h-48 sm:w-40">
            <div className="absolute inset-0 py-4 max-sm:border-t">
              <ScrollArea className="h-full sm:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="text-sm font-medium">{date ? format(date, 'EEEE, d') : 'Pick a date'}</p>
                  </div>
                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        key={timeSlot}
                        variant={time === timeSlot ? 'primary' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() => setTime(timeSlot)}
                        disabled={!available}
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Custom Slider Range Input Component
function CustomSliderRangeInput({ values, onChange }: CustomRendererProps) {
  const [range, setRange] = useState<number[]>(
    values?.[0] && typeof values[0] === 'object' && values[0] !== null && 'min' in values[0] && 'max' in values[0]
      ? [(values[0] as { min: number; max: number }).min, (values[0] as { min: number; max: number }).max]
      : [0, 100],
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onChange([{ min: range[0], max: range[1] }]);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="w-20 cursor-pointer text-start">
        <span>
          {range[0]} - {range[1]}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start" sideOffset={8} alignOffset={-8}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Slider value={range} onValueChange={setRange} max={100} min={0} step={1} className="w-[200px]">
              <SliderThumb />
              <SliderThumb />
            </Slider>
            <div className="flex justify-between text-xs text-muted-foreground ps-1.5">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" variant="outline" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Custom Country Input Component
function CustomCountryInput({ values, onChange }: CustomRendererProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(typeof values?.[0] === 'string' ? (values[0] as string) : '');

  const countryFlags = [
    { code: 'AF', name: 'Afghanistan', flag: '/media/flags/afghanistan.svg' },
    { code: 'AL', name: 'Albania', flag: '/media/flags/albania.svg' },
    { code: 'DZ', name: 'Algeria', flag: '/media/flags/algeria.svg' },
    {
      code: 'AS',
      name: 'American Samoa',
      flag: '/media/flags/american-samoa.svg',
    },
    { code: 'AD', name: 'Andorra', flag: '/media/flags/andorra.svg' },
    { code: 'AO', name: 'Angola', flag: '/media/flags/angola.svg' },
    { code: 'AI', name: 'Anguilla', flag: '/media/flags/anguilla.svg' },
    {
      code: 'AG',
      name: 'Antigua and Barbuda',
      flag: '/media/flags/antigua-and-barbuda.svg',
    },
    { code: 'AR', name: 'Argentina', flag: '/media/flags/argentina.svg' },
    { code: 'AM', name: 'Armenia', flag: '/media/flags/armenia.svg' },
    { code: 'AU', name: 'Australia', flag: '/media/flags/australia.svg' },
    { code: 'AT', name: 'Austria', flag: '/media/flags/austria.svg' },
    { code: 'AZ', name: 'Azerbaijan', flag: '/media/flags/azerbaijan.svg' },
    { code: 'BS', name: 'Bahamas', flag: '/media/flags/bahamas.svg' },
    { code: 'BH', name: 'Bahrain', flag: '/media/flags/bahrain.svg' },
    { code: 'BD', name: 'Bangladesh', flag: '/media/flags/bangladesh.svg' },
    { code: 'BB', name: 'Barbados', flag: '/media/flags/barbados.svg' },
    { code: 'BY', name: 'Belarus', flag: '/media/flags/belarus.svg' },
    { code: 'BE', name: 'Belgium', flag: '/media/flags/belgium.svg' },
    { code: 'BZ', name: 'Belize', flag: '/media/flags/belize.svg' },
    { code: 'BJ', name: 'Benin', flag: '/media/flags/benin.svg' },
    { code: 'BM', name: 'Bermuda', flag: '/media/flags/bermuda.svg' },
    { code: 'BT', name: 'Bhutan', flag: '/media/flags/bhutan.svg' },
    { code: 'BO', name: 'Bolivia', flag: '/media/flags/bolivia.svg' },
    {
      code: 'BA',
      name: 'Bosnia and Herzegovina',
      flag: '/media/flags/bosnia-and-herzegovina.svg',
    },
    { code: 'BW', name: 'Botswana', flag: '/media/flags/botswana.svg' },
    { code: 'BR', name: 'Brazil', flag: '/media/flags/brazil.svg' },
    {
      code: 'IO',
      name: 'British Indian Ocean Territory',
      flag: '/media/flags/british-indian-ocean-territory.svg',
    },
    { code: 'BN', name: 'Brunei Darussalam', flag: '/media/flags/brunei.svg' },
    { code: 'BG', name: 'Bulgaria', flag: '/media/flags/bulgaria.svg' },
    { code: 'BF', name: 'Burkina Faso', flag: '/media/flags/burkina-faso.svg' },
    { code: 'BI', name: 'Burundi', flag: '/media/flags/burundi.svg' },
    { code: 'KH', name: 'Cambodia', flag: '/media/flags/cambodia.svg' },
    { code: 'CM', name: 'Cameroon', flag: '/media/flags/cameroon.svg' },
    { code: 'CA', name: 'Canada', flag: '/media/flags/canada.svg' },
    { code: 'CV', name: 'Cape Verde', flag: '/media/flags/cape-verde.svg' },
    {
      code: 'KY',
      name: 'Cayman Islands',
      flag: '/media/flags/cayman-islands.svg',
    },
    {
      code: 'CF',
      name: 'Central African Republic',
      flag: '/media/flags/central-african-republic.svg',
    },
    { code: 'TD', name: 'Chad', flag: '/media/flags/chad.svg' },
    { code: 'CL', name: 'Chile', flag: '/media/flags/chile.svg' },
    { code: 'CN', name: 'China', flag: '/media/flags/china.svg' },
    { code: 'CO', name: 'Colombia', flag: '/media/flags/colombia.svg' },
    { code: 'KM', name: 'Comoros', flag: '/media/flags/comoros.svg' },
    { code: 'CG', name: 'Congo', flag: '/media/flags/congo.svg' },
    { code: 'CR', name: 'Costa Rica', flag: '/media/flags/costa-rica.svg' },
    { code: 'CI', name: "Cote D'Ivoire", flag: '/media/flags/cote-divoire.svg' },
    { code: 'HR', name: 'Croatia', flag: '/media/flags/croatia.svg' },
    { code: 'CU', name: 'Cuba', flag: '/media/flags/cuba.svg' },
    { code: 'CY', name: 'Cyprus', flag: '/media/flags/cyprus.svg' },
    {
      code: 'CZ',
      name: 'Czech Republic',
      flag: '/media/flags/czech-republic.svg',
    },
    { code: 'DK', name: 'Denmark', flag: '/media/flags/denmark.svg' },
    { code: 'DJ', name: 'Djibouti', flag: '/media/flags/djibouti.svg' },
    { code: 'DM', name: 'Dominica', flag: '/media/flags/dominica.svg' },
    {
      code: 'DO',
      name: 'Dominican Republic',
      flag: '/media/flags/dominican-republic.svg',
    },
    { code: 'EC', name: 'Ecuador', flag: '/media/flags/ecuador.svg' },
    { code: 'EG', name: 'Egypt', flag: '/media/flags/egypt.svg' },
    { code: 'SV', name: 'El Salvador', flag: '/media/flags/el-salvador.svg' },
    {
      code: 'GQ',
      name: 'Equatorial Guinea',
      flag: '/media/flags/equatorial-guinea.svg',
    },
    { code: 'ER', name: 'Eritrea', flag: '/media/flags/eritrea.svg' },
    { code: 'EE', name: 'Estonia', flag: '/media/flags/estonia.svg' },
    { code: 'SZ', name: 'Eswatini', flag: '/media/flags/eswatini.svg' },
    { code: 'ET', name: 'Ethiopia', flag: '/media/flags/ethiopia.svg' },
    { code: 'FI', name: 'Finland', flag: '/media/flags/finland.svg' },
    { code: 'FR', name: 'France', flag: '/media/flags/france.svg' },
    { code: 'GA', name: 'Gabon', flag: '/media/flags/gabon.svg' },
    { code: 'GM', name: 'Gambia', flag: '/media/flags/gambia.svg' },
    { code: 'GE', name: 'Georgia', flag: '/media/flags/georgia.svg' },
    { code: 'DE', name: 'Germany', flag: '/media/flags/germany.svg' },
    { code: 'GH', name: 'Ghana', flag: '/media/flags/ghana.svg' },
    { code: 'GR', name: 'Greece', flag: '/media/flags/greece.svg' },
    { code: 'GD', name: 'Grenada', flag: '/media/flags/grenada.svg' },
    { code: 'GT', name: 'Guatemala', flag: '/media/flags/guatemala.svg' },
    { code: 'GN', name: 'Guinea', flag: '/media/flags/guinea.svg' },
    { code: 'GW', name: 'Guinea-Bissau', flag: '/media/flags/guinea-bissau.svg' },
    { code: 'GY', name: 'Guyana', flag: '/media/flags/guyana.svg' },
    { code: 'HT', name: 'Haiti', flag: '/media/flags/haiti.svg' },
    { code: 'HN', name: 'Honduras', flag: '/media/flags/honduras.svg' },
    { code: 'HK', name: 'Hong Kong', flag: '/media/flags/hong-kong.svg' },
    { code: 'HU', name: 'Hungary', flag: '/media/flags/hungary.svg' },
    { code: 'IS', name: 'Iceland', flag: '/media/flags/iceland.svg' },
    { code: 'IN', name: 'India', flag: '/media/flags/india.svg' },
    { code: 'ID', name: 'Indonesia', flag: '/media/flags/indonesia.svg' },
    { code: 'IR', name: 'Iran', flag: '/media/flags/iran.svg' },
    { code: 'IQ', name: 'Iraq', flag: '/media/flags/iraq.svg' },
    { code: 'IE', name: 'Ireland', flag: '/media/flags/ireland.svg' },
    { code: 'IL', name: 'Israel', flag: '/media/flags/israel.svg' },
    { code: 'IT', name: 'Italy', flag: '/media/flags/italy.svg' },
    { code: 'JM', name: 'Jamaica', flag: '/media/flags/jamaica.svg' },
    { code: 'JP', name: 'Japan', flag: '/media/flags/japan.svg' },
    { code: 'JO', name: 'Jordan', flag: '/media/flags/jordan.svg' },
    { code: 'KZ', name: 'Kazakhstan', flag: '/media/flags/kazakhstan.svg' },
    { code: 'KE', name: 'Kenya', flag: '/media/flags/kenya.svg' },
    { code: 'KR', name: 'South Korea', flag: '/media/flags/south-korea.svg' },
    { code: 'KW', name: 'Kuwait', flag: '/media/flags/kuwait.svg' },
    { code: 'KG', name: 'Kyrgyzstan', flag: '/media/flags/kyrgyzstan.svg' },
    { code: 'LA', name: 'Laos', flag: '/media/flags/laos.svg' },
    { code: 'LV', name: 'Latvia', flag: '/media/flags/latvia.svg' },
    { code: 'LB', name: 'Lebanon', flag: '/media/flags/lebanon.svg' },
    { code: 'LS', name: 'Lesotho', flag: '/media/flags/lesotho.svg' },
    { code: 'LR', name: 'Liberia', flag: '/media/flags/liberia.svg' },
    { code: 'LY', name: 'Libya', flag: '/media/flags/libya.svg' },
    { code: 'LT', name: 'Lithuania', flag: '/media/flags/lithuania.svg' },
    { code: 'LU', name: 'Luxembourg', flag: '/media/flags/luxembourg.svg' },
    { code: 'MO', name: 'Macao', flag: '/media/flags/macao.svg' },
    { code: 'MG', name: 'Madagascar', flag: '/media/flags/madagascar.svg' },
    { code: 'MW', name: 'Malawi', flag: '/media/flags/malawi.svg' },
    { code: 'MY', name: 'Malaysia', flag: '/media/flags/malaysia.svg' },
    { code: 'MV', name: 'Maldives', flag: '/media/flags/maldives.svg' },
    { code: 'ML', name: 'Mali', flag: '/media/flags/mali.svg' },
    { code: 'MT', name: 'Malta', flag: '/media/flags/malta.svg' },
    {
      code: 'MH',
      name: 'Marshall Islands',
      flag: '/media/flags/marshall-islands.svg',
    },
    { code: 'MR', name: 'Mauritania', flag: '/media/flags/mauritania.svg' },
    { code: 'MU', name: 'Mauritius', flag: '/media/flags/mauritius.svg' },
    { code: 'MX', name: 'Mexico', flag: '/media/flags/mexico.svg' },
    { code: 'FM', name: 'Micronesia', flag: '/media/flags/micronesia.svg' },
    { code: 'MD', name: 'Moldova', flag: '/media/flags/moldova.svg' },
    { code: 'MC', name: 'Monaco', flag: '/media/flags/monaco.svg' },
    { code: 'MN', name: 'Mongolia', flag: '/media/flags/mongolia.svg' },
    { code: 'ME', name: 'Montenegro', flag: '/media/flags/montenegro.svg' },
    { code: 'MA', name: 'Morocco', flag: '/media/flags/morocco.svg' },
    { code: 'MZ', name: 'Mozambique', flag: '/media/flags/mozambique.svg' },
    { code: 'MM', name: 'Myanmar', flag: '/media/flags/myanmar.svg' },
    { code: 'NA', name: 'Namibia', flag: '/media/flags/namibia.svg' },
    { code: 'NP', name: 'Nepal', flag: '/media/flags/nepal.svg' },
    { code: 'NL', name: 'Netherlands', flag: '/media/flags/netherlands.svg' },
    { code: 'NZ', name: 'New Zealand', flag: '/media/flags/new-zealand.svg' },
    { code: 'NI', name: 'Nicaragua', flag: '/media/flags/nicaragua.svg' },
    { code: 'NG', name: 'Nigeria', flag: '/media/flags/nigeria.svg' },
    { code: 'NO', name: 'Norway', flag: '/media/flags/norway.svg' },
    { code: 'OM', name: 'Oman', flag: '/media/flags/oman.svg' },
    { code: 'PK', name: 'Pakistan', flag: '/media/flags/pakistan.svg' },
    { code: 'PA', name: 'Panama', flag: '/media/flags/panama.svg' },
    {
      code: 'PG',
      name: 'Papua New Guinea',
      flag: '/media/flags/papua-new-guinea.svg',
    },
    { code: 'PY', name: 'Paraguay', flag: '/media/flags/paraguay.svg' },
    { code: 'PE', name: 'Peru', flag: '/media/flags/peru.svg' },
    { code: 'PH', name: 'Philippines', flag: '/media/flags/philippines.svg' },
    { code: 'PL', name: 'Poland', flag: '/media/flags/poland.svg' },
    { code: 'PT', name: 'Portugal', flag: '/media/flags/portugal.svg' },
    { code: 'QA', name: 'Qatar', flag: '/media/flags/qatar.svg' },
    { code: 'RO', name: 'Romania', flag: '/media/flags/romania.svg' },
    { code: 'RU', name: 'Russia', flag: '/media/flags/russia.svg' },
    { code: 'RW', name: 'Rwanda', flag: '/media/flags/rwanda.svg' },
    { code: 'WS', name: 'Samoa', flag: '/media/flags/samoa.svg' },
    { code: 'SM', name: 'San Marino', flag: '/media/flags/san-marino.svg' },
    { code: 'SA', name: 'Saudi Arabia', flag: '/media/flags/saudi-arabia.svg' },
    { code: 'SN', name: 'Senegal', flag: '/media/flags/senegal.svg' },
    { code: 'RS', name: 'Serbia', flag: '/media/flags/serbia.svg' },
    { code: 'SG', name: 'Singapore', flag: '/media/flags/singapore.svg' },
    { code: 'SK', name: 'Slovakia', flag: '/media/flags/slovakia.svg' },
    { code: 'SI', name: 'Slovenia', flag: '/media/flags/slovenia.svg' },
    { code: 'ZA', name: 'South Africa', flag: '/media/flags/south-africa.svg' },
    { code: 'ES', name: 'Spain', flag: '/media/flags/spain.svg' },
    { code: 'LK', name: 'Sri Lanka', flag: '/media/flags/sri-lanka.svg' },
    { code: 'SE', name: 'Sweden', flag: '/media/flags/sweden.svg' },
    { code: 'CH', name: 'Switzerland', flag: '/media/flags/switzerland.svg' },
    { code: 'SY', name: 'Syria', flag: '/media/flags/syria.svg' },
    { code: 'TW', name: 'Taiwan', flag: '/media/flags/taiwan.svg' },
    { code: 'TJ', name: 'Tajikistan', flag: '/media/flags/tajikistan.svg' },
    { code: 'TZ', name: 'Tanzania', flag: '/media/flags/tanzania.svg' },
    { code: 'TH', name: 'Thailand', flag: '/media/flags/thailand.svg' },
    { code: 'TR', name: 'Turkey', flag: '/media/flags/turkey.svg' },
    { code: 'UG', name: 'Uganda', flag: '/media/flags/uganda.svg' },
    { code: 'UA', name: 'Ukraine', flag: '/media/flags/ukraine.svg' },
    {
      code: 'AE',
      name: 'United Arab Emirates',
      flag: '/media/flags/united-arab-emirates.svg',
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      flag: '/media/flags/united-kingdom.svg',
    },
    { code: 'US', name: 'United States', flag: '/media/flags/united-states.svg' },
    { code: 'UY', name: 'Uruguay', flag: '/media/flags/uruguay.svg' },
    { code: 'UZ', name: 'Uzbekistan', flag: '/media/flags/uzbekistan.svg' },
    { code: 'VN', name: 'Vietnam', flag: '/media/flags/vietnam.svg' },
    { code: 'ZM', name: 'Zambia', flag: '/media/flags/zambia.svg' },
    { code: 'ZW', name: 'Zimbabwe', flag: '/media/flags/zimbabwe.svg' },
  ];

  const selectedCountry = countryFlags.find((country) => country.code === value);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    setValue(newValue);
    onChange([newValue]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="text-start">
        {selectedCountry ? (
          <span className="flex items-center gap-2">
            <img src={selectedCountry.flag} alt={selectedCountry.code} className="size-4 rounded-full" />
            <span className="truncate">{selectedCountry.name}</span>
          </span>
        ) : (
          <span>Select a country...</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryFlags.map((country) => (
                  <CommandItem key={country.code} value={country.code} onSelect={handleSelect}>
                    <span className="flex items-center gap-2">
                      <img src={country.flag} alt={country.code} className="h-5 w-5 rounded-full" />
                      <span className="truncate">{country.name}</span>
                    </span>
                    {value === country.code && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function CustomInputsDemo() {
  const fields: FilterFieldConfig[] = [
    {
      key: 'customDateRange',
      label: 'Date Range',
      icon: <CalendarIcon className="size-3.5" />,
      type: 'custom',
      operators: [
        { value: 'between', label: 'between' },
        { value: 'not_between', label: 'not between' },
      ],
      customRenderer: ({ values, onChange }) => <CustomDateRangeInput values={values} onChange={onChange} />,
    },
    {
      key: 'customDateRangePresets',
      label: 'Date Range Presets',
      icon: <CalendarIcon className="size-3.5" />,
      type: 'custom',
      operators: [
        { value: 'between', label: 'between' },
        { value: 'not_between', label: 'not between' },
      ],
      customRenderer: ({ values, onChange }) => <CustomDateRangeWithPresetsInput values={values} onChange={onChange} />,
    },
    {
      key: 'customDateTime',
      label: 'Date & Time',
      icon: <Clock className="size-3.5" />,
      type: 'custom',
      operators: [
        { value: 'is', label: 'is' },
        { value: 'before', label: 'before' },
        { value: 'after', label: 'after' },
      ],
      customRenderer: ({ values, onChange }) => <CustomDateTimeInput values={values} onChange={onChange} />,
    },
    {
      key: 'customSliderRange',
      label: 'Slider Range',
      icon: <Sliders className="size-3.5" />,
      type: 'custom',
      className: 'w-36',
      operators: [
        { value: 'between', label: 'between' },
        { value: 'not_between', label: 'not between' },
      ],
      customRenderer: ({ values, onChange }) => <CustomSliderRangeInput values={values} onChange={onChange} />,
    },
    {
      key: 'customCountry',
      label: 'Country',
      icon: <MapPin className="size-3.5" />,
      type: 'custom',
      operators: [
        { value: 'is', label: 'is' },
        { value: 'is_not', label: 'is not' },
      ],
      customRenderer: ({ values, onChange }) => <CustomCountryInput values={values} onChange={onChange} />,
    },
  ];

  const [filters, setFilters] = useState<Filter[]>([createFilter('customDateRange', 'between', [])]);

  const handleFiltersChange = useCallback((newFilters: Filter[]) => {
    console.log('Custom input filters updated:', newFilters);
    setFilters(newFilters);
  }, []);

  return (
    <div className="flex items-start gap-2.5 grow space-y-6 self-start content-start">
      <div className="flex-1">
        <Filters filters={filters} fields={fields} variant="outline" size="sm" onChange={handleFiltersChange} />
      </div>

      {filters.length > 0 && (
        <Button variant="outline" size="sm" onClick={() => setFilters([])}>
          <FunnelX /> Clear
        </Button>
      )}
    </div>
  );
}
