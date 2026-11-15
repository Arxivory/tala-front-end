import { useState, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Home,
  Dumbbell,
  PersonStanding,
  TrendingUp,
  ClipboardCheck,
  Sparkles,
  RefreshCcw,
  Users,
  Settings,
  Bell,
  Sun,
  Moon,
  Monitor,
  CloudOff,
  MoreHorizontal,
  ChevronRight,
  LogOut,
  UserRoundCog,
  Check,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo, LogoMark } from "./Logo";
import { Mascot } from "./newLogo";
import { DemoTag } from "./DemoTag";

import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-state";
import { useTheme, type ThemeMode } from "@/lib/theme";
import { MISSION_NAME, CURRENT_MISSION_DAY } from "@/data/sessions";
import { crew } from "@/data/crew";
import type { GravityRegime } from "@/data/types";

interface NavItem {
  to: string;
  label: string;
  short?: string;
  icon: typeof Home;
  cmoOnly?: boolean;
}

const NAV: NavItem[] = [
  { to: "/app", label: "Home", icon: Home, short: "Home" },
  { to: "/app/session", label: "Session", icon: Dumbbell, short: "Session" },
  { to: "/app/body", label: "Body Map", icon: PersonStanding, short: "Body" },
  { to: "/app/trends", label: "Trends", icon: TrendingUp, short: "Trends" },
  { to: "/app/checkin", label: "Check-in", icon: ClipboardCheck },
  { to: "/app/assistant", label: "Assistant", icon: Sparkles, short: "Assistant" },
  { to: "/app/crew", label: "Crew", icon: Users, cmoOnly: true },
];

const MOBILE_TABS = NAV.slice(0, 5);

const GRAVITY_OPTIONS: { value: GravityRegime; label: string }[] = [
  { value: "0g", label: "0g" },
  { value: "0.16g", label: "0.16g Lunar" },
  { value: "0.38g", label: "0.38g Mars" },
  { value: "1g", label: "1g Ref" },
];

const MOCK_ALERTS = [
  { id: "a1", level: "anomaly", text: "Lumbar moment flagged in session s-anomaly", time: "Today, 06:12" },
  { id: "a2", level: "info", text: "Check-in recorded. Readiness: Take it easy.", time: "Today, 05:30" },
  { id: "a3", level: "caution", text: "Sync bundle BND-0421 retrying", time: "Yesterday, 21:04" },
];

const alertDot: Record<string, string> = {
  anomaly: "bg-status-anomaly",
  caution: "bg-status-caution",
  info: "bg-sky-500",
};

