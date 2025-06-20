"use client"

import { BarChart3, Package, Users, UserCheck, DollarSign, ShoppingCart, Home, FolderTree } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "Danh mục",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Sản phẩm",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Nhân viên",
    url: "/admin/staff",
    icon: UserCheck,
  },
  {
    title: "Khách hàng",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Doanh thu",
    url: "/admin/revenue",
    icon: DollarSign,
  },
  {
    title: "Đơn hàng",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
]

export function AdminSidebar() {
  return (
    <Sidebar className="bg-gray-900 border-r border-gray-800">
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
