export type Address = {
	displayName: string;
	street?: string;
	city?: string;
	country?: string;
};

export type GeocodeResult = {
	displayName: string;
	lat: number;
	lng: number;
	importance?: number;
};

export const reverseGeocode = async (
	lat: number,
	lng: number
): Promise<Address | null> => {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
			{
				headers: {
					'User-Agent': 'FixIt App'
				}
			}
		);

		if (!response.ok) {
			throw new Error('Geocoding request failed');
		}

		const data = await response.json();

		if (!data?.address) {
			return null;
		}

		const address = data.address;
		const displayName = data.display_name ?? '';

		const street = [address.road, address.house_number]
			.filter(Boolean)
			.join(' ');

		const city =
			address.city ??
			address.town ??
			address.village ??
			address.municipality ??
			'';

		const country = address.country ?? '';

		return {
			displayName,
			street: street ?? undefined,
			city: city ?? undefined,
			country: country ?? undefined
		};
	} catch (error) {
		console.error('Reverse geocoding error:', error);
		return null;
	}
};

export const geocode = async (
	query: string,
	limit: number = 5
): Promise<GeocodeResult[]> => {
	try {
		if (!query.trim()) {
			return [];
		}

		const encodedQuery = encodeURIComponent(query);
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=${limit}&addressdetails=1&countrycodes=cz,sk`,
			{
				headers: {
					'User-Agent': 'FixIt App'
				}
			}
		);

		if (!response.ok) {
			throw new Error('Geocoding request failed');
		}

		const data = await response.json();

		if (!Array.isArray(data) || data.length === 0) {
			return [];
		}

		return data.map(
			(item: {
				display_name: string;
				lat: string;
				lon: string;
				importance?: number;
			}) => ({
				displayName: item.display_name,
				lat: parseFloat(item.lat),
				lng: parseFloat(item.lon),
				importance: item.importance
			})
		);
	} catch (error) {
		console.error('Forward geocoding error:', error);
		return [];
	}
};
