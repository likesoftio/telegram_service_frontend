import * as React from 'react';
import { cn } from '../../lib/utils';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
}

export function Dialog({ open, onClose, className, children, ...props }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className={cn('bg-white dark:bg-muted rounded-lg shadow-lg p-6 min-w-[320px] max-w-lg', className)}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
} 