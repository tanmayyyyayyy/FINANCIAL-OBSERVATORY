import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  BookOpen,
  TrendingUp,
  Settings as SettingsIcon,
  Plus,
  LogOut,
  Receipt,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ObservatoryMark } from "./ObservatoryMark";
import { UserAvatar } from "./UserAvatar";

interface NavbarProps {
  onOpenQuickAdd?: () => void;
  onOpenCommandPalette?: () => void;
}

export function Navbar({ onOpenQuickAdd, onOpenCommandPalette }: NavbarProps) {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [timeString, setTimeString] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const commandShortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K";

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 4);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/budgets", label: "Budgets", icon: PieChart },
    { to: "/ledger", label: "Transactions", icon: BookOpen },
    { to: "/prediction", label: "Plan", icon: TrendingUp },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ];
  const mobileLinks = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/budgets", label: "Budgets", icon: PieChart },
    { to: "/add-expense", label: "Add", icon: Plus },
    { to: "/ledger", label: "Transactions", icon: Receipt },
    { to: "/prediction", label: "Plan", icon: TrendingUp },
  ];

  return (
    <>
      {/* Desktop Sticky Header */}
      <header
        className="top-navbar-wrapper"
        style={{
          borderBottomColor: scrolled ? "var(--border-medium)" : "var(--border-subtle)",
        }}
      >
        <div className="top-navbar">
          <Link to="/dashboard" className="navbar-brand" title="Financial Observatory">
            <div className="brand-icon-shield">
              <ObservatoryMark size={21} />
            </div>
            <span className="brand-title">Financial Observatory</span>
          </Link>

          <nav className="navbar-routes" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="navbar-actions">
            {onOpenCommandPalette && <button type="button" className="navbar-search-trigger" onClick={onOpenCommandPalette} aria-label="Open quick navigation" aria-keyshortcuts="Meta+K Control+K"><span>Search</span><kbd>{commandShortcut}</kbd></button>}
            {user && <Link to="/settings" className="navbar-account" aria-label="Account settings">
              <UserAvatar user={user} />
              <span>{user.displayName || user.email}</span>
            </Link>}
            <div className="system-status-indicator" title="Current local time">
              <span className="status-pulse" />
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{timeString || "LIVE"}</span>
            </div>

            {onOpenQuickAdd ? (
              <button
                type="button"
                className="button button-primary"
                onClick={onOpenQuickAdd}
                style={{ fontSize: "12.5px" }}
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Add transaction</span>
              </button>
            ) : (
              <Link to="/add-expense" className="button button-primary" style={{ fontSize: "12.5px" }}>
                <Plus size={13} strokeWidth={2.5} />
                <span>Add transaction</span>
              </Link>
            )}

            <Link
              to="/settings"
              className="button-icon"
              title="Account & System Settings"
              style={{
                color: location.pathname === "/settings" ? "var(--text-primary)" : undefined,
                borderColor: location.pathname === "/settings" ? "var(--border-medium)" : undefined,
              }}
            >
              <SettingsIcon size={14} />
            </Link>
            <button
              type="button"
              className="button-icon"
              title="Sign out"
              aria-label="Sign out"
              onClick={() => void signOut().catch(() => undefined)}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <div className="mobile-nav-grid">
          {mobileLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mobile-nav-item ${item.to === "/add-expense" ? "mobile-nav-add" : ""} ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label === "Add" ? "Add money in or out" : item.label}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.7} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
