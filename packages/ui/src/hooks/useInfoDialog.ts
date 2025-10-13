import { useState, useCallback } from 'react';

interface UseInfoDialogReturn {
  isOpen: boolean;
  openDialog: (title: string, content: string | React.ReactNode) => void;
  closeDialog: () => void;
  title: string;
  content: string | React.ReactNode;
}

export function useInfoDialog(): UseInfoDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string | React.ReactNode>('');

  const openDialog = useCallback((newTitle: string, newContent: string | React.ReactNode) => {
    setTitle(newTitle);
    setContent(newContent);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openDialog,
    closeDialog,
    title,
    content,
  };
}
