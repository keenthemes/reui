/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DraggableSyntheticListeners,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Slot } from '@radix-ui/react-slot';

// Sortable Item Context
const SortableItemContext = React.createContext<{
  listeners: DraggableSyntheticListeners | undefined;
  isDragging?: boolean;
  disabled?: boolean;
}>({
  listeners: undefined,
  isDragging: false,
  disabled: false,
});

// Multipurpose Sortable Component
export interface SortableRootProps<T> {
  value: T[];
  onValueChange: (value: T[]) => void;
  getItemValue: (item: T) => string;
  children: React.ReactNode;
  className?: string;
  onMove?: (event: { event: DragEndEvent; activeIndex: number; overIndex: number }) => void;
  strategy?: 'horizontal' | 'vertical' | 'grid';
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}

function Sortable<T>({
  value,
  onValueChange,
  getItemValue,
  children,
  className,
  onMove,
  strategy = 'vertical',
  onDragStart,
  onDragEnd,
}: SortableRootProps<T>) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id);
      onDragStart?.(event);
    },
    [onDragStart],
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      onDragEnd?.(event);

      if (!over) return;

      // Handle item reordering
      const activeIndex = value.findIndex((item: T) => getItemValue(item) === active.id);
      const overIndex = value.findIndex((item: T) => getItemValue(item) === over.id);

      if (activeIndex !== overIndex) {
        if (onMove) {
          onMove({ event, activeIndex, overIndex });
        } else {
          const newValue = arrayMove(value, activeIndex, overIndex);
          onValueChange(newValue);
        }
      }
    },
    [value, getItemValue, onValueChange, onMove, onDragEnd],
  );

  const getStrategy = () => {
    switch (strategy) {
      case 'horizontal':
        return rectSortingStrategy;
      case 'grid':
        return rectSortingStrategy;
      case 'vertical':
      default:
        return verticalListSortingStrategy;
    }
  };

  const itemIds = React.useMemo(() => value.map(getItemValue), [value, getItemValue]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={getStrategy()}>
        <div data-slot="sortable" data-dragging={activeId !== null} className={cn(className)}>
          {children}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId ? (
          <div className="z-50">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && (child.props as any).value === activeId) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  ...(child.props as any),
                  className: cn((child.props as any).className, 'z-50 shadow-lg'),
                });
              }
              return null;
            })}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export interface SortableItemProps {
  value: string;
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function SortableItem({ value, asChild = false, className, children, disabled }: SortableItemProps) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging,
  } = useSortable({
    id: value,
    disabled,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  } as React.CSSProperties;

  const Comp = asChild ? Slot : 'div';

  return (
    <SortableItemContext.Provider value={{ listeners, isDragging: isSortableDragging, disabled }}>
      <Comp
        data-slot="sortable-item"
        data-value={value}
        data-dragging={isSortableDragging}
        data-disabled={disabled}
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(isSortableDragging && 'opacity-50 z-50', disabled && 'opacity-50', className)}
      >
        {children}
      </Comp>
    </SortableItemContext.Provider>
  );
}

export interface SortableItemHandleProps {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  cursor?: boolean;
}

function SortableItemHandle({ asChild, className, children, cursor = true }: SortableItemHandleProps) {
  const { listeners, isDragging, disabled } = React.useContext(SortableItemContext);

  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="sortable-item-handle"
      data-dragging={isDragging}
      data-disabled={disabled}
      {...listeners}
      className={cn(cursor && (isDragging ? '!cursor-grabbing' : '!cursor-grab'), className)}
    >
      {children}
    </Comp>
  );
}

export { Sortable, SortableItem, SortableItemHandle };
