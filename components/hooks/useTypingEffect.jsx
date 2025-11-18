import { useState, useEffect, useRef } from "react";

export function useTypingEffect(text, speed = 30, shouldType = false) {
  const [displayedText, setDisplayedText] = useState(shouldType ? "" : text);
  const hasTyped = useRef(false);
  const intervalRef = useRef(null);

  const stopTyping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    hasTyped.current = true;
    setDisplayedText(text);
  };

  useEffect(() => {
    if (!shouldType || hasTyped.current) {
      setDisplayedText(text);
      return;
    }

    let i = 0;
    setDisplayedText("");

    intervalRef.current = setInterval(() => {
      setDisplayedText((prev) => prev + text[i]);
      i++;

      if (i >= text.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        hasTyped.current = true;
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text, speed, shouldType]);

  return [displayedText, stopTyping];
}
