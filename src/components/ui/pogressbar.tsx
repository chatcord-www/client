'use client'
import { Next13ProgressBar } from 'next13-progressbar';

export const Pogressbar = () => {
  return (
    <Next13ProgressBar height="1px" color="hsl(155 99% 45%)" options={{ showSpinner: false }} showOnShallow />
  )
}
