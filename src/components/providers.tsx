'use client';

import { type PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

export const Providers = ({ children }: PropsWithChildren) => (
	<>
		{children}
		<Toaster richColors />
	</>
);
