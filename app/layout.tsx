import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'The Luxury Barber Club | VIP', description: 'Exkluzív VIP klub és heti nyereményjáték.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="hu"><body>{children}</body></html>; }
