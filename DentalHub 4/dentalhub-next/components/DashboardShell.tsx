"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";
import { signOut } from "../lib/auth";
import { useDisplayName } from "../lib/profile";
import { useToast } from "./ToastProvider";

type NavLink = { name: string; href: string; icon: string; count?: string; badge?: string };

const workspaceLinks: NavLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: "◫" },
  { name: "My Learning", href: "/my-learning", icon: "▤", count: "3" },
  { name: "Case Library", href: "/case-library", icon: "▧" },
  { name: "X-Ray Trainer", href: "/x-ray-trainer", icon: "◎", badge: "NEW" },
  { name: "AI Study Tools", href: "/ai-study-tools", icon: "✳" },
  { name: "My Progress", href: "/my-progress", icon: "↗" },
  { name: "Bookmarks", href: "/bookmarks", icon: "☆" },
  { name: "Study Notes", href: "/study-notes", icon: "▧" },
  { name: "Daily Challenge", href: "/daily-challenge", icon: "✳" },
];

const settingsLink: NavLink = { name: "Settings", href: "/settings", icon: "⚙" };

const dateFormatter = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" });

// Client-only date so server and browser output never disagree.
function useTodayLabel() {
  return useSyncExternalStore(
    () => () => {},
    () => dateFormatter.format(new Date()),
    () => "Your learning day",
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [userName] = useDisplayName();
  const today = useTodayLabel();

  const initial = userName.trim().charAt(0).toUpperCase() || "S";
  const current = [...workspaceLinks, settingsLink].find((link) => isActive(pathname, link.href));

  async function handleLogout() {
    await signOut();
    showToast("You have logged out.");
    router.replace("/login");
  }

  function showAccountOptions() {
    showToast("To leave your workspace, select Log out in the sidebar.");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand sidebar-brand" href="/dashboard" aria-label="DentalHub dashboard">
          <Image
            className="brand-image sidebar-brand-image"
            src="/dentalhub-logo.png"
            alt="DentalHub logo"
            width={1107}
            height={973}
            priority
          />
        </Link>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="side-nav">
          {workspaceLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`nav-link ${isActive(pathname, link.href) ? "active" : ""}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.name}
              {link.count && <span className="nav-count">{link.count}</span>}
              {link.badge && <span className="nav-new">{link.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-label secondary-label">PREFERENCES</div>

        <nav className="side-nav">
          <Link
            href={settingsLink.href}
            className={`nav-link ${isActive(pathname, settingsLink.href) ? "active" : ""}`}
          >
            <span className="nav-icon">{settingsLink.icon}</span>Settings
          </Link>

          <button className="nav-link" onClick={handleLogout}>
            <span className="nav-icon">↪</span>Log out
          </button>
        </nav>

        <div className="sidebar-spacer"></div>

        <div className="sidebar-help">
          <div className="help-icon">✦</div>
          <strong>Keep learning.</strong>
          <p>Small steps today. Better skills tomorrow.</p>
          <button onClick={() => router.push("/my-learning")}>
            Explore courses <span>→</span>
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="avatar">{initial}</div>
          <div className="profile-copy">
            <strong>{userName}</strong>
            <span>Dental student</span>
          </div>
          <button className="profile-menu" aria-label="Account options" onClick={showAccountOptions}>
            ···
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="crumb-slash">/</span>
            <strong>{current?.name ?? "Dashboard"}</strong>
          </div>

          <div className="topbar-actions">
            <div className="date-chip">
              <span>◷</span>
              <span>{today}</span>
            </div>

            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => showToast("You're all caught up! No new notifications.")}
            >
              ♧<i></i>
            </button>

            <button className="top-avatar" aria-label="Account menu" onClick={showAccountOptions}>
              {initial}
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
