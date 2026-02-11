// Description: Data grid with sub table
// GridSize: 1
// Order: 9

"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  DataGrid,
  DataGridContainer,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "@/registry-reui/bases/base/reui/data-grid/data-grid-column-header"
import { DataGridPagination } from "@/registry-reui/bases/base/reui/data-grid/data-grid-pagination"
import { DataGridTable } from "@/registry-reui/bases/base/reui/data-grid/data-grid-table"
import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import type { VariantProps } from "class-variance-authority"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import { ScrollArea, ScrollBar } from "@/registry/bases/base/ui/scroll-area"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface OrderItemData {
  id: string
  productName: string
  category: string
  price: string
  quantity: number
}

interface Data {
  id: string
  orderNumber: string
  customer: string
  customerEmail: string
  customerAvatar: string
  total: string
  status: {
    label: string
    variant: VariantProps<typeof Badge>["variant"]
  }
  items: OrderItemData[]
}

const demoData: Data[] = [
  {
    id: "1",
    orderNumber: "SO-001",
    customer: "Alex Johnson",
    customerEmail: "alex@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    total: "$459.97",
    status: {
      label: "Shipped",
      variant: "primary-light",
    },
    items: [
      {
        id: "1-1",
        productName: "Wireless Headphones",
        category: "Electronics",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "1-2",
        productName: "Phone Case",
        category: "Accessories",
        price: "$99.99",
        quantity: 1,
      },
      {
        id: "1-3",
        productName: "Screen Protector",
        category: "Accessories",
        price: "$29.99",
        quantity: 2,
      },
      {
        id: "1-4",
        productName: "Charging Cable",
        category: "Electronics",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "1-5",
        productName: "Bluetooth Speaker",
        category: "Electronics",
        price: "$89.99",
        quantity: 1,
      },
      {
        id: "1-6",
        productName: "Phone Stand",
        category: "Accessories",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "1-7",
        productName: "Cable Management",
        category: "Accessories",
        price: "$19.99",
        quantity: 2,
      },
      {
        id: "1-8",
        productName: "Wireless Charger",
        category: "Electronics",
        price: "$49.99",
        quantity: 1,
      },
      {
        id: "1-9",
        productName: "Gaming Mouse",
        category: "Electronics",
        price: "$79.99",
        quantity: 1,
      },
      {
        id: "1-10",
        productName: "Gaming Keyboard",
        category: "Electronics",
        price: "$59.99",
        quantity: 1,
      },
      {
        id: "1-11",
        productName: "Mouse Pad",
        category: "Accessories",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "1-12",
        productName: "Desk Lamp",
        category: "Home",
        price: "$79.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "2",
    orderNumber: "SO-002",
    customer: "Sarah Chen",
    customerEmail: "sarah@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    total: "$249.48",
    status: {
      label: "Processing",
      variant: "info-light",
    },
    items: [
      {
        id: "2-1",
        productName: "Running Shoes",
        category: "Sports",
        price: "$89.99",
        quantity: 1,
      },
      {
        id: "2-2",
        productName: "Sports Socks",
        category: "Sports",
        price: "$59.51",
        quantity: 1,
      },
      {
        id: "2-3",
        productName: "Water Bottle",
        category: "Sports",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "2-4",
        productName: "Fitness Tracker",
        category: "Electronics",
        price: "$74.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "3",
    orderNumber: "SO-003",
    customer: "Michael Rodriguez",
    customerEmail: "michael@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    total: "$189.97",
    status: {
      label: "Delivered",
      variant: "success-light",
    },
    items: [
      {
        id: "3-1",
        productName: "Coffee Mug",
        category: "Home",
        price: "$89.99",
        quantity: 1,
      },
      {
        id: "3-2",
        productName: "Coffee Beans",
        category: "Food",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "3-3",
        productName: "Coffee Grinder",
        category: "Home",
        price: "$49.99",
        quantity: 1,
      },
      {
        id: "3-4",
        productName: "Milk Frother",
        category: "Home",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "3-5",
        productName: "Coffee Filter",
        category: "Home",
        price: "$9.99",
        quantity: 1,
      },
      {
        id: "3-6",
        productName: "Sugar Bowl",
        category: "Home",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "3-7",
        productName: "Tea Set",
        category: "Home",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "3-8",
        productName: "Creamer",
        category: "Food",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "3-9",
        productName: "Coffee Table",
        category: "Furniture",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "3-10",
        productName: "Placemats",
        category: "Home",
        price: "$12.99",
        quantity: 1,
      },
      {
        id: "3-11",
        productName: "Napkins",
        category: "Home",
        price: "$7.99",
        quantity: 1,
      },
      {
        id: "3-12",
        productName: "Candles",
        category: "Home",
        price: "$16.99",
        quantity: 1,
      },
      {
        id: "3-13",
        productName: "Vase",
        category: "Home",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "3-14",
        productName: "Flowers",
        category: "Home",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "3-15",
        productName: "Table Runner",
        category: "Home",
        price: "$18.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "4",
    orderNumber: "SO-004",
    customer: "Emma Wilson",
    customerEmail: "emma@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    total: "$299.97",
    status: {
      label: "Cancelled",
      variant: "destructive-light",
    },
    items: [
      {
        id: "4-1",
        productName: "Laptop Stand",
        category: "Electronics",
        price: "$99.99",
        quantity: 1,
      },
      {
        id: "4-2",
        productName: "Wireless Mouse",
        category: "Electronics",
        price: "$49.99",
        quantity: 1,
      },
      {
        id: "4-3",
        productName: "Keyboard",
        category: "Electronics",
        price: "$79.99",
        quantity: 1,
      },
      {
        id: "4-4",
        productName: "Monitor",
        category: "Electronics",
        price: "$69.99",
        quantity: 1,
      },
      {
        id: "4-5",
        productName: "Webcam",
        category: "Electronics",
        price: "$89.99",
        quantity: 1,
      },
      {
        id: "4-6",
        productName: "Microphone",
        category: "Electronics",
        price: "$59.99",
        quantity: 1,
      },
      {
        id: "4-7",
        productName: "Headphones",
        category: "Electronics",
        price: "$129.99",
        quantity: 1,
      },
      {
        id: "4-8",
        productName: "USB Hub",
        category: "Electronics",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "4-9",
        productName: "Cable Organizer",
        category: "Accessories",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "4-10",
        productName: "Desk Mat",
        category: "Office",
        price: "$24.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "5",
    orderNumber: "SO-005",
    customer: "David Kim",
    customerEmail: "david@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    total: "$179.97",
    status: {
      label: "Pending",
      variant: "warning-light",
    },
    items: [
      {
        id: "5-1",
        productName: "Desk Lamp",
        category: "Home",
        price: "$79.99",
        quantity: 1,
      },
      {
        id: "5-2",
        productName: "Desk Organizer",
        category: "Home",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "5-3",
        productName: "Notebook Set",
        category: "Office",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "5-4",
        productName: "Pen Set",
        category: "Office",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "5-5",
        productName: "Stapler",
        category: "Office",
        price: "$12.99",
        quantity: 1,
      },
      {
        id: "5-6",
        productName: "Paper Clips",
        category: "Office",
        price: "$4.99",
        quantity: 1,
      },
      {
        id: "5-7",
        productName: "Binder",
        category: "Office",
        price: "$8.99",
        quantity: 1,
      },
      {
        id: "5-8",
        productName: "Highlighter",
        category: "Office",
        price: "$6.99",
        quantity: 1,
      },
      {
        id: "5-9",
        productName: "Eraser",
        category: "Office",
        price: "$2.99",
        quantity: 1,
      },
      {
        id: "5-10",
        productName: "Ruler",
        category: "Office",
        price: "$3.99",
        quantity: 1,
      },
      {
        id: "5-11",
        productName: "Calculator",
        category: "Office",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "5-12",
        productName: "Calendar",
        category: "Office",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "5-13",
        productName: "Whiteboard",
        category: "Office",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "5-14",
        productName: "Markers",
        category: "Office",
        price: "$9.99",
        quantity: 1,
      },
      {
        id: "5-15",
        productName: "Push Pins",
        category: "Office",
        price: "$5.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "6",
    orderNumber: "SO-006",
    customer: "Aron Thompson",
    customerEmail: "lisa@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    total: "$329.95",
    status: {
      label: "Shipped",
      variant: "primary-light",
    },
    items: [
      {
        id: "6-1",
        productName: "Bluetooth Speaker",
        category: "Electronics",
        price: "$129.99",
        quantity: 1,
      },
      {
        id: "6-2",
        productName: "Phone Stand",
        category: "Accessories",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "6-3",
        productName: "Cable Management",
        category: "Accessories",
        price: "$19.99",
        quantity: 2,
      },
      {
        id: "6-4",
        productName: "Wireless Charger",
        category: "Electronics",
        price: "$49.99",
        quantity: 1,
      },
      {
        id: "6-5",
        productName: "Smart Watch",
        category: "Electronics",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "6-6",
        productName: "Fitness Band",
        category: "Electronics",
        price: "$79.99",
        quantity: 1,
      },
      {
        id: "6-7",
        productName: "Phone Case",
        category: "Accessories",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "6-8",
        productName: "Screen Protector",
        category: "Accessories",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "6-9",
        productName: "Car Mount",
        category: "Accessories",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "6-10",
        productName: "Power Bank",
        category: "Electronics",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "6-11",
        productName: "USB Cable",
        category: "Electronics",
        price: "$9.99",
        quantity: 1,
      },
      {
        id: "6-12",
        productName: "Adapter",
        category: "Electronics",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "6-13",
        productName: "Headphones",
        category: "Electronics",
        price: "$89.99",
        quantity: 1,
      },
      {
        id: "6-14",
        productName: "Earbuds",
        category: "Electronics",
        price: "$59.99",
        quantity: 1,
      },
      {
        id: "6-15",
        productName: "Microphone",
        category: "Electronics",
        price: "$49.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "7",
    orderNumber: "SO-007",
    customer: "James Brown",
    customerEmail: "james@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    total: "$159.96",
    status: {
      label: "Processing",
      variant: "info-light",
    },
    items: [
      {
        id: "7-1",
        productName: "Gaming Mouse",
        category: "Electronics",
        price: "$79.99",
        quantity: 1,
      },
      {
        id: "7-2",
        productName: "Gaming Keyboard",
        category: "Electronics",
        price: "$59.99",
        quantity: 1,
      },
      {
        id: "7-3",
        productName: "Mouse Pad",
        category: "Accessories",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "7-4",
        productName: "Gaming Headset",
        category: "Electronics",
        price: "$99.99",
        quantity: 1,
      },
      {
        id: "7-5",
        productName: "Gaming Chair",
        category: "Furniture",
        price: "$299.99",
        quantity: 1,
      },
      {
        id: "7-6",
        productName: "Gaming Desk",
        category: "Furniture",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "7-7",
        productName: "RGB Strip",
        category: "Electronics",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "7-8",
        productName: "Controller",
        category: "Electronics",
        price: "$49.99",
        quantity: 1,
      },
      {
        id: "7-9",
        productName: "Gaming Monitor",
        category: "Electronics",
        price: "$399.99",
        quantity: 1,
      },
      {
        id: "7-10",
        productName: "Graphics Card",
        category: "Electronics",
        price: "$599.99",
        quantity: 1,
      },
      {
        id: "7-11",
        productName: "RAM",
        category: "Electronics",
        price: "$89.99",
        quantity: 1,
      },
      {
        id: "7-12",
        productName: "SSD",
        category: "Electronics",
        price: "$129.99",
        quantity: 1,
      },
      {
        id: "7-13",
        productName: "CPU",
        category: "Electronics",
        price: "$299.99",
        quantity: 1,
      },
      {
        id: "7-14",
        productName: "Motherboard",
        category: "Electronics",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "7-15",
        productName: "Power Supply",
        category: "Electronics",
        price: "$149.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "8",
    orderNumber: "SO-008",
    customer: "Maria Garcia",
    customerEmail: "maria@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    total: "$89.97",
    status: {
      label: "Delivered",
      variant: "success-light",
    },
    items: [
      {
        id: "8-1",
        productName: "Yoga Mat",
        category: "Sports",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "8-2",
        productName: "Water Bottle",
        category: "Sports",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "8-3",
        productName: "Resistance Bands",
        category: "Sports",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "8-4",
        productName: "Dumbbells",
        category: "Sports",
        price: "$49.99",
        quantity: 1,
      },
      {
        id: "8-5",
        productName: "Kettlebell",
        category: "Sports",
        price: "$59.99",
        quantity: 1,
      },
      {
        id: "8-6",
        productName: "Jump Rope",
        category: "Sports",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "8-7",
        productName: "Foam Roller",
        category: "Sports",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "8-8",
        productName: "Exercise Ball",
        category: "Sports",
        price: "$34.99",
        quantity: 1,
      },
      {
        id: "8-9",
        productName: "Yoga Block",
        category: "Sports",
        price: "$12.99",
        quantity: 1,
      },
      {
        id: "8-10",
        productName: "Stretching Strap",
        category: "Sports",
        price: "$9.99",
        quantity: 1,
      },
      {
        id: "8-11",
        productName: "Gym Towel",
        category: "Sports",
        price: "$7.99",
        quantity: 1,
      },
      {
        id: "8-12",
        productName: "Sports Bra",
        category: "Clothing",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "8-13",
        productName: "Workout Shorts",
        category: "Clothing",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "8-14",
        productName: "Running Shoes",
        category: "Sports",
        price: "$89.99",
        quantity: 1,
      },
      {
        id: "8-15",
        productName: "Protein Shaker",
        category: "Sports",
        price: "$12.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "9",
    orderNumber: "SO-009",
    customer: "Nick Johnson",
    customerEmail: "nick@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
    total: "$199.98",
    status: {
      label: "Cancelled",
      variant: "destructive-light",
    },
    items: [
      {
        id: "9-1",
        productName: "Smart Watch",
        category: "Electronics",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "9-2",
        productName: "Watch Band",
        category: "Accessories",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "9-3",
        productName: "Charging Dock",
        category: "Electronics",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "9-4",
        productName: "Screen Protector",
        category: "Accessories",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "9-5",
        productName: "Case",
        category: "Accessories",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "9-6",
        productName: "Strap",
        category: "Accessories",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "9-7",
        productName: "Cable",
        category: "Electronics",
        price: "$9.99",
        quantity: 1,
      },
      {
        id: "9-8",
        productName: "Adapter",
        category: "Electronics",
        price: "$12.99",
        quantity: 1,
      },
      {
        id: "9-9",
        productName: "Mount",
        category: "Accessories",
        price: "$16.99",
        quantity: 1,
      },
      {
        id: "9-10",
        productName: "Stand",
        category: "Accessories",
        price: "$22.99",
        quantity: 1,
      },
      {
        id: "9-11",
        productName: "Cover",
        category: "Accessories",
        price: "$8.99",
        quantity: 1,
      },
      {
        id: "9-12",
        productName: "Grip",
        category: "Accessories",
        price: "$11.99",
        quantity: 1,
      },
      {
        id: "9-13",
        productName: "Lens",
        category: "Accessories",
        price: "$6.99",
        quantity: 1,
      },
      {
        id: "9-14",
        productName: "Filter",
        category: "Accessories",
        price: "$4.99",
        quantity: 1,
      },
      {
        id: "9-15",
        productName: "Cleaning Kit",
        category: "Accessories",
        price: "$7.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "10",
    orderNumber: "SO-010",
    customer: "Liam Thompson",
    customerEmail: "liam@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80",
    total: "$149.97",
    status: {
      label: "Pending",
      variant: "warning-light",
    },
    items: [
      {
        id: "10-1",
        productName: "Kitchen Knife Set",
        category: "Home",
        price: "$79.99",
        quantity: 1,
      },
      {
        id: "10-2",
        productName: "Cutting Board",
        category: "Home",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "10-3",
        productName: "Utensil Set",
        category: "Home",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "10-4",
        productName: "Dish Towels",
        category: "Home",
        price: "$12.99",
        quantity: 1,
      },
      {
        id: "10-5",
        productName: "Pot Holders",
        category: "Home",
        price: "$8.99",
        quantity: 1,
      },
      {
        id: "10-6",
        productName: "Trivet",
        category: "Home",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "10-7",
        productName: "Measuring Cups",
        category: "Home",
        price: "$16.99",
        quantity: 1,
      },
      {
        id: "10-8",
        productName: "Measuring Spoons",
        category: "Home",
        price: "$9.99",
        quantity: 1,
      },
      {
        id: "10-9",
        productName: "Mixing Bowls",
        category: "Home",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "10-10",
        productName: "Spatula",
        category: "Home",
        price: "$6.99",
        quantity: 1,
      },
      {
        id: "10-11",
        productName: "Whisk",
        category: "Home",
        price: "$4.99",
        quantity: 1,
      },
      {
        id: "10-12",
        productName: "Ladle",
        category: "Home",
        price: "$7.99",
        quantity: 1,
      },
      {
        id: "10-13",
        productName: "Tongs",
        category: "Home",
        price: "$11.99",
        quantity: 1,
      },
      {
        id: "10-14",
        productName: "Can Opener",
        category: "Home",
        price: "$13.99",
        quantity: 1,
      },
      {
        id: "10-15",
        productName: "Bottle Opener",
        category: "Home",
        price: "$5.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "11",
    orderNumber: "SO-011",
    customer: "Alex Johnson",
    customerEmail: "alex@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    total: "$279.96",
    status: {
      label: "Shipped",
      variant: "primary-outline",
    },
    items: [
      {
        id: "11-1",
        productName: "Office Chair",
        category: "Furniture",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "11-2",
        productName: "Desk Mat",
        category: "Office",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "11-3",
        productName: "Monitor Stand",
        category: "Electronics",
        price: "$59.99",
        quantity: 1,
      },
      {
        id: "11-4",
        productName: "Desk Lamp",
        category: "Office",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "11-5",
        productName: "Pen Holder",
        category: "Office",
        price: "$12.99",
        quantity: 1,
      },
      {
        id: "11-6",
        productName: "File Organizer",
        category: "Office",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "11-7",
        productName: "Stapler",
        category: "Office",
        price: "$16.99",
        quantity: 1,
      },
      {
        id: "11-8",
        productName: "Paper Clips",
        category: "Office",
        price: "$4.99",
        quantity: 1,
      },
      {
        id: "11-9",
        productName: "Binder",
        category: "Office",
        price: "$8.99",
        quantity: 1,
      },
      {
        id: "11-10",
        productName: "Highlighter",
        category: "Office",
        price: "$6.99",
        quantity: 1,
      },
      {
        id: "11-11",
        productName: "Eraser",
        category: "Office",
        price: "$2.99",
        quantity: 1,
      },
      {
        id: "11-12",
        productName: "Ruler",
        category: "Office",
        price: "$3.99",
        quantity: 1,
      },
      {
        id: "11-13",
        productName: "Calculator",
        category: "Office",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "11-14",
        productName: "Calendar",
        category: "Office",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "11-15",
        productName: "Whiteboard",
        category: "Office",
        price: "$24.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "12",
    orderNumber: "SO-012",
    customer: "Sarah Chen",
    customerEmail: "sarah@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    total: "$119.97",
    status: {
      label: "Processing",
      variant: "info-light",
    },
    items: [
      {
        id: "12-1",
        productName: "Skincare Set",
        category: "Beauty",
        price: "$59.99",
        quantity: 1,
      },
      {
        id: "12-2",
        productName: "Face Mask",
        category: "Beauty",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "12-3",
        productName: "Moisturizer",
        category: "Beauty",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "12-4",
        productName: "Cleanser",
        category: "Beauty",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "12-5",
        productName: "Toner",
        category: "Beauty",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "12-6",
        productName: "Serum",
        category: "Beauty",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "12-7",
        productName: "Eye Cream",
        category: "Beauty",
        price: "$34.99",
        quantity: 1,
      },
      {
        id: "12-8",
        productName: "Sunscreen",
        category: "Beauty",
        price: "$16.99",
        quantity: 1,
      },
      {
        id: "12-9",
        productName: "Exfoliant",
        category: "Beauty",
        price: "$22.99",
        quantity: 1,
      },
      {
        id: "12-10",
        productName: "Lip Balm",
        category: "Beauty",
        price: "$7.99",
        quantity: 1,
      },
      {
        id: "12-11",
        productName: "Hand Cream",
        category: "Beauty",
        price: "$12.99",
        quantity: 1,
      },
      {
        id: "12-12",
        productName: "Body Lotion",
        category: "Beauty",
        price: "$18.99",
        quantity: 1,
      },
      {
        id: "12-13",
        productName: "Shampoo",
        category: "Beauty",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "12-14",
        productName: "Conditioner",
        category: "Beauty",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "12-15",
        productName: "Hair Mask",
        category: "Beauty",
        price: "$19.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "13",
    orderNumber: "SO-013",
    customer: "Michael Rodriguez",
    customerEmail: "michael@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    total: "$89.98",
    status: {
      label: "Delivered",
      variant: "success-light",
    },
    items: [
      {
        id: "13-1",
        productName: "T-Shirt",
        category: "Clothing",
        price: "$19.99",
        quantity: 2,
      },
      {
        id: "13-2",
        productName: "Jeans",
        category: "Clothing",
        price: "$49.99",
        quantity: 1,
      },
      {
        id: "13-3",
        productName: "Hoodie",
        category: "Clothing",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "13-4",
        productName: "Sweater",
        category: "Clothing",
        price: "$34.99",
        quantity: 1,
      },
      {
        id: "13-5",
        productName: "Jacket",
        category: "Clothing",
        price: "$79.99",
        quantity: 1,
      },
      {
        id: "13-6",
        productName: "Shorts",
        category: "Clothing",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "13-7",
        productName: "Pants",
        category: "Clothing",
        price: "$44.99",
        quantity: 1,
      },
      {
        id: "13-8",
        productName: "Dress",
        category: "Clothing",
        price: "$59.99",
        quantity: 1,
      },
      {
        id: "13-9",
        productName: "Skirt",
        category: "Clothing",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "13-10",
        productName: "Blouse",
        category: "Clothing",
        price: "$34.99",
        quantity: 1,
      },
      {
        id: "13-11",
        productName: "Socks",
        category: "Clothing",
        price: "$9.99",
        quantity: 1,
      },
      {
        id: "13-12",
        productName: "Underwear",
        category: "Clothing",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "13-13",
        productName: "Hat",
        category: "Clothing",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "13-14",
        productName: "Scarf",
        category: "Clothing",
        price: "$16.99",
        quantity: 1,
      },
      {
        id: "13-15",
        productName: "Gloves",
        category: "Clothing",
        price: "$12.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "14",
    orderNumber: "SO-014",
    customer: "Emma Wilson",
    customerEmail: "emma@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    total: "$199.97",
    status: {
      label: "Shipped",
      variant: "primary-light",
    },
    items: [
      {
        id: "14-1",
        productName: "Tablet",
        category: "Electronics",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "14-2",
        productName: "Tablet Case",
        category: "Accessories",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "14-3",
        productName: "Screen Protector",
        category: "Accessories",
        price: "$14.99",
        quantity: 1,
      },
      {
        id: "14-4",
        productName: "Stylus",
        category: "Accessories",
        price: "$39.99",
        quantity: 1,
      },
      {
        id: "14-5",
        productName: "Keyboard",
        category: "Electronics",
        price: "$79.99",
        quantity: 1,
      },
      {
        id: "14-6",
        productName: "Mouse",
        category: "Electronics",
        price: "$49.99",
        quantity: 1,
      },
      {
        id: "14-7",
        productName: "Charging Cable",
        category: "Electronics",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "14-8",
        productName: "Power Adapter",
        category: "Electronics",
        price: "$24.99",
        quantity: 1,
      },
      {
        id: "14-9",
        productName: "Stand",
        category: "Accessories",
        price: "$34.99",
        quantity: 1,
      },
      {
        id: "14-10",
        productName: "Mount",
        category: "Accessories",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "14-11",
        productName: "Cover",
        category: "Accessories",
        price: "$16.99",
        quantity: 1,
      },
      {
        id: "14-12",
        productName: "Grip",
        category: "Accessories",
        price: "$11.99",
        quantity: 1,
      },
      {
        id: "14-13",
        productName: "Lens",
        category: "Accessories",
        price: "$6.99",
        quantity: 1,
      },
      {
        id: "14-14",
        productName: "Filter",
        category: "Accessories",
        price: "$4.99",
        quantity: 1,
      },
      {
        id: "14-15",
        productName: "Cleaning Kit",
        category: "Accessories",
        price: "$7.99",
        quantity: 1,
      },
    ],
  },
  {
    id: "15",
    orderNumber: "SO-015",
    customer: "David Kim",
    customerEmail: "david@example.com",
    customerAvatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    total: "$159.96",
    status: {
      label: "Pending",
      variant: "warning-light",
    },
    items: [
      {
        id: "15-1",
        productName: "Gaming Headset",
        category: "Electronics",
        price: "$99.99",
        quantity: 1,
      },
      {
        id: "15-2",
        productName: "Gaming Controller",
        category: "Electronics",
        price: "$59.99",
        quantity: 1,
      },
      {
        id: "15-3",
        productName: "Gaming Mouse",
        category: "Electronics",
        price: "$79.99",
        quantity: 1,
      },
      {
        id: "15-4",
        productName: "Gaming Keyboard",
        category: "Electronics",
        price: "$129.99",
        quantity: 1,
      },
      {
        id: "15-5",
        productName: "Gaming Chair",
        category: "Furniture",
        price: "$299.99",
        quantity: 1,
      },
      {
        id: "15-6",
        productName: "Gaming Desk",
        category: "Furniture",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "15-7",
        productName: "RGB Strip",
        category: "Electronics",
        price: "$29.99",
        quantity: 1,
      },
      {
        id: "15-8",
        productName: "Mouse Pad",
        category: "Accessories",
        price: "$19.99",
        quantity: 1,
      },
      {
        id: "15-9",
        productName: "Gaming Monitor",
        category: "Electronics",
        price: "$399.99",
        quantity: 1,
      },
      {
        id: "15-10",
        productName: "Graphics Card",
        category: "Electronics",
        price: "$599.99",
        quantity: 1,
      },
      {
        id: "15-11",
        productName: "RAM",
        category: "Electronics",
        price: "$89.99",
        quantity: 1,
      },
      {
        id: "15-12",
        productName: "SSD",
        category: "Electronics",
        price: "$129.99",
        quantity: 1,
      },
      {
        id: "15-13",
        productName: "CPU",
        category: "Electronics",
        price: "$299.99",
        quantity: 1,
      },
      {
        id: "15-14",
        productName: "Motherboard",
        category: "Electronics",
        price: "$199.99",
        quantity: 1,
      },
      {
        id: "15-15",
        productName: "Power Supply",
        category: "Electronics",
        price: "$149.99",
        quantity: 1,
      },
    ],
  },
]

// Sub-table component for order items
function OrderItemsSubTable({ items }: { items: OrderItemData[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5, // Show 3 items per page for sub-tables
  })

  const columns = useMemo<ColumnDef<OrderItemData>[]>(
    () => [
      {
        accessorKey: "productName",
        header: ({ column }) => (
          <DataGridColumnHeader title="Product" column={column} />
        ),
        cell: (info) => info.getValue() as string,
        enableSorting: true,
        size: 200,
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataGridColumnHeader title="Category" column={column} />
        ),
        cell: (info) => info.getValue() as string,
        enableSorting: true,
        size: 120,
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataGridColumnHeader title="Price" column={column} />
        ),
        cell: (info) => info.getValue() as string,
        enableSorting: true,
        size: 100,
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => (
          <DataGridColumnHeader title="Qty" column={column} />
        ),
        cell: (info) => info.getValue() as number,
        enableSorting: true,
        size: 80,
      },
    ],
    []
  )

  const table = useReactTable({
    data: items,
    columns,
    pageCount: Math.ceil(items.length / pagination.pageSize),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row: OrderItemData) => row.id,
  })

  return (
    <div className="bg-background p-4">
      <DataGrid
        table={table}
        recordCount={items.length}
        tableLayout={{
          cellBorder: true,
          rowBorder: true,
          headerBackground: true,
          headerBorder: true,
        }}
      >
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <ScrollArea>
              <DataGridTable />
            </ScrollArea>
          </DataGridContainer>
          <DataGridPagination className="pb-1.5" />
        </div>
      </DataGrid>
    </div>
  )
}

export default function Pattern() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [expandedRows, setExpandedRows] = useState<ExpandedState>({})
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "expand",
    "orderNumber",
    "customer",
    "total",
    "status",
  ])

  const columns = useMemo<ColumnDef<Data>[]>(
    () => [
      {
        id: "expand",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button
              onClick={row.getToggleExpandedHandler()}
              size="icon-xs"
              variant="ghost"
              className="opacity-70 hover:bg-transparent hover:opacity-100"
            >
              {row.getIsExpanded() ? (
                <IconPlaceholder
                  lucide="SquareMinusIcon"
                  tabler="IconSquareMinus"
                  hugeicons="MinusSignSquareIcon"
                  phosphor="MinusSquareIcon"
                  remixicon="RiCheckboxIndeterminateLine"
                  className="size-3.5"
                />
              ) : (
                <IconPlaceholder
                  lucide="SquarePlusIcon"
                  tabler="IconSquarePlus"
                  hugeicons="AddSquareIcon"
                  phosphor="PlusSquareIcon"
                  remixicon="RiAddBoxLine"
                  className="size-3.5"
                />
              )}
            </Button>
          ) : null
        },
        size: 25,
        enableResizing: false,
        meta: {
          expandedContent: (row) => <OrderItemsSubTable items={row.items} />,
        },
      },
      {
        accessorKey: "customer",
        id: "customer",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Customer"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage
                  src={row.original.customerAvatar}
                  alt={row.original.customer}
                />
                <AvatarFallback>
                  {row.original.customer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="text-foreground font-medium">
                  {row.original.customer}
                </div>
                <div className="text-muted-foreground">
                  {row.original.customerEmail}
                </div>
              </div>
            </div>
          )
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 200,
      },
      {
        accessorKey: "items",
        id: "items",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Items"
            visibility={true}
            column={column}
          />
        ),
        cell: (info) => {
          const items = info.getValue() as OrderItemData[]
          const itemCount = items.length
          return (
            <div
              className="text-foreground hover:text-primary cursor-pointer text-sm font-medium"
              onClick={() => info.row.getToggleExpandedHandler()()}
            >
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </div>
          )
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 120,
      },
      {
        accessorKey: "total",
        id: "total",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Total"
            visibility={true}
            column={column}
          />
        ),
        cell: (info) => info.getValue() as string,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 100,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Status"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status
          return <Badge variant={status.variant}>{status.label}</Badge>
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 120,
      },
    ],
    []
  )

  const table = useReactTable({
    columns,
    data: demoData,
    pageCount: Math.ceil((demoData?.length || 0) / pagination.pageSize),
    getRowId: (row: Data) => row.id,
    getRowCanExpand: (row) =>
      Boolean(row.original.items && row.original.items.length > 0),
    state: {
      pagination,
      sorting,
      expanded: expandedRows,
      columnOrder,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpandedRows,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DataGrid
      table={table}
      recordCount={demoData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
        <DataGridPagination />
      </div>
    </DataGrid>
  )
}
