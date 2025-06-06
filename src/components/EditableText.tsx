import React, { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  textElement?: React.ElementType;
  textClassName?: string;
  inputClassName?: string;
  ariaLabel?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  initialValue,
  onSave,
  textElement: TextElement = 'span', // Default to span if no element type is provided
  textClassName = '',
  inputClassName = '',
  ariaLabel = 'editable text'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditText(initialValue); // Sync with external changes to initialValue
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); // Optional: select text on focus
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== initialValue) {
      onSave(trimmedText);
    } else {
      // If no change or empty, revert to initialValue visually for next edit cycle
      setEditText(initialValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setEditText(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={inputClassName}
        aria-label={`Edit ${ariaLabel}`}
      />
    );
  }

  return (
    <TextElement
      className={textClassName}
      onClick={() => setIsEditing(true)}
      role="button" // Make it clear it's interactive
      tabIndex={0} // Make it focusable
      onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') setIsEditing(true);}} // Allow activation with Enter/Space
      aria-label={ariaLabel}
    >
      {initialValue} {/* Always display the persisted initialValue when not editing */}
    </TextElement>
  );
};

export default EditableText;
