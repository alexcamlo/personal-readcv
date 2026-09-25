import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { Inter, Space_Grotesk } from 'next/font/google'
import { promises as fs } from 'fs';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export async function generateMetadata(): Promise<Metadata> {
  const file = await fs.readFile(process.cwd() + '/public/content/profileData.json', 'utf8');
  const cv = JSON.parse(file);
  return {
    title: cv.general.displayName,
    description: cv.general.byline || '',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
