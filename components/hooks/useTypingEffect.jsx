import { useState, useEffect, useRef } from "react";

export function useTypingEffect(text, speed = 30, enabled = true) {
  const [displayedText, setDisplayedText] = useState(enabled ? "" : text);
  const intervalRef = useRef(null);

  const stopTyping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setDisplayedText(text);
    }
  };

  useEffect(() => {
    if (!enabled) {
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
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text, speed, enabled]);

  return [displayedText, stopTyping];
}
