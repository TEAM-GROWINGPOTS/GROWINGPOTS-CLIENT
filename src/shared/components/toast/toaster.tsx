import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => (
  <SonnerToaster
    position="bottom-center"
    offset={40}
    visibleToasts={1}
    toastOptions={{
      unstyled: true,
      classNames: {
        toast: 'min-w-380 font-sans',
      },
    }}
  />
);
