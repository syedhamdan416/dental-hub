
"use client";

import type { ReactNode } from "react";

type DashboardShellProps = {
  children: ReactNode;
  activePage: string;
  userName: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

const workspaceLinks = [
  { name: "Dashboard", icon: "◫" },
  { name: "My Learning", icon: "▤", count: "3" },
  { name: "Case Library", icon: "▧" },
  { name: "X-Ray Trainer", icon: "◎", badge: "NEW" },
  { name: "AI Study Tools", icon: "✳" },
  { name: "My Progress", icon: "↗" },
  { name: "Bookmarks", icon: "☆" },
  { name: "Study Notes", icon: "▧" },
  { name: "Daily Challenge", icon: "✳" },
];

export default function DashboardShell({
  children,
  activePage,
  userName,
  onNavigate,
  onLogout,
}: DashboardShellProps) {
  const initial = userName.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand sidebar-brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("Dashboard");
          }}
          aria-label="DentalHub dashboard"
        >
          <img
            className="brand-image sidebar-brand-image"
            src="/original-frontend/assets/dentalhub-logo.png"
            alt="DentalHub logo"
          />
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="side-nav">
          {workspaceLinks.map((link) => (
            <button
              key={link.name}
              className={`nav-link ${activePage === link.name ? "active" : ""}`}
              onClick={() => onNavigate(link.name)}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.name}
              {link.count && <span className="nav-count">{link.count}</span>}
              {link.badge && <span className="nav-new">{link.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-label secondary-label">PREFERENCES</div>

        <nav className="side-nav">
          <button
            className={`nav-link ${activePage === "Settings" ? "active" : ""}`}
            onClick={() => onNavigate("Settings")}
          >
            <span className="nav-icon">⚙</span>Settings
          </button>

          <button className="nav-link" onClick={onLogout}>
            <span className="nav-icon">↪</span>Log out
          </button>
        </nav>

        <div className="sidebar-spacer"></div>

        <div className="sidebar-help">
          <div className="help-icon">✦</div>
          <strong>Keep learning.</strong>
          <p>Small steps today. Better skills tomorrow.</p>
          <button onClick={() => onNavigate("My Learning")}>
            Explore courses <span>→</span>
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="avatar">{initial}</div>
          <div className="profile-copy">
            <strong>{userName || "Student"}</strong>
            <span>Dental student</span>
          </div>
          <button className="profile-menu" aria-label="Account options">
            ···
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="crumb-slash">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="date-chip">
              <span>◷</span>
              <span>Your learning day</span>
            </div>

            <button
              className="icon-button notification-button"
              aria-label="Notifications"
            >
              ♧<i></i>
            </button>

            <button className="top-avatar" aria-label="Account menu">
              {initial}
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
