/**
 * Stores — Interactive Bot Tour State Store
 */
import { useState, useEffect } from 'react';

type TourState = {
  open: boolean;
  step: number;
};

let state: TourState = {
  open: false,
  step: 0,
};

let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export const tourStore = {
  getState: () => state,
  setOpen: (open: boolean) => {
    state.open = open;
    notify();
  },
  setStep: (step: number) => {
    state.step = step;
    notify();
  },
  nextStep: (max: number) => {
    if (state.step < max - 1) {
      state.step += 1;
      notify();
    } else {
      state.open = false;
      state.step = 0;
      notify();
      if (typeof window !== "undefined") localStorage.setItem("safer-tour-seen", "1");
    }
  },
  prevStep: () => {
    state.step = Math.max(0, state.step - 1);
    notify();
  },
  close: () => {
    state.open = false;
    state.step = 0;
    notify();
    if (typeof window !== "undefined") localStorage.setItem("safer-tour-seen", "1");
  },
  start: () => {
    state.step = 0;
    state.open = true;
    notify();
  },
};

export function useTourStore() {
  const [s, setS] = useState(state);

  useEffect(() => {
    const listener = () => setS({ ...state });
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return s;
}
