'use client';

import { toastManager, useToast } from '@/registry/default/hooks/use-toast';
import { cn } from '@/registry/default/lib/utils';
import { buttonVariants } from '@/registry/default/ui/base-button';
import { Toast } from '@base-ui-components/react/toast';
import { cva } from 'class-variance-authority';
import { CircleAlert, CircleCheck, Info, Loader, TriangleAlert, X } from 'lucide-react';

export type ToastType = 'default' | 'loading' | 'success' | 'error' | 'info' | 'warning';

export type ToastPosition = 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';

export type ToastTimeout = number;

export type ToastSwipeDirection = 'up' | 'down' | 'left' | 'right';

const toastVariants = cva(
  [
    'absolute z-[calc(1000-var(--toast-index))] m-0 w-[calc(100%_-_2rem)] sm:w-sm',
    'bg-clip-padding transition-all [transition-property:opacity,transform] duration-200 ease-out select-none',
    'after:absolute after:start-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[""]',
    '[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+calc(min(var(--toast-index),10)*-1*var(--gap))))_scale(calc(max(0,1-(var(--toast-index)*0.1))))]',

    'data-[position^=top]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+calc(min(var(--toast-index),10)*var(--gap))))_scale(calc(max(0,1-(var(--toast-index)*0.1))))]',

    'data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y)))]',
    'data-[expanded]:data-[position^=top]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y)))]',

    'data-[ending-style]:opacity-0 data-[limited]:opacity-0 data-[starting-style]:[transform:translateY(150%)]',
    'data-[starting-style]:opacity-0 data-[ending-style]:[&:not([data-limited])]:[transform:translateY(150%)]',
    'data-[starting-style]:data-[position^=top]:[transform:translateY(-150%)]',
    'data-[ending-style]:data-[position^=top]:[&:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]',

    'data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
    'data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',

    'data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
    'data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',

    'data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
    'data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
  ],
  {
    variants: {
      position: {
        'top-center': 'start-1/2 -translate-x-1/2 top-0 after:top-full',
        'top-right': 'end-0 top-0 after:top-full',
        'top-left': 'start-0 top-0 after:top-full',
        'bottom-center': 'start-1/2 -translate-x-1/2 bottom-0 after:bottom-full',
        'bottom-right': 'end-0 bottom-0 after:bottom-full',
        'bottom-left': 'start-0 bottom-0 after:bottom-full',
      },
    },
    defaultVariants: {
      position: 'bottom-right',
    },
  },
);

