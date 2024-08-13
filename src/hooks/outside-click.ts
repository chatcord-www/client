import { RefObject, useEffect } from "react";

export const useOutSideClick = (
  ref: RefObject<HTMLDivElement>,
  close: () => void,
) => {
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
};
