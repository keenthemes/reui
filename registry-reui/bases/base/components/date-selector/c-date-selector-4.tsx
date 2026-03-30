// Description: Date selector with dropdown menu
// Order: 4

"use client"

import { useEffect, useMemo, useState } from "react"
import {
  DateSelector,
  DEFAULT_DATE_SELECTOR_I18N,
  formatDateValue,
  type DateSelectorI18nConfig,
  type DateSelectorValue,
} from "@/registry-reui/bases/base/reui/date-selector"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Helper function to create i18n config from translations
function createI18nConfig(
  translations: Partial<DateSelectorI18nConfig>
): DateSelectorI18nConfig {
  return { ...DEFAULT_DATE_SELECTOR_I18N, ...translations }
}

// Language-specific translations
const translations: Record<string, Partial<DateSelectorI18nConfig>> = {
  es: {
    selectDate: "Seleccionar fecha",
    apply: "Aplicar",
    cancel: "Cancelar",
    clear: "Limpiar",
    today: "Hoy",
    filterTypes: {
      is: "es",
      before: "antes de",
      after: "después de",
      between: "entre",
    },
    periodTypes: {
      day: "Día",
      month: "Mes",
      quarter: "Trimestre",
      halfYear: "Semestre",
      year: "Año",
    },
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    monthsShort: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    quarters: ["T1", "T2", "T3", "T4"],
    halfYears: ["S1", "S2"],
    weekdays: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    weekdaysShort: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
    placeholder: "Seleccionar fecha...",
    rangePlaceholder: "Seleccionar rango de fechas...",
  },
  fr: {
    selectDate: "Sélectionner une date",
    apply: "Appliquer",
    cancel: "Annuler",
    clear: "Effacer",
    today: "Aujourd'hui",
    filterTypes: {
      is: "est",
      before: "avant",
      after: "après",
      between: "entre",
    },
    periodTypes: {
      day: "Jour",
      month: "Mois",
      quarter: "Trimestre",
      halfYear: "Semestre",
      year: "Année",
    },
    months: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    monthsShort: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ],
    quarters: ["T1", "T2", "T3", "T4"],
    halfYears: ["S1", "S2"],
    weekdays: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    weekdaysShort: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
    placeholder: "Sélectionner une date...",
    rangePlaceholder: "Sélectionner une plage de dates...",
  },
  de: {
    selectDate: "Datum auswählen",
    apply: "Anwenden",
    cancel: "Abbrechen",
    clear: "Löschen",
    today: "Heute",
    filterTypes: {
      is: "ist",
      before: "vor",
      after: "nach",
      between: "zwischen",
    },
    periodTypes: {
      day: "Tag",
      month: "Monat",
      quarter: "Quartal",
      halfYear: "Halbjahr",
      year: "Jahr",
    },
    months: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],
    monthsShort: [
      "Jan",
      "Feb",
      "Mär",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dez",
    ],
    quarters: ["Q1", "Q2", "Q3", "Q4"],
    halfYears: ["H1", "H2"],
    weekdays: [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ],
    weekdaysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    placeholder: "Datum auswählen...",
    rangePlaceholder: "Datumsbereich auswählen...",
  },
}

// Internationalization configurations
const i18nConfigs: Record<string, DateSelectorI18nConfig> = {
  en: DEFAULT_DATE_SELECTOR_I18N,
  es: createI18nConfig(translations.es),
  fr: createI18nConfig(translations.fr),
  de: createI18nConfig(translations.de),
}

