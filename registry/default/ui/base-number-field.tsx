import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { NumberField as NumberFieldPrimitive } from '@base-ui-components/react/number-field';
import { cva, VariantProps } from 'class-variance-authority';
import { MinusIcon, MoveHorizontalIcon, PlusIcon } from 'lucide-react';

type NumberFieldContextType = {
  id: string;
};

const NumberFieldContext = React.createContext<NumberFieldContextType | null>(null);

const inputVariants = cva(
  [
    'border border-input flex items-center justify-center transition-colors select-none disabled:opacity-50 disabled:pointer-events-none w-20 text-center',
    'focus-visible:ring-ring/30  focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px]',
    'aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20',
  ],
  {
    variants: {
      size: {
        lg: 'h-10 text-base',
        md: 'h-8.5 text-sm',
        sm: 'h-7 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const buttonVariants = cva(
  [
    'cursor-pointer focus-visible:outline-hidden inline-flex items-center justify-center text-foreground border border-input',
    'focus-visible:ring-ring/30  focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px]',
    'hover:bg-muted',
    'whitespace-nowrap text-sm font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0',
  ],
  {
    variants: {
      size: {
        lg: 'size-10 [&_svg:not([class*=size-])]:size-4',
        md: 'size-8.5 [&_svg:not([class*=size-])]:size-3.5',
        sm: 'size-7 [&_svg:not([class*=size-])]:size-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const useNumberField = () => {
  const context = React.useContext(NumberFieldContext);

  if (!context) {
    throw new Error('useNumberField must be used within a NumberField');
  }

  return context;
};

function NumberField({
  id,
  className,
  children,
  size = 'md',
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Root> & VariantProps<typeof inputVariants>) {
  let fieldId = React.useId();

  if (id) {
    fieldId = id;
  }

  return (
    <NumberFieldContext.Provider value={{ id: fieldId }}>
      <NumberFieldPrimitive.Root
        id={fieldId}
        className={cn('flex flex-col items-start gap-1', className)}
        data-slot="number-field"
        {...props}
      >
        {children}
        <NumberFieldPrimitive.Group className="shadow-xs shadow-black/5 text-foreground flex rounded-md transition-shadow">
          <NumberFieldPrimitive.Decrement
            className={cn(buttonVariants({ size }), 'rounded-s-md border-e-0')}
            data-slot="number-field-decrement"
          >
            <MinusIcon />
          </NumberFieldPrimitive.Decrement>
          <NumberFieldPrimitive.Input className={inputVariants({ size })} data-slot="number-field-input" />
          <NumberFieldPrimitive.Increment
            className={cn(buttonVariants({ size }), 'rounded-e-md border-s-0')}
            data-slot="number-field-increment"
          >
            <PlusIcon />
          </NumberFieldPrimitive.Increment>
        </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
    </NumberFieldContext.Provider>
  );
}

function NumberFieldScrubArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.ScrubArea>) {
  const { id: fieldId } = useNumberField();

  return (
    <NumberFieldPrimitive.ScrubArea
      className={cn('cursor-ew-resize', className)}
      data-slot="number-field-scrub-area"
      {...props}
    >
      <label
        htmlFor={fieldId}
        className="text-foreground cursor-ew-resize text-sm font-medium"
        data-slot="number-field-label"
      >
        {children}
      </label>
      <NumberFieldPrimitive.ScrubAreaCursor
        className="drop-shadow-sm filter"
        data-slot="number-field-scrub-area-cursor"
      >
        <MoveHorizontalIcon className="size-4.5" />
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  );
}

export { NumberField, NumberFieldScrubArea };
