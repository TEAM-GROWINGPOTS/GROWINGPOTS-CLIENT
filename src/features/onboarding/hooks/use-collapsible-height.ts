import { useLayoutEffect, useRef, useState } from 'react';

const MIN_ROWS_TO_COLLAPSE = 3;
const MIN_COLLAPSED_HEIGHT = 44;

export const useCollapsibleHeight = (isEditing: boolean, rowsLength: number) => {
  const [expanded, setExpanded] = useState(false);
  const [prevIsEditing, setPrevIsEditing] = useState(isEditing);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const restOfPageHeightRef = useRef<number | undefined>(undefined);
  const [collapsedHeight, setCollapsedHeight] = useState<number>();

  if (isEditing !== prevIsEditing) {
    setPrevIsEditing(isEditing);
    if (!isEditing) setExpanded(true);
  }

  const canToggle = !isEditing && rowsLength > MIN_ROWS_TO_COLLAPSE;
  const isCollapsed = canToggle && !expanded;

  useLayoutEffect(() => {
    if (!isCollapsed) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateCollapsedHeight = () => {
      const naturalHeight = wrapper.scrollHeight;
      const appliedHeight = wrapper.getBoundingClientRect().height;
      const bodyHeight = document.body.scrollHeight;

      if (bodyHeight > window.innerHeight) {
        restOfPageHeightRef.current = bodyHeight - appliedHeight;
      }
      const restOfPageHeight = restOfPageHeightRef.current ?? Math.max(0, bodyHeight - naturalHeight);

      const availableHeight = window.innerHeight - restOfPageHeight;

      const rows = wrapper.querySelectorAll('tbody tr');
      const minVisibleRow = rows[MIN_ROWS_TO_COLLAPSE - 1];
      const minVisibleHeight = minVisibleRow
        ? minVisibleRow.getBoundingClientRect().bottom - wrapper.getBoundingClientRect().top
        : MIN_COLLAPSED_HEIGHT;

      setCollapsedHeight(Math.max(minVisibleHeight, Math.min(naturalHeight, availableHeight)));
    };

    updateCollapsedHeight();
    window.addEventListener('resize', updateCollapsedHeight);

    return () => window.removeEventListener('resize', updateCollapsedHeight);
  }, [isCollapsed, rowsLength]);

  const handleToggleClick = () => {
    setExpanded((prev) => !prev);
  };

  return { wrapperRef, isCollapsed, canToggle, collapsedHeight, expanded, handleToggleClick };
};