// Language metadata
const languageMetadata = {
  en: {
    label: "English",
    flag: "🇺🇸",
    dateFormat: "MM/dd/yyyy",
    weekStartsOn: 0 as const,
    ui: {
      label: "Due date",
      hint: "Try: 2025, Q4, 05/10/2025",
      placeholder: "Select a date",
    },
  },
  es: {
    label: "Español",
    flag: "🇪🇸",
    dateFormat: "dd/MM/yyyy",
    weekStartsOn: 1 as const,
    ui: {
      label: "Fecha de vencimiento",
      hint: "Prueba: 2025, T4, 05/10/2025",
      placeholder: "Seleccionar una fecha",
    },
  },
  fr: {
    label: "Français",
    flag: "🇫🇷",
    dateFormat: "dd/MM/yyyy",
    weekStartsOn: 1 as const,
    ui: {
      label: "Date d'échéance",
      hint: "Essayez: 2025, T4, 05/10/2025",
      placeholder: "Sélectionner une date",
    },
  },
  de: {
    label: "Deutsch",
    flag: "🇩🇪",
    dateFormat: "dd.MM.yyyy",
    weekStartsOn: 1 as const,
    ui: {
      label: "Fälligkeitsdatum",
      hint: "Versuchen Sie: 2025, Q4, 05.10.2025",
      placeholder: "Datum auswählen",
    },
  },
}

// Language options for the selector
const languageOptions = Object.entries(languageMetadata).map(
  ([value, meta]) => ({
    value,
    label: meta.label,
    flag: meta.flag,
  })
)

export default function Pattern() {
  const [value, setValue] = useState<DateSelectorValue | undefined>()
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<
    DateSelectorValue | undefined
  >(value)
  const [currentLanguage, setCurrentLanguage] =
    useState<keyof typeof languageMetadata>("fr")

  // Get current language metadata and i18n config
  const currentMeta = useMemo(
    () => languageMetadata[currentLanguage] || languageMetadata.en,
    [currentLanguage]
  )

  const currentI18n = useMemo(
    () => i18nConfigs[currentLanguage] || i18nConfigs.en,
    [currentLanguage]
  )

  useEffect(() => {
    if (open) {
      setInternalValue(value)
    }
  }, [open, value])

  const formattedValue = useMemo(
    () =>
      value ? formatDateValue(value, currentI18n, currentMeta.dateFormat) : "",
    [value, currentI18n, currentMeta.dateFormat]
  )

  const displayText = formattedValue || currentMeta.ui.placeholder

  const handleApply = () => {
    setValue(internalValue)
    setOpen(false)
  }

  const handleCancel = () => {
    setInternalValue(value)
    setOpen(false)
  }

  return (
    <div className="flex h-full w-full grow flex-col items-stretch gap-4">
      <div className="flex w-full justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <span>{currentMeta.flag}</span>
                <span>{currentMeta.label}</span>
                <IconPlaceholder
                  lucide="ChevronDownIcon"
                  tabler="IconChevronDown"
                  hugeicons="ArrowDown01Icon"
                  phosphor="CaretDownIcon"
                  remixicon="RiArrowDownSLine"
                />
              </Button>
            }
          />
          <DropdownMenuContent align="start">
            {languageOptions.map((lang) => (
              <DropdownMenuItem
                key={lang.value}
                onClick={() =>
                  setCurrentLanguage(
                    lang.value as keyof typeof languageMetadata
                  )
                }
                className="flex items-center gap-2"
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex grow items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button variant="outline" className="w-56 justify-start">
                <IconPlaceholder
                  lucide="CalendarIcon"
                  tabler="IconCalendarEvent"
                  hugeicons="Calendar04Icon"
                  phosphor="CalendarBlankIcon"
                  remixicon="RiCalendarLine"
                />
                {displayText}
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{currentMeta.ui.label}</DialogTitle>
            </DialogHeader>
            <DateSelector
              value={internalValue}
              onChange={setInternalValue}
              showInput={true}
              i18n={currentI18n}
              dayDateFormat={currentMeta.dateFormat}
              weekStartsOn={currentMeta.weekStartsOn}
            />
            <DialogFooter>
              <DialogClose
                render={
                  <Button variant="outline" onClick={handleCancel}>
                    {currentI18n.cancel}
                  </Button>
                }
              />
              <Button onClick={handleApply}>{currentI18n.apply}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
