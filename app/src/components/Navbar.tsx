import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  BookOpen,
  TrendingUp,
  Settings as SettingsIcon,
  Plus,
  Compass,
} from "lucide-react";

interface NavbarProps {
  onOpenQuickAdd?: () => void;
}

export function Navbar({ onOpenQuickAdd }: NavbarProps) {
  const location = useLocation();
  const [timeString, setTimeString] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
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
    { to: "/ledger", label: "Ledger", icon: BookOpen },
    { to: "/prediction", label: "Predictions", icon: TrendingUp },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
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
          <Link to="/" className="navbar-brand" title="Financial Observatory">
            <div className="brand-icon-shield">
              <Compass size={13} strokeWidth={2.2} />
            </div>
            <span className="brand-title">Financial Observatory</span>
            <span className="brand-badge">PRO</span>
          </Link>

          <nav className="navbar-routes" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="navbar-actions">
            <div className="system-status-indicator" title="System Operational — All telemetry live">
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
                <span>Log Movement</span>
              </button>
            ) : (
              <Link to="/add-expense" className="button button-primary" style={{ fontSize: "12.5px" }}>
                <Plus size={13} strokeWidth={2.5} />
                <span>Log Movement</span>
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
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <div className="mobile-nav-grid">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mobile-nav-item ${isActive ? "active" : ""}`}
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
