import { useCallback, useEffect, useRef, useState } from 'react';

interface UseDropdownReturn {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLDivElement | null>
}

export function useDropdown(): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Click away functionality
  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDialog();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickAway);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [isOpen, closeDialog]);

  return {
    isOpen,
    openDialog,
    closeDialog,
    dropdownRef,
    triggerRef,
  };
}