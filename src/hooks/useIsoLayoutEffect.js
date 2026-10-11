import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect in the browser, useEffect during prerender (avoids SSR warnings). */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export default useIsoLayoutEffect;
