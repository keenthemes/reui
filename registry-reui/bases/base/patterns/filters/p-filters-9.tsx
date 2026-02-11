// Description: Filters with i18n support
// Order: 9
// GridSize: 1

"use client"

import { useCallback, useMemo, useState } from "react"
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
  type FilterI18nConfig,
} from "@/registry-reui/bases/base/reui/filters"

import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Internationalization configurations
const i18nConfigs: Record<string, FilterI18nConfig> = {
  en: {
    // UI Labels
    addFilter: "Add filter",
    searchFields: "Search fields...",
    noFieldsFound: "No fields found.",
    noResultsFound: "No results found.",
    select: "Select...",
    true: "True",
    false: "False",
    min: "Min",
    max: "Max",
    to: "to",
    typeAndPressEnter: "Type and press Enter to add tag",
    selected: "selected",
    selectedCount: "selected",
    percent: "%",
    defaultCurrency: "$",
    defaultColor: "#000000",
    addFilterTitle: "Add filter",

    // Operators
    operators: {
      is: "is",
      isNot: "is not",
      isAnyOf: "is any of",
      isNotAnyOf: "is not any of",
      includesAll: "includes all",
      excludesAll: "excludes all",
      before: "before",
      after: "after",
      between: "between",
      notBetween: "not between",
      contains: "contains",
      notContains: "does not contain",
      startsWith: "starts with",
      endsWith: "ends with",
      isExactly: "is exactly",
      equals: "equals",
      notEquals: "not equals",
      greaterThan: "greater than",
      lessThan: "less than",
      overlaps: "overlaps",
      includes: "includes",
      excludes: "excludes",
      includesAllOf: "includes all of",
      includesAnyOf: "includes any of",
      empty: "is empty",
      notEmpty: "is not empty",
    },

    // Placeholders
    placeholders: {
      enterField: (fieldType: string) => `Enter ${fieldType}...`,
      selectField: "Select...",
      searchField: (fieldName: string) =>
        `Search ${fieldName.toLowerCase()}...`,
      enterKey: "Enter key...",
      enterValue: "Enter value...",
    },

    // Helper functions
    helpers: {
      formatOperator: (operator: string) => operator.replace(/_/g, " "),
    },

    // Validation
    validation: {
      invalidEmail: "Invalid email format",
      invalidUrl: "Invalid URL format",
      invalidTel: "Invalid phone format",
      invalid: "Invalid input format",
    },
  },
  es: {
    // UI Labels
    addFilter: "Agregar filtro",
    searchFields: "Buscar campos...",
    noFieldsFound: "No se encontraron campos.",
    noResultsFound: "No se encontraron resultados.",
    select: "Seleccionar...",
    true: "Verdadero",
    false: "Falso",
    min: "Mín",
    max: "Máx",
    to: "a",
    typeAndPressEnter: "Escriba y presione Enter para agregar etiqueta",
    selected: "seleccionado",
    selectedCount: "seleccionados",
    percent: "%",
    defaultCurrency: "€",
    defaultColor: "#000000",
    addFilterTitle: "Agregar filtro",

    // Operators
    operators: {
      is: "es",
      isNot: "no es",
      isAnyOf: "es cualquiera de",
      isNotAnyOf: "no es cualquiera de",
      includesAll: "incluye todos",
      excludesAll: "excluye todos",
      before: "antes de",
      after: "después de",
      between: "entre",
      notBetween: "no entre",
      contains: "contiene",
      notContains: "no contiene",
      startsWith: "comienza con",
      endsWith: "termina con",
      isExactly: "es exactamente",
      equals: "igual a",
      notEquals: "no igual a",
      greaterThan: "mayor que",
      lessThan: "menor que",
      overlaps: "se superpone",
      includes: "incluye",
      excludes: "excluye",
      includesAllOf: "incluye todos de",
      includesAnyOf: "incluye cualquiera de",
      empty: "está vacío",
      notEmpty: "no está vacío",
    },

    // Placeholders
    placeholders: {
      enterField: (fieldType: string) => `Ingrese ${fieldType}...`,
      selectField: "Seleccionar...",
      searchField: (fieldName: string) =>
        `Buscar ${fieldName.toLowerCase()}...`,
      enterKey: "Ingrese clave...",
      enterValue: "Ingrese valor...",
    },

    // Helper functions
    helpers: {
      formatOperator: (operator: string) => operator.replace(/_/g, " "),
    },

    // Validation
    validation: {
      invalidEmail: "Formato de email inválido",
      invalidUrl: "Formato de URL inválido",
      invalidTel: "Formato de teléfono inválido",
      invalid: "Formato de entrada inválido",
    },
  },
  fr: {
    // UI Labels
    addFilter: "Ajouter un filtre",
    searchFields: "Rechercher des champs...",
    noFieldsFound: "Aucun champ trouvé.",
    noResultsFound: "Aucun résultat trouvé.",
    select: "Sélectionner...",
    true: "Vrai",
    false: "Faux",
    min: "Min",
    max: "Max",
    to: "à",
    typeAndPressEnter: "Tapez et appuyez sur Entrée pour ajouter une étiquette",
    selected: "sélectionné",
    selectedCount: "sélectionnés",
    percent: "%",
    defaultCurrency: "€",
    defaultColor: "#000000",
    addFilterTitle: "Ajouter un filtre",

    // Operators
    operators: {
      is: "est",
      isNot: "n'est pas",
      isAnyOf: "est l'un de",
      isNotAnyOf: "n'est pas l'un de",
      includesAll: "inclut tous",
      excludesAll: "exclut tous",
      before: "avant",
      after: "après",
      between: "entre",
      notBetween: "pas entre",
      contains: "contient",
      notContains: "ne contient pas",
      startsWith: "commence par",
      endsWith: "se termine par",
      isExactly: "est exactement",
      equals: "égal à",
      notEquals: "pas égal à",
      greaterThan: "supérieur à",
      lessThan: "inférieur à",
      overlaps: "se chevauche",
      includes: "inclut",
      excludes: "exclut",
      includesAllOf: "inclut tous de",
      includesAnyOf: "inclut l'un de",
      empty: "est vide",
      notEmpty: "n'est pas vide",
    },

    // Placeholders
    placeholders: {
      enterField: (fieldType: string) => `Entrez ${fieldType}...`,
      selectField: "Sélectionner...",
      searchField: (fieldName: string) =>
        `Rechercher ${fieldName.toLowerCase()}...`,
      enterKey: "Entrez la clé...",
      enterValue: "Entrez la valeur...",
    },

    // Helper functions
    helpers: {
      formatOperator: (operator: string) => operator.replace(/_/g, " "),
    },

    // Validation
    validation: {
      invalidEmail: "Format d'email invalide",
      invalidUrl: "Format d'URL invalide",
      invalidTel: "Format de téléphone invalide",
      invalid: "Format de saisie invalide",
    },
  },
  de: {
    // UI Labels
    addFilter: "Filter hinzufügen",
    searchFields: "Felder suchen...",
    noFieldsFound: "Keine Felder gefunden.",
    noResultsFound: "Keine Ergebnisse gefunden.",
    select: "Auswählen...",
    true: "Wahr",
    false: "Falsch",
    min: "Min",
    max: "Max",
    to: "bis",
    typeAndPressEnter: "Tippen und Enter drücken, um Tag hinzuzufügen",
    selected: "ausgewählt",
    selectedCount: "ausgewählt",
    percent: "%",
    defaultCurrency: "€",
    defaultColor: "#000000",
    addFilterTitle: "Filter hinzufügen",

    // Operators
    operators: {
      is: "ist",
      isNot: "ist nicht",
      isAnyOf: "ist eines von",
      isNotAnyOf: "ist nicht eines von",
      includesAll: "enthält alle",
      excludesAll: "schließt alle aus",
      before: "vor",
      after: "nach",
      between: "zwischen",
      notBetween: "nicht zwischen",
      contains: "enthält",
      notContains: "enthält nicht",
      startsWith: "beginnt mit",
      endsWith: "endet mit",
      isExactly: "ist genau",
      equals: "gleich",
      notEquals: "nicht gleich",
      greaterThan: "größer als",
      lessThan: "kleiner als",
      overlaps: "überschneidet sich",
      includes: "enthält",
      excludes: "schließt aus",
      includesAllOf: "enthält alle von",
      includesAnyOf: "enthält eines von",
      empty: "ist leer",
      notEmpty: "ist nicht leer",
    },

    // Placeholders
    placeholders: {
      enterField: (fieldType: string) => `${fieldType} eingeben...`,
      selectField: "Auswählen...",
      searchField: (fieldName: string) =>
        `${fieldName.toLowerCase()} suchen...`,
      enterKey: "Schlüssel eingeben...",
      enterValue: "Wert eingeben...",
    },

    // Helper functions
    helpers: {
      formatOperator: (operator: string) => operator.replace(/_/g, " "),
    },

    // Validation
    validation: {
      invalidEmail: "Ungültiges E-Mail-Format",
      invalidUrl: "Ungültiges URL-Format",
      invalidTel: "Ungültiges Telefonformat",
      invalid: "Ungültiges Format",
    },
  },
  ja: {
    // UI Labels
    addFilter: "フィルターを追加",
    searchFields: "フィールドを検索...",
    noFieldsFound: "フィールドが見つかりません。",
    noResultsFound: "結果が見つかりません。",
    select: "選択...",
    true: "真",
    false: "偽",
    min: "最小",
    max: "最大",
    to: "から",
    typeAndPressEnter: "入力してEnterキーを押してタグを追加",
    selected: "選択済み",
    selectedCount: "選択済み",
    percent: "%",
    defaultCurrency: "¥",
    defaultColor: "#000000",
    addFilterTitle: "フィルターを追加",

    // Operators
    operators: {
      is: "は",
      isNot: "ではない",
      isAnyOf: "のいずれか",
      isNotAnyOf: "のいずれでもない",
      includesAll: "すべて含む",
      excludesAll: "すべて除外",
      before: "より前",
      after: "より後",
      between: "の間",
      notBetween: "の間ではない",
      contains: "含む",
      notContains: "含まない",
      startsWith: "で始まる",
      endsWith: "で終わる",
      isExactly: "正確に",
      equals: "等しい",
      notEquals: "等しくない",
      greaterThan: "より大きい",
      lessThan: "より小さい",
      overlaps: "重複する",
      includes: "含む",
      excludes: "除外",
      includesAllOf: "すべて含む",
      includesAnyOf: "いずれか含む",
      empty: "空",
      notEmpty: "空でない",
    },

    // Placeholders
    placeholders: {
      enterField: (fieldType: string) => `${fieldType}を入力...`,
      selectField: "選択...",
      searchField: (fieldName: string) => `${fieldName.toLowerCase()}を検索...`,
      enterKey: "キーを入力...",
      enterValue: "値を入力...",
    },

    // Helper functions
    helpers: {
      formatOperator: (operator: string) => operator.replace(/_/g, " "),
    },

    // Validation
    validation: {
      invalidEmail: "無効なメール形式",
      invalidUrl: "無効なURL形式",
      invalidTel: "無効な電話番号形式",
      invalid: "無効な形式",
    },
  },
}

