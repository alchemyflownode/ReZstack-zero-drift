import React, { useState, useRef, useCallback, useEffect } from 'react';

interface SovereignSplitterProps {
  direction: 'horizontal' | 'vertical';
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  onResize?: (size: number) => void;
  className?: string;
  children: [React.ReactNode, React.ReactNode];
}

export function SovereignSplitter({
  direction = 'horizontal',
  initialSize = 50,
  minSize = 20,
  maxSize = 80,
  onResize,
  className = '',
  children,
}: SovereignSplitterProps) {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback(() => {
    setIsResizing(true);
    document.body.classList.add(direction === 'horizontal' ? 'resizing' : 'resizing-h');
  }, [direction]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.classList.remove('resizing', 'resizing-h');
  }, []);

  const resize = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current || !isResizing) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newSize;

      if (direction === 'horizontal') {
        const totalWidth = containerRect.width;
        const relativeX = clientX - containerRect.left;
        newSize = (relativeX / totalWidth) * 100;
      } else {
        const totalHeight = containerRect.height;
        const relativeY = clientY - containerRect.top;
        newSize = (relativeY / totalHeight) * 100;
      }

      // Clamp to min/max
      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      
      setSize(newSize);
      onResize?.(newSize);
    },
    [direction, isResizing, minSize, maxSize, onResize]
  );

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      resize(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      stopResizing();
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resize, stopResizing]);

  const containerClasses = `flex ${
    direction === 'horizontal' ? 'flex-row' : 'flex-col'
  } w-full h-full ${className}`;

  const resizerClasses = `${
    direction === 'horizontal'
      ? 'w-1 cursor-col-resize hover:bg-rezonic-primary'
      : 'h-1 cursor-row-resize hover:bg-rezonic-primary'
  } bg-gray-700 transition-colors active:bg-rezonic-accent`;

  const paneStyle = (isFirst: boolean) => ({
    [direction === 'horizontal' ? 'width' : 'height']: `${isFirst ? size : 100 - size}%`,
    flexShrink: 0,
  });

  return (
    <div ref={containerRef} className={containerClasses}>
      <div style={paneStyle(true)} className="overflow-hidden">
        {children[0]}
      </div>
      
      <div
        ref={resizerRef}
        className={resizerClasses}
        onMouseDown={startResizing}
        title={`Resize ${direction === 'horizontal' ? 'horizontal' : 'vertical'} split`}
      />
      
      <div style={paneStyle(false)} className="overflow-hidden">
        {children[1]}
      </div>
    </div>
  );
}