const toastTypeVariants = cva('rounded-lg', {
  variants: {
    type: {
      loading: 'bg-popover text-popover-foreground border border-border shadow-lg',
      default: 'bg-popover text-popover-foreground border border-border shadow-lg',
      error: 'bg-destructive text-destructive-foreground',
      success:
        'bg-[var(--color-success,var(--color-green-500))] text-[var(--color-success-foreground,var(--color-white))]',
      info: 'bg-[var(--color-info,var(--color-violet-600))] text-[var(--color-info-foreground,var(--color-white))]',
      warning:
        'bg-[var(--color-warning,var(--color-yellow-500))] text-[var(--color-warning-foreground,var(--color-white))]',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

const toastContainerVariants = cva(['fixed flex flex-col gap-2 z-50'], {
  variants: {
    position: {
      'top-center': 'end-1/2 -translate-x-1/2 top-3',
      'top-right': 'end-3 top-3',
      'top-left': 'start-3 top-3',
      'bottom-center': 'end-1/2 -translate-x-1/2 bottom-3',
      'bottom-right': 'end-3 bottom-3',
      'bottom-left': 'start-3 bottom-3',
    },
  },
  defaultVariants: {
    position: 'bottom-right',
  },
});

const TOAST_ICONS: {
  [key: string]: React.ReactNode;
} = {
  loading: <Loader className="animate-spin" />,
  success: <CircleCheck />,
  error: <CircleAlert />,
  info: <Info />,
  warning: <TriangleAlert />,
};

interface ToastProviderProps extends Omit<React.ComponentProps<typeof Toast.Provider>, 'toastManager'> {
  position?: ToastPosition;
  timeout?: ToastTimeout;
  swipeDirection?: ToastSwipeDirection[];
  limit?: number;
  showCloseButton?: boolean;
}

function ToastProvider({
  children,
  position = 'bottom-right',
  timeout = 5000,
  swipeDirection,
  limit = 5,
  showCloseButton = false,
  ...props
}: ToastProviderProps) {
  return (
    <Toast.Provider toastManager={toastManager} timeout={timeout} limit={limit} {...props}>
      {children}
      <ToastList position={position} swipeDirection={swipeDirection} showCloseButton={showCloseButton} />
    </Toast.Provider>
  );
}

interface CustomToastData {
  content?: string;
  close?: boolean;
  position?: ToastPosition;
}

function isCustomToast(toast: Toast.Root.ToastObject): toast is Toast.Root.ToastObject<CustomToastData> {
  return toast.data?.content !== undefined;
}

function getDefaultSwipeDirection(position: ToastPosition): ToastSwipeDirection[] {
  switch (position) {
    case 'top-center':
      return ['up', 'right', 'left'];
    case 'top-right':
      return ['up', 'right'];
    case 'top-left':
      return ['up', 'left'];
    case 'bottom-center':
      return ['down', 'right', 'left'];
    case 'bottom-left':
      return ['down', 'left'];
    case 'bottom-right':
    default:
      return ['right', 'down'];
  }
}

interface ToastListProps {
  position: ToastPosition;
  swipeDirection?: ToastSwipeDirection[];
  showCloseButton: boolean;
}

function ToastList({ position, swipeDirection, showCloseButton }: ToastListProps) {
  const { toasts } = useToast();

  // Group toasts by position (individual or default)
  const toastsByPosition = toasts.reduce(
    (groups, toast) => {
      const toastPosition = (toast.data?.position || position) as ToastPosition;
      if (!groups[toastPosition]) {
        groups[toastPosition] = [];
      }
      groups[toastPosition].push(toast);
      return groups;
    },
    {} as Record<ToastPosition, typeof toasts>,
  );

  return (
    <>
      {Object.entries(toastsByPosition).map(([toastPosition, positionToasts]) => {
        const currentSwipeDirection = swipeDirection || getDefaultSwipeDirection(toastPosition as ToastPosition);

        return (
          <Toast.Portal data-slot="toast-portal" key={toastPosition}>
            <Toast.Viewport
              className={cn(toastContainerVariants({ position: toastPosition as ToastPosition }))}
              data-slot="toast-viewport"
              data-position={toastPosition}
            >
              {positionToasts.map((toast, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const type = (toast as any).type || 'default';
                return (
                  <Toast.Root
                    key={toast.id}
                    toast={toast}
                    swipeDirection={currentSwipeDirection}
                    data-slot="toast"
                    data-position={toastPosition}
                    data-type={type}
                    className={cn(
                      toastVariants({
                        position: toastPosition as ToastPosition,
                      }),
                    )}
                    style={{
                      ['--gap' as string]: '0.8rem',
                      ['--toast-index' as string]: index.toString(),
                      ['--offset-y' as string]: toastPosition.startsWith('top')
                        ? 'calc(var(--toast-offset-y) + (var(--toast-index) * var(--gap)) + var(--toast-swipe-movement-y))'
                        : 'calc(var(--toast-offset-y) * -1 + (var(--toast-index) * var(--gap) * -1) + var(--toast-swipe-movement-y))',
                    }}
                  >
                    {isCustomToast(toast) && toast.data ? (
                      <div data-slot="toast-wrapper">{toast.data.content}</div>
                    ) : (
                      <div
                        className={cn(
                          'flex items-center justify-between gap-2 p-4 w-full',
                          toastTypeVariants({ type: type as ToastType }),
                        )}
                        data-slot="toast-wrapper"
                      >
                        <div className="flex items-center gap-2.5">
                          {type && TOAST_ICONS[type] && (
                            <div
                              className="shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                              data-slot="toast-icon"
                            >
                              {TOAST_ICONS[type]}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <Toast.Title
                              className="text-sm leading-relaxed font-semibold m-0"
                              data-slot="toast-title"
                            />
                            <Toast.Description className="text-xs leading-normal" data-slot="toast-description" />
                          </div>
                        </div>

                        {(toast.data?.close || showCloseButton) && (
                          <Toast.Close
                            className={cn(
                              'absolute top-2 end-2 [&_svg]:size-3.5 [&_svg]:opacity-60 hover:[&_svg]:opacity-100 cursor-pointer',
                            )}
                            data-slot="toast-action"
                            aria-label="Close"
                          >
                            <X />
                          </Toast.Close>
                        )}
                      </div>
                    )}
                  </Toast.Root>
                );
              })}
            </Toast.Viewport>
          </Toast.Portal>
        );
      })}
    </>
  );
}

export { ToastProvider };