function initials(name: string) {
  return name
    .replace(/^(Dr|Mr|Ms)\.?\s+/i, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function isActive(pathname: string, to: string) {
  return to === "/app" ? pathname === "/app" : pathname.startsWith(to);
}

function NavIcon({ item, active, expanded }: { item: NavItem; active: boolean; expanded: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 w-full items-center gap-3 rounded-full px-[14px] transition-colors duration-200",
        active
          ? "bg-primary-100 text-strong"
          : "text-body hover:bg-primary-100/60 hover:text-strong",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span
        className={cn(
          "whitespace-nowrap text-sm font-medium transition-opacity duration-200",
          expanded ? "opacity-100" : "opacity-0",
        )}
      >
        {item.label}
      </span>
      {expanded ? <ChevronRight className="ml-auto size-4 opacity-40" aria-hidden="true" /> : null}
    </Link>
  );
}

function ThemeMenu() {
  const { mode, setMode } = useTheme();
  const items: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "night", label: "Night", icon: Moon },
    { value: "auto", label: "Auto", icon: Monitor },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full text-body transition-colors hover:bg-primary-100 hover:text-strong"
          aria-label="Theme: light, night or auto"
        >
          {mode === "night" ? <Moon className="size-4.5" /> : mode === "auto" ? <Monitor className="size-4.5" /> : <Sun className="size-4.5" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {items.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setMode(value)} className="gap-2">
            <Icon className="size-4" aria-hidden="true" />
            {label}
            {mode === value ? <Check className="ml-auto size-4" aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationsMenu() {
  const [read, setRead] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full text-body transition-colors hover:bg-primary-100 hover:text-strong"
          aria-label={`Notifications, ${read ? "all read" : "3 unread"}`}
        >
          <Bell className="size-4.5" />
          {!read ? (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary-700" aria-hidden="true" />
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          <button
            type="button"
            className="text-xs font-medium text-primary-700 hover:underline"
            onClick={() => setRead(true)}
          >
            Mark all read
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MOCK_ALERTS.map((a) => (
          <DropdownMenuItem key={a.id} className="flex-col items-start gap-1 py-2.5">
            <span className="flex items-center gap-2 text-sm text-strong">
              <span className={cn("size-2 shrink-0 rounded-full", alertDot[a.level])} aria-hidden="true" />
              {a.text}
            </span>
            <span className="pl-4 text-xs text-muted-foreground">{a.time}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu() {
  const { currentUser, role, setRole, setCurrentUserById, signOut, demoMode } = useApp();
  const router = useRouter();
  const [switchOpen, setSwitchOpen] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 transition-colors hover:bg-primary-100/50"
          aria-label="Profile menu"
        >
          <Avatar className="size-7">
            <AvatarFallback className="bg-lilac-100 text-xs font-semibold text-strong">
              {initials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium text-strong sm:inline">{currentUser.name.split(" ")[0]}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <span className="block text-sm font-semibold text-strong">{currentUser.name}</span>
          <span className="text-xs font-normal text-muted-foreground">{currentUser.title}</span>
          <span className="mt-1 inline-flex rounded-full border border-lilac-300/70 bg-lilac-100 px-2 py-0.5 text-[11px] font-medium text-body">
            {role === "cmo" ? "Crew Medical Officer" : "Astronaut"}
          </span>
          {demoMode ? <DemoTag className="ml-2 align-middle" label="Demo mode" /> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Dialog open={switchOpen} onOpenChange={setSwitchOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem className="gap-2" onSelect={(e) => e.preventDefault()}>
              <UserRoundCog className="size-4" aria-hidden="true" />
              Switch crew member
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-display text-strong">Switch crew member</DialogTitle>
              <DialogDescription>
                Choose whose data this device shows. Session records stay separate per person.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {crew.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCurrentUserById(c.id);
                    setSwitchOpen(false);
                    router.navigate({ to: "/app" });
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-primary-100/50",
                    c.id === currentUser.id && "border-primary-300 bg-primary-100/50",
                  )}
                >
                  <span>
                    <span className="block text-sm font-semibold text-strong">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.title}</span>
                  </span>
                  {c.id === currentUser.id ? (
                    <Check className="size-4 text-primary-700" aria-hidden="true" />
                  ) : null}
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenuItem
          className="gap-2"
          onClick={() => setRole(role === "cmo" ? "astronaut" : "cmo")}
        >
          <UserRoundCog className="size-4" aria-hidden="true" />
          View as {role === "cmo" ? "Astronaut" : "CMO"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2"
          onClick={() => {
            signOut();
            router.navigate({ to: "/signin" });
          }}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Global portal shell: expanding navigation rail (desktop/tablet landscape),
 * bottom tab bar with a "More" sheet (tablet portrait / phone), and the top
 * bar with mission chip, gravity regime, connectivity, theme, alerts and
 * profile.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { gravity, setGravity, role, connectivity, demoMode } = useApp();
  const [railPinned, setRailPinned] = useState(false);
  const [railHover, setRailHover] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const expanded = railPinned || railHover;

  // React Router v1 SSR: reading location from the hook is safe on both sides.
  const router = useRouter();
  const pathname = router.state.location.pathname;

  const visibleNav = NAV.filter((n) => !n.cmoOnly || role === "cmo");
  const moreItems = visibleNav.filter((n) => !MOBILE_TABS.some((t) => t.to === n.to));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Navigation rail (desktop and tablet landscape) */}
      <aside
        onMouseEnter={() => setRailHover(true)}
        onMouseLeave={() => setRailHover(false)}
        className={cn(
          "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-border bg-raised py-4 transition-[width] duration-200 ease-out md:flex",
          expanded ? "w-60 px-3" : "w-[72px] px-3",
        )}
        aria-label="Primary navigation"
      >
        <button
          type="button"
          onClick={() => setRailPinned((p) => !p)}
          className="mb-4 flex items-center gap-2 rounded-xl px-1.5 py-1 text-left"
          aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
        >
          <Mascot size={36} />
          <span
            className={cn(
              "whitespace-nowrap font-display text-lg font-extrabold tracking-wide text-strong transition-opacity duration-200",
              expanded ? "opacity-100" : "opacity-0",
            )}
          >
            TALA
          </span>
        </button>
        <nav className="flex flex-1 flex-col gap-1">
          {visibleNav.map((item) => (
            <NavIcon key={item.to} item={item} active={isActive(pathname, item.to)} expanded={expanded} />
          ))}
        </nav>
        <p
          className={cn(
            "px-2 text-[11px] leading-snug text-muted-foreground transition-opacity duration-200",
            expanded ? "opacity-100" : "opacity-0",
          )}
        >
          Gravity selection highlights precomputed context only.
        </p>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md sm:gap-3 sm:px-5">
          <Link to="/app" className="flex items-center gap-2 md:hidden" aria-label="TALA home">
            <Mascot size={28} />
          </Link>
          <span className="hidden items-center gap-2 rounded-full border border-border bg-raised px-3 py-1.5 text-xs font-medium text-body sm:inline-flex">
            <span className="size-1.5 rounded-full bg-primary-500" aria-hidden="true" />
            {MISSION_NAME}, Day {CURRENT_MISSION_DAY}
          </span>
          <ToggleGroup
            type="single"
            value={gravity}
            onValueChange={(v) => v && setGravity(v as GravityRegime)}
            className="hidden rounded-full border border-border bg-raised p-1 sm:inline-flex"
            aria-label="Selected gravity scenario for precomputed context"
          >
            {GRAVITY_OPTIONS.map((g) => (
              <ToggleGroupItem
                key={g.value}
                value={g.value}
                aria-label={g.label}
                className="rounded-full px-2.5 py-1 text-xs font-medium text-body data-[state=on]:bg-card data-[state=on]:text-strong data-[state=on]:shadow-sm"
              >
                {g.value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <span className="hidden items-center gap-2 lg:inline-flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-100/70 px-2.5 py-1 text-xs font-medium text-body">
              <CloudOff className="size-3.5" aria-hidden="true" />
              Offline, {connectivity.queued} bundles queued
            </span>
            <DemoTag />
          </span>
          <div className="ml-auto flex items-center gap-1">
            {demoMode ? (
              <span className="mr-1 inline-flex items-center rounded-full border border-dashed border-primary-500 px-2 py-0.5 text-xs font-semibold text-primary-700">
                Demo
              </span>
            ) : null}
            <NotificationsMenu />
            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-6">{children}</main>
      </div>

      {/* Bottom tab bar (tablet portrait and phone) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        aria-label="Primary navigation"
      >
        {MOBILE_TABS.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium",
                active ? "text-primary-700" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.short ?? item.label}
            </Link>
          );
        })}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium text-muted-foreground"
              aria-label="More sections"
            >
              <MoreHorizontal className="size-5" aria-hidden="true" />
              More
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle className="font-display text-strong">More</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 pb-6">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-body hover:bg-primary-100/60"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    {item.label}
                    <ChevronRight className="ml-auto size-4 opacity-40" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
