

import { useEffect, useCallback } from "react";

interface UseModalKeyboardOptions {
  isOpen: boolean;
  onClose: () => void;
  lockScroll?: boolean;
}

export function useModalKeyboard({
  isOpen,
  onClose,
  lockScroll = true,
}: UseModalKeyboardOptions) {
  const setupModal = useCallback(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      if (lockScroll) {
        document.body.style.overflow = "hidden";
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      if (lockScroll) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, onClose, lockScroll]);

  useEffect(() => {
    const cleanup = setupModal();
    return cleanup;
  }, [setupModal]);

  return { setupModal };
}