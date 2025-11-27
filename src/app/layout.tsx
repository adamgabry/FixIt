import './globals.css';

import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
	<html lang="en">
		<body>
			<Providers>
				<Navbar />
				<main className="container mx-auto my-8">{children}</main>
			</Providers>
		</body>
	</html>
);

export default RootLayout;
