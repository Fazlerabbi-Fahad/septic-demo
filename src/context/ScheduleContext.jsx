import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { scrollToTarget } from "../lib/motion.js";

const ScheduleContext = createContext(null);

/**
 * Lets any CTA pre-select a service in the schedule form and scroll to it.
 * `request` carries a nonce so choosing the same service twice still applies.
 */
export function ScheduleProvider({ children }) {
  const [request, setRequest] = useState(null);

  const openSchedule = useCallback((service) => {
    if (service) setRequest({ service, nonce: Date.now() });
    scrollToTarget("#schedule");
  }, []);

  const value = useMemo(() => ({ request, openSchedule }), [request, openSchedule]);
  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

export const useSchedule = () => useContext(ScheduleContext);

/** Anchor that works without JS (#schedule) and pre-selects a service with it. */
export function ScheduleLink({ service, className, children, onClick, ...rest }) {
  const { openSchedule } = useSchedule();
  return (
    <a
      href="#schedule"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        openSchedule(service);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
