import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Luxury Barber Club – VIP nyereményjáték',
  description: 'VIP-belépőkódos heti nyereményjáték és élő szerencsekerék.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hu"><body>{children}</body></html>;
}
