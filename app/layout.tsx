import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cleanova | Laundry Service',
  description: 'Fast, reliable laundry and dry-cleaning service for busy lifestyles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
