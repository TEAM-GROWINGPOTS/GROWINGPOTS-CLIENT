import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => (
  <SonnerToaster
    position="bottom-center"
    offset={40}
    duration={2000}
    visibleToasts={1}
    toastOptions={{
      unstyled: true,
      style: { width: 'fit-content' },
      classNames: {
        toast: 'min-w-380 font-sans',
      },
    }}
  />
);