// Language options for the selector
const languageOptions = [
  { value: "en", label: "English", flag: "us" },
  { value: "es", label: "Español", flag: "es" },
  { value: "fr", label: "Français", flag: "fr" },
  { value: "de", label: "Deutsch", flag: "de" },
  { value: "ja", label: "日本語", flag: "jp" },
]

export default function Pattern() {
  const [currentLanguage, setCurrentLanguage] = useState<string>("es")
  const [filters, setFilters] = useState<Filter[]>([
    createFilter("status", "is", ["active"]),
  ])

  // Get current i18n configuration
  const currentI18n = useMemo(
    () => i18nConfigs[currentLanguage],
    [currentLanguage]
  )

  // Filter field configurations with localized labels
  const fields: FilterFieldConfig[] = useMemo(() => {
    const fieldLabels = {
      en: {
        name: "Name",
        email: "Email",
        company: "Company",
        role: "Role",
        status: "Status",
        location: "Location",
        joined: "Joined Date",
        balance: "Balance",
        rating: "Rating",
      },
      es: {
        name: "Nombre",
        email: "Correo electrónico",
        company: "Empresa",
        role: "Rol",
        status: "Estado",
        location: "Ubicación",
        joined: "Fecha de ingreso",
        balance: "Saldo",
        rating: "Calificación",
      },
      fr: {
        name: "Nom",
        email: "E-mail",
        company: "Entreprise",
        role: "Rôle",
        status: "Statut",
        location: "Localisation",
        joined: "Date d'adhésion",
        balance: "Solde",
        rating: "Note",
      },
      de: {
        name: "Name",
        email: "E-Mail",
        company: "Unternehmen",
        role: "Rolle",
        status: "Status",
        location: "Standort",
        joined: "Beitrittsdatum",
        balance: "Guthaben",
        rating: "Bewertung",
      },
      ja: {
        name: "名前",
        email: "メール",
        company: "会社",
        role: "役割",
        status: "ステータス",
        location: "場所",
        joined: "参加日",
        balance: "残高",
        rating: "評価",
      },
    }

    const labels =
      fieldLabels[currentLanguage as keyof typeof fieldLabels] || fieldLabels.en

    return [
      {
        key: "name",
        label: labels.name,
        icon: (
          <IconPlaceholder
            lucide="UserIcon"
            tabler="IconUser"
            hugeicons="UserIcon"
            phosphor="UserIcon"
            remixicon="RiUserLine"
            className="size-3.5"
          />
        ),
        type: "text",
        className: "w-40",
        placeholder:
          currentLanguage === "en"
            ? "Search names..."
            : currentLanguage === "es"
              ? "Buscar nombres..."
              : currentLanguage === "fr"
                ? "Rechercher des noms..."
                : currentLanguage === "de"
                  ? "Namen suchen..."
                  : "名前を検索...",
      },
      {
        key: "email",
        label: labels.email,
        icon: (
          <IconPlaceholder
            lucide="MailIcon"
            tabler="IconMail"
            hugeicons="MailIcon"
            phosphor="EnvelopeIcon"
            remixicon="RiMailLine"
            className="size-3.5"
          />
        ),
        type: "text",
        className: "w-48",
        placeholder: "user@example.com",
      },
      {
        key: "company",
        label: labels.company,
        icon: (
          <IconPlaceholder
            lucide="BuildingIcon"
            tabler="IconBuilding"
            hugeicons="Building02Icon"
            phosphor="BuildingIcon"
            remixicon="RiBuilding4Line"
            className="size-3.5"
          />
        ),
        type: "select",
        searchable: true,
        className: "w-[180px]",
        options: [
          { value: "TechCorp", label: "TechCorp" },
          { value: "StartupCo", label: "StartupCo" },
          { value: "BigCorp", label: "BigCorp" },
          { value: "InnovateTech", label: "InnovateTech" },
          { value: "GlobalNet", label: "GlobalNet" },
        ],
      },
      {
        key: "role",
        label: labels.role,
        icon: (
          <IconPlaceholder
            lucide="UserIcon"
            tabler="IconUser"
            hugeicons="UserIcon"
            phosphor="UserIcon"
            remixicon="RiUserLine"
            className="size-3.5"
          />
        ),
        type: "select",
        searchable: true,
        className: "w-[160px]",
        options: [
          { value: "Developer", label: "Developer" },
          { value: "Designer", label: "Designer" },
          { value: "Manager", label: "Manager" },
          { value: "Product Manager", label: "Product Manager" },
          { value: "Sales Rep", label: "Sales Rep" },
        ],
      },
      {
        key: "status",
        label: labels.status,
        icon: (
          <IconPlaceholder
            lucide="CircleCheckIcon"
            tabler="IconCircleCheck"
            hugeicons="CheckmarkCircle01Icon"
            phosphor="CheckCircleIcon"
            remixicon="RiCheckboxCircleLine"
            className="size-3.5"
          />
        ),
        type: "select",
        searchable: false,
        className: "w-[140px]",
        options: [
          {
            value: "active",
            label:
              currentLanguage === "en"
                ? "Active"
                : currentLanguage === "es"
                  ? "Activo"
                  : currentLanguage === "fr"
                    ? "Actif"
                    : currentLanguage === "de"
                      ? "Aktiv"
                      : "アクティブ",
          },
          {
            value: "inactive",
            label:
              currentLanguage === "en"
                ? "Inactive"
                : currentLanguage === "es"
                  ? "Inactivo"
                  : currentLanguage === "fr"
                    ? "Inactif"
                    : currentLanguage === "de"
                      ? "Inaktiv"
                      : "非アクティブ",
          },
        ],
      },
      {
        key: "location",
        label: labels.location,
        icon: (
          <IconPlaceholder
            lucide="MapPinIcon"
            tabler="IconMapPin"
            hugeicons="Location06Icon"
            phosphor="MapPinIcon"
            remixicon="RiMapPinLine"
            className="size-3.5"
          />
        ),
        type: "text",
        className: "w-40",
        placeholder:
          currentLanguage === "en"
            ? "Search locations..."
            : currentLanguage === "es"
              ? "Buscar ubicaciones..."
              : currentLanguage === "fr"
                ? "Rechercher des lieux..."
                : currentLanguage === "de"
                  ? "Standorte suchen..."
                  : "場所を検索...",
      },
    ]
  }, [currentLanguage])

  const handleFiltersChange = useCallback((newFilters: Filter[]) => {
    setFilters(newFilters)
  }, [])

  return (
    <div className="flex w-full grow items-start justify-between space-y-6 self-start">
      {/* Filters Section */}
      <Filters
        filters={filters}
        fields={fields}
        onChange={handleFiltersChange}
        size="sm"
        trigger={
          <Button variant="outline" size="icon-sm">
            <IconPlaceholder
              lucide="ListFilterIcon"
              tabler="IconFilter2"
              hugeicons="FilterMailIcon"
              phosphor="FunnelSimpleIcon"
              remixicon="RiFilter3Line"
            />
          </Button>
        }
        i18n={currentI18n}
      />
      <div className="flex items-center gap-2">
        {/* Language selection */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {(() => {
                  const lang = languageOptions.find(
                    (l) => l.value === currentLanguage
                  )
                  return (
                    lang && (
                      <img
                        src={`https://flagcdn.com/${lang.flag.toLowerCase()}.svg`}
                        alt={lang.flag}
                        className="size-4 rounded-full object-cover"
                      />
                    )
                  )
                })()}
                <span>
                  {
                    languageOptions.find(
                      (lang) => lang.value === currentLanguage
                    )?.label
                  }
                </span>
                <IconPlaceholder
                  lucide="ChevronDownIcon"
                  tabler="IconChevronDown"
                  hugeicons="ArrowDown01Icon"
                  phosphor="CaretDownIcon"
                  remixicon="RiArrowDownSLine"
                  className="size-4"
                />
              </Button>
            }
          />
          <DropdownMenuContent align="start">
            {languageOptions.map((lang) => (
              <DropdownMenuItem
                key={lang.value}
                onClick={() => setCurrentLanguage(lang.value)}
                className="flex items-center gap-2"
              >
                <img
                  src={`https://flagcdn.com/${lang.flag.toLowerCase()}.svg`}
                  alt={lang.flag}
                  className="size-4 rounded-full object-cover"
                />
                <span>{lang.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
