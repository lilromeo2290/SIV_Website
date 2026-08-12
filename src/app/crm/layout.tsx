'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Activity,
  FileText,
  Calculator,
  Receipt,
  MessageSquare,
  Cake,
  Megaphone,
  BarChart3,
  Settings,
  ArrowLeft,
  Menu,
  Search,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/crm', icon: LayoutDashboard },
  { label: 'Client Management', href: '/crm/clients', icon: Users },
  { label: 'Service Requests', href: '/crm/services', icon: Wrench },
  { label: 'Diagnostics', href: '/crm/diagnostics', icon: Activity },
  { label: 'Contracts', href: '/crm/contracts', icon: FileText },
  { label: 'Quotations', href: '/crm/quotations', icon: Calculator },
  { label: 'Invoices', href: '/crm/invoices', icon: Receipt },
  { label: 'Messaging Center', href: '/crm/messaging', icon: MessageSquare },
  { label: 'Birthday Wishes', href: '/crm/birthdays', icon: Cake },
  { label: 'Marketing Campaigns', href: '/crm/campaigns', icon: Megaphone },
  { label: 'Reports', href: '/crm/reports', icon: BarChart3 },
  { label: 'Settings', href: '/crm/settings', icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-700/50 px-5 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
          S
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-tight">
            SIV Engineering
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            CRM Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/crm'
                ? pathname === '/crm'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0',
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-blue-200" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Back to Website */}
      <div className="border-t border-slate-700/50 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
        >
          <ArrowLeft className="h-[18px] w-[18px] shrink-0" />
          <span>Back to Website</span>
        </Link>
      </div>
    </div>
  );
}

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">CRM Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search clients, requests, invoices..."
              className="h-9 pl-9 text-sm"
            />
          </div>

          {/* User Avatar */}
          <div className="ml-auto flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="bg-blue-100 text-sm font-semibold text-blue-700">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
