
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'], // It's good practice to specify weights for variable fonts
});

export const metadata: Metadata = {
  title: 'WeatherWise',
  description: 'Your personal weather assistant with AI-powered activity suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
