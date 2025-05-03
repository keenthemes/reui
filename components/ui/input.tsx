import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define input size variants
const inputVariants = cva(
  `
    flex w-full bg-background border border-input shadow-xs shadow-black/5 transition-[color,box-shadow] text-foreground placeholder:text-muted-foreground/80 
    focus-visible:ring-ring/30  focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] 
    disabled:cursor-not-allowed disabled:opacity-50 [&[readonly]]:opacity-70 
    file:h-full [&[type=file]]:py-0 file:border-solid file:border-input file:bg-transparent 
    file:font-medium file:not-italic file:text-foreground file:p-0 file:border-0 file:border-e
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
  `,
  {
    variants: {
      size: {
        lg: 'h-10 px-4 text-sm rounded-md file:pe-4 file:me-4',
        md: 'h-8.5 px-3 text-[0.8125rem] leading-(--text-sm--line-height) rounded-md file:pe-3 file:me-3',
        sm: 'h-7 px-2.5 text-xs rounded-md file:pe-2.5 file:me-2.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const inputAddonVariants = cva(
  'flex items-center shrink-0 justify-center bg-muted border border-input shadow-xs shadow-[rgba(0,0,0,0.05)] text-secondary-foreground',
  {
    variants: {
      size: {
        sm: 'rounded-md h-7 min-w-7 text-xs px-2.5 [&_svg:not([class*=size-])]:size-3.5',
        md: 'rounded-md h-8.5 min-w-8.5 px-3 text-[0.8125rem] leading-(--text-sm--line-height) [&_svg:not([class*=size-])]:size-4.5',
        lg: 'rounded-md h-10 min-w-10 px-4 text-sm [&_svg:not([class*=size-])]:size-4.5',
      },
      mode: {
        default: '',
        icon: 'px-0 justify-center',
      },
    },
    defaultVariants: {
      size: 'md',
      mode: 'default',
    },
  },
);

const inputGroupVariants = cva(
  `
    flex items-stretch
    [&_[data-slot=input]]:grow
    [&_[data-slot=input-addon]:has(+[data-slot=input])]:rounded-e-none [&_[data-slot=input-addon]:has(+[data-slot=input])]:border-e-0
    [&_[data-slot=input]+[data-slot=input-addon]]:rounded-s-none [&_[data-slot=input]+[data-slot=input-addon]]:border-s-0
    [&_[data-slot=input-addon]:has(+[data-slot=button])]:rounded-e-none
    [&_[data-slot=input]+[data-slot=button]]:rounded-s-none
    [&_[data-slot=button]+[data-slot=input]]:rounded-s-none
    [&_[data-slot=input-addon]+[data-slot=input]]:rounded-s-none
    [&_[data-slot=input]:has(+[data-slot=button])]:rounded-e-none
    [&_[data-slot=input]:has(+[data-slot=input-addon])]:rounded-e-none
  `,
  {
    variants: {},
    defaultVariants: {},
  },
);

const inputWrapperVariants = cva(
  `
    flex items-center gap-1.5
    has-[:focus-visible]:ring-ring/30 
    has-[:focus-visible]:border-ring
    has-[:focus-visible]:outline-none 
    has-[:focus-visible]:ring-[3px]

    [&>[data-slot=input]]:flex 
    [&>[data-slot=input]]:w-full 
    [&>[data-slot=input]]:outline-none 
    [&>[data-slot=input]]:transition-colors 
    [&>[data-slot=input]]:text-foreground
    [&>[data-slot=input]]:placeholder:text-muted-foreground 
    [&>[data-slot=input]]:border-0 
    [&>[data-slot=input]]:bg-transparent 
    [&>[data-slot=input]]:p-0
    [&>[data-slot=input]]:shadow-none 
    [&>[data-slot=input]]:focus-visible:ring-0 
    [&>[data-slot=input]]:h-auto 
    [&>[data-slot=input]]:disabled:cursor-not-allowed
    [&>[data-slot=input]]:disabled:opacity-50 

    [&>svg]:text-muted-foreground 
  `,
  {
    variants: {
      size: {
        sm: 'gap-1.25 [&_svg:not([class*=size-])]:size-3.5',
        md: 'gap-1.5 [&_svg:not([class*=size-])]:size-4',
        lg: 'gap-1.5 [&_svg:not([class*=size-])]:size-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

function Input({ className, type, size, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  );
}

export interface InputAddonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputAddonVariants> {}

function InputAddon({ className, size, mode, ...props }: InputAddonProps) {
  return (
    <div
      data-slot="input-addon"
      className={cn(inputAddonVariants({ size, mode }), className)}
      {...props}
    />
  );
}

export interface InputGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupVariants> {}

function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      className={cn(inputGroupVariants(), className)}
      {...props}
    />
  );
}

export interface InputWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputWrapperVariants> {}

function InputWrapper({ className, size, ...props }: InputWrapperProps) {
  return (
    <div
      data-slot="input-wrapper"
      className={cn(
        inputVariants({ size }),
        inputWrapperVariants({ size }),
        className,
      )}
      {...props}
    />
  );
}

export {
  Input,
  InputAddon,
  InputGroup,
  InputWrapper,
  inputVariants,
  inputAddonVariants,
};
