import './globals.css'

// This is a minimal root layout that acts as a pass-through.
// Route groups (frontend) and (payload) have their own complete layouts with <html> and <body>.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
