"use client"

import {
  ComponentProps,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react"
import * as BasePhoneInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/radix/ui/combobox"
import { Input } from "@/registry/bases/radix/ui/input"
import { ScrollArea } from "@/registry/bases/radix/ui/scroll-area"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type PhoneInputSize = "sm" | "default" | "lg"

const PhoneInputContext = createContext<{
  variant: PhoneInputSize
  popupClassName?: string
  scrollAreaClassName?: string
}>({
  variant: "default",
  popupClassName: undefined,
  scrollAreaClassName: undefined,
})

type PhoneInputProps = Omit<
  ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<
    BasePhoneInput.Props<typeof BasePhoneInput.default>,
    "onChange" | "variant" | "popupClassName" | "scrollAreaClassName"
  > & {
    onChange?: (value: BasePhoneInput.Value) => void
    variant?: PhoneInputSize
    popupClassName?: string
    scrollAreaClassName?: string
  }

function PhoneInput({
  className,
  variant,
  popupClassName,
  scrollAreaClassName,
  onChange,
  value,
  ...props
}: PhoneInputProps) {
  const phoneInputSize = variant || "default"
  return (
    <PhoneInputContext.Provider
      value={{ variant: phoneInputSize, popupClassName, scrollAreaClassName }}
    >
      <BasePhoneInput.default
        className={cn(
          "flex",
          props["aria-invalid"] &&
            "[&_*[data-slot=combobox-trigger]]:border-destructive [&_*[data-slot=combobox-trigger]]:ring-destructive/50",
          className
        )}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value || undefined}
        onChange={(value) => onChange?.(value || ("" as BasePhoneInput.Value))}
        {...props}
      />
    </PhoneInputContext.Provider>
  )
}

function InputComponent({ className, ...props }: ComponentProps<typeof Input>) {
  const { variant } = useContext(PhoneInputContext)

  return (
    <Input
      className={cn(
        "style-vega:rounded-s-none style-maia:rounded-s-none style-nova:rounded-s-none style-lyra:rounded-s-none style-mira:rounded-s-none focus:z-1",
        variant === "sm" &&
          "style-vega:h-8 style-maia:h-8 style-nova:h-7 style-lyra:h-7 style-mira:h-6",
        variant === "lg" &&
          "style-vega:h-10 style-maia:h-10 style-nova:h-9 style-lyra:h-9 style-mira:h-8",
        className
      )}
      {...props}
    />
  )
}

type CountryEntry = { label: string; value: BasePhoneInput.Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  value: BasePhoneInput.Country
  options: CountryEntry[]
  onChange: (country: BasePhoneInput.Country) => void
}

function CountrySelect({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) {
  const { variant, popupClassName } = useContext(PhoneInputContext)
  const [searchValue, setSearchValue] = useState("")

  const filteredCountries = useMemo(() => {
    if (!searchValue) return countryList
    return countryList.filter(({ label }) =>
      label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [countryList, searchValue])

  return (
    <Combobox
      items={filteredCountries}
      value={selectedCountry || ""}
      onValueChange={(country: BasePhoneInput.Country | null) => {
        if (country) {
          onChange(country)
        }
      }}
    >
      <ComboboxTrigger
        render={
          <Button
            variant="outline"
            size={variant}
            className={cn(
              "style-vega:rounded-s-md style-vega:rounded-e-none style-maia:rounded-s-4xl style-maia:rounded-e-none style-nova:rounded-s-lg style-nova:rounded-e-none style-lyra:rounded-s-none style-lyra:rounded-e-none style-mira:rounded-s-md style-mira:rounded-e-none style-vega:shadow-xs style-vega:shadow-black/5 flex gap-1 border-e-0 px-2.5 py-0 leading-none hover:bg-transparent focus:z-10 data-pressed:bg-transparent",
              disabled && "opacity-50"
            )}
            disabled={disabled}
          >
            <span className="sr-only">
              <ComboboxValue />
            </span>
            <FlagComponent
              country={selectedCountry}
              countryName={selectedCountry}
            />
          </Button>
        }
      />
      <ComboboxContent
        className={cn(
          "w-xs *:data-[slot=input-group]:bg-transparent",
          popupClassName
        )}
      >
        <ComboboxInput
          placeholder="e.g. United States"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          showTrigger={false}
          className="border-input focus-visible:border-border rounded-none border-0 px-0 py-2.5 shadow-none ring-0! outline-none! focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <ComboboxSeparator />
        <ComboboxEmpty className="px-4 py-2.5 text-sm">
          No country found.
        </ComboboxEmpty>
        <ComboboxList>
          <div className="relative flex max-h-full">
            <div className="flex max-h-[min(var(--available-height),24rem)] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain">
              <ScrollArea className="size-full min-h-0 **:data-[slot=scroll-area-scrollbar]:m-0 [&_[data-slot=scroll-area-viewport]]:h-full [&_[data-slot=scroll-area-viewport]]:overscroll-contain">
                {filteredCountries.map((item: CountryEntry) =>
                  item.value ? (
                    <ComboboxItem
                      key={item.value}
                      value={item.value}
                      className="flex items-center gap-2"
                    >
                      <FlagComponent
                        country={item.value}
                        countryName={item.label}
                      />
                      <span className="flex-1 text-sm">{item.label}</span>
                      <span className="text-foreground/50 text-sm">
                        {`+${BasePhoneInput.getCountryCallingCode(item.value)}`}
                      </span>
                    </ComboboxItem>
                  ) : null
                )}
              </ScrollArea>
            </div>
          </div>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function FlagComponent({ country, countryName }: BasePhoneInput.FlagProps) {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-4 items-center justify-center [&_svg:not([class*='size-'])]:size-full! [&_svg:not([class*='size-'])]:rounded-[5px]">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <IconPlaceholder
          lucide="GlobeIcon"
          tabler="IconWorld"
          hugeicons="Globe02Icon"
          phosphor="GlobeSimpleIcon"
          remixicon="RiGlobalLine"
          className="size-4 opacity-60"
        />
      )}
    </span>
  )
}

export { PhoneInput }
