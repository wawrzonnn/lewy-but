import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import './styles.scss'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

export const metadata: Metadata = {
	title: 'Formularz danych osobowych',
	description: 'Aplikacja do wprowadzania i przeglądania danych osobowych',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='pl'>
			<body className={inter.variable}>{children}</body>
		</html>
	)
}
