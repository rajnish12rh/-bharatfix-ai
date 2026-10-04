import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navItems } from '../../utils/navItems'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'
import { Logo } from './Logo'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-navy-50 hover:text-navy-900',
                  isActive && 'bg-navy-50 text-navy-900',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Button to="/report" className="ml-2">
            Report a Problem
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-navy-900 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-navy-50',
                    isActive && 'bg-navy-50 text-navy-900',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button to="/report" className="mt-2 w-full" onClick={() => setOpen(false)}>
              Report a Problem
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
