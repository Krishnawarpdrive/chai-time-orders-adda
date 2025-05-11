
import type { AppProps } from 'next/app';
import '../index.css'; // Assuming your styles are here
import { Toaster } from '@/components/ui/toaster';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
