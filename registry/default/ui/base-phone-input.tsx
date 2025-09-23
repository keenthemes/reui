import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/base-button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from '@/registry/default/ui/base-combobox';
import { Input } from '@/registry/default/ui/base-input';
import { ScrollArea } from '@/registry/default/ui/base-scroll-area';
import * as BasePhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

type PhoneInputSize = 'sm' | 'md' | 'lg';

const PhoneInputContext = React.createContext<{
  variant: PhoneInputSize;
  popupClassName?: string;
  scrollAreaClassName?: string;
}>({
  variant: 'md',
  popupClassName: undefined,
  scrollAreaClassName: undefined,
});

type PhoneInputProps = Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'ref'> &
  Omit<
    BasePhoneInput.Props<typeof BasePhoneInput.default>,
    'onChange' | 'variant' | 'popupClassName' | 'scrollAreaClassName'
  > & {
    onChange?: (value: BasePhoneInput.Value) => void;
    variant?: PhoneInputSize;
    popupClassName?: string;
    scrollAreaClassName?: string;
  };

function PhoneInput({
  className,
  variant,
  popupClassName,
  scrollAreaClassName,
  onChange,
  value,
  ...props
}: PhoneInputProps) {
  const phoneInputSize = variant || 'md';
  return (
    <PhoneInputContext.Provider value={{ variant: phoneInputSize, popupClassName, scrollAreaClassName }}>
      <BasePhoneInput.default
        className={cn(
          'flex',
          props['aria-invalid'] &&
            '[&_*[data-slot=combobox-trigger]]:border-destructive [&_*[data-slot=combobox-trigger]]:ring-destructive/50',
          className,
        )}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value || undefined}
        onChange={(value) => onChange?.(value || ('' as BasePhoneInput.Value))}
        {...props}
      />
    </PhoneInputContext.Provider>
  );
}

function InputComponent({ className, ...props }: React.ComponentProps<typeof Input>) {
  const { variant } = React.useContext(PhoneInputContext);
  return <Input variant={variant} className={cn('rounded-s-none focus:z-1', className)} {...props} />;
}

type CountryEntry = { label: string; value: BasePhoneInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: BasePhoneInput.Country;
  options: CountryEntry[];
  onChange: (country: BasePhoneInput.Country) => void;
};

function CountrySelect({ disabled, value: selectedCountry, options: countryList, onChange }: CountrySelectProps) {
  const { variant, popupClassName, scrollAreaClassName } = React.useContext(PhoneInputContext);
  const [searchValue, setSearchValue] = React.useState('');

  const filteredCountries = React.useMemo(() => {
    if (!searchValue) return countryList;
    return countryList.filter(({ label }) => label.toLowerCase().includes(searchValue.toLowerCase()));
  }, [countryList, searchValue]);

  return (
    <Combobox
      items={filteredCountries}
      value={selectedCountry || ''}
      onValueChange={(country) => {
        if (country) {
          onChange(country as BasePhoneInput.Country);
        }
      }}
    >
      <div className="relative">
        <ComboboxTrigger
          render={
            <Button
              variant="outline"
              mode="input"
              size={variant}
              className={cn(
                ['flex gap-1 rounded-s-md rounded-e-none border-e-0 px-3 focus:z-10 w-16', 'shadow-xs shadow-black/5'],
                disabled && 'opacity-50',
              )}
              disabled={disabled}
            >
              <ComboboxValue>
                {(value: BasePhoneInput.Country) => (
                  <>
                    <FlagComponent country={value} countryName={value} />
                  </>
                )}
              </ComboboxValue>
              <ComboboxIcon />
            </Button>
          }
        />
      </div>
      <ComboboxContent className={cn('w-[300px] overflow-hidden', popupClassName)}>
        <ComboboxInput
          variant={variant}
          placeholder="e.g. United States"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={cn([
            'border-0 shadow-none rounded-none',
            'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border',
          ])}
        />
        <ComboboxSeparator />
        <ComboboxEmpty className="text-center px-2 pt-4 pb-2">No country found.</ComboboxEmpty>
        <ScrollArea className={cn('h-[300px]', scrollAreaClassName)}>
          <ComboboxList className="overflow-hidden my-1">
            {filteredCountries.map(({ value, label }) =>
              value ? (
                <ComboboxItem key={value} value={value} className="flex items-center gap-2 ps-3 pe-8">
                  <FlagComponent country={value} countryName={label} />
                  <span className="flex-1 text-sm">{label}</span>
                  <span className="text-foreground/50 text-sm">
                    {`+${BasePhoneInput.getCountryCallingCode(value)}`}
                  </span>
                  <ComboboxItemIndicator className="start-auto end-2.5" />
                </ComboboxItem>
              ) : null,
            )}
          </ComboboxList>
        </ScrollArea>
      </ComboboxContent>
    </Combobox>
  );
}

function FlagComponent({ country, countryName }: BasePhoneInput.FlagProps) {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/10 flex h-4 w-6 overflow-hidden rounded-sm [&_svg:not([class*='size-'])]:size-full!">
      {Flag && <Flag title={countryName} />}
    </span>
  );
}

export { PhoneInput };
