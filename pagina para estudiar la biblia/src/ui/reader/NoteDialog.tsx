import type { ReactNode } from 'react';
import { Dialog } from '@ui/components/Dialog';

interface NoteDialogProps {
  readonly title: string;
  readonly subtitle?: string | undefined;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

export function NoteDialog({ title, subtitle, onClose, children }: NoteDialogProps) {
  return (
    <Dialog title={title} subtitle={subtitle} onClose={onClose}>
      {children}
    </Dialog>
  );
}
