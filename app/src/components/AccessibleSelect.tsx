import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function AccessibleSelect({ value, options, onChange, label, placeholder }: { value: string; options: readonly string[]; onChange: (value: string) => void; label: string; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(Math.max(0, options.indexOf(value)));
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault(); event.stopPropagation();
      if (!open) setOpen(true);
      setActive((current) => (current + (event.key === "ArrowDown" ? 1 : options.length - 1)) % options.length);
    }
    if (event.key === "Enter" && open) {
      event.preventDefault(); event.stopPropagation();
      const selected = options[active]; if (selected !== undefined) onChange(selected);
      setOpen(false); trigger.current?.focus();
    }
  }

  return <div className="accessible-select" ref={root} onKeyDown={onKeyDown} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}>
    <button ref={trigger} type="button" className="accessible-select-trigger" role="combobox" aria-label={label} aria-expanded={open} aria-controls={listId} aria-activedescendant={open ? `${listId}-${active}` : undefined} aria-haspopup="listbox" onClick={() => { setActive(Math.max(0, options.indexOf(value))); setOpen((current) => !current); }}>
      <span>{value || placeholder || "Choose an option"}</span><ChevronDown size={15} aria-hidden="true" />
    </button>
    <AnimatePresence>{open && <motion.div id={listId} className="accessible-select-popover" role="listbox" aria-label={label} initial={reduceMotion ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -3 }} transition={{ duration: reduceMotion ? 0 : 0.14 }}>
      {options.map((option, index) => <button id={`${listId}-${index}`} key={option} type="button" role="option" aria-selected={value === option} data-active={active === index} className="accessible-select-option" onMouseEnter={() => setActive(index)} onClick={() => { onChange(option); setOpen(false); trigger.current?.focus(); }} tabIndex={-1}>{option}</button>)}
    </motion.div>}</AnimatePresence>
  </div>;
}
