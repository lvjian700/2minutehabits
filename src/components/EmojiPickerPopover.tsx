import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import type { EmojiData } from '../types/EmojiData';
import useClickOutside from '../hooks/useClickOutside';

interface EmojiPickerPopoverProps {
  anchorRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  onSelect: (emoji: EmojiData) => void;
  onClose: () => void;
}

const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({ anchorRef, isOpen, onSelect, onClose }) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
      setTimeout(() => setVisible(true), 0);
    } else {
      setVisible(false);
    }
  }, [isOpen, anchorRef]);

  useClickOutside(pickerRef, onClose, { active: isOpen, ignoreRefs: [anchorRef] });

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={pickerRef}
      className="fixed bg-white rounded-lg shadow-xl z-50 border border-gray-200 transition-opacity duration-150"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <Picker data={data} onEmojiSelect={(emoji: EmojiData) => onSelect(emoji)} theme="light" />
    </div>,
    document.body
  );
};

export default EmojiPickerPopover;
