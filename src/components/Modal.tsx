import React, { useEffect, useRef } from 'react';

import useClickOutside from '../hooks/useClickOutside';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  dialogClassName?: string;
  closeOnOutsideClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  dialogClassName,
  closeOnOutsideClick = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useClickOutside(modalRef, onClose, { active: isOpen && closeOnOutsideClick });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black bg-opacity-50 transition-opacity"
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-xl w-full max-h-[90vh] overflow-auto transform transition-all ${dialogClassName ?? 'max-w-2xl'}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
