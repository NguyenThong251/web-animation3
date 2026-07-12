"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AnimationContextValue {
  isLoaderFinished: boolean;
  isTransitionFinished: boolean;
  setLoaderFinished: (value: boolean) => void;
  setTransitionFinished: (value: boolean) => void;
  isPageReady: boolean;
  scrollTarget: string | null;
  setScrollTarget: (value: string | null) => void;
}

const AnimationContext = createContext<AnimationContextValue>({
  isLoaderFinished: false,
  isTransitionFinished: true,
  setLoaderFinished: () => {},
  setTransitionFinished: () => {},
  isPageReady: false,
  scrollTarget: null,
  setScrollTarget: () => {},
});

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const [isTransitionFinished, setIsTransitionFinished] = useState(true);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  const setLoaderFinished = useCallback((value: boolean) => {
    setIsLoaderFinished(value);
  }, []);

  const setTransitionFinished = useCallback((value: boolean) => {
    setIsTransitionFinished(value);
  }, []);

  const isPageReady = useMemo(
    () => isLoaderFinished && isTransitionFinished,
    [isLoaderFinished, isTransitionFinished],
  );

  return (
    <AnimationContext.Provider
      value={{
        isLoaderFinished,
        isTransitionFinished,
        setLoaderFinished,
        setTransitionFinished,
        isPageReady,
        scrollTarget,
        setScrollTarget,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export const useAnimation = () => useContext(AnimationContext);
