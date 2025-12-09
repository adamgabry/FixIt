'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LocateFixed } from 'lucide-react';

import { Button } from '@/components/buttons/button';
import { useLocation } from '@/lib/use-location';

export const LocationButton = () => {
	const map = useMap();
	const { coords, loading, error, requestLocation } = useLocation();

	// Move map to current location when coordinates are available
	useEffect(() => {
		if (coords) {
			map.flyTo([coords.lat, coords.lng], 15, {
				animate: true,
				duration: 1.5
			});
		}
	}, [coords, map]);

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		requestLocation();
	};

	return (
		<div
			className="absolute bottom-4 left-4 z-1000"
			data-location-button
			onClick={e => e.stopPropagation()}
		>
			<Button
				onClick={handleClick}
				disabled={loading}
				variant="default"
				size="icon"
				title={error ?? 'Get current location'}
				className="h-12 w-12 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-orange-200/60 hover:border-orange-300 text-orange-700 hover:text-orange-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
			>
				{loading ? (
					<svg
						className="animate-spin h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				) : (
					<LocateFixed />
				)}
			</Button>
		</div>
	);
};
