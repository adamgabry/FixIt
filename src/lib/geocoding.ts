/**
 * Geocoding utilities to convert between addresses and coordinates
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

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

/**
 * Converts latitude and longitude to a human-readable address
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Promise resolving to an address object or null if geocoding fails
 */
export const reverseGeocode = async (
	lat: number,
	lng: number
): Promise<Address | null> => {
	try {
		// Use Nominatim API (free, no API key required)
		// Rate limit: 1 request per second
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
			{
				headers: {
					'User-Agent': 'FixIt App' // Required by Nominatim
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

		// Extract address components
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

/**
 * Converts an address/place name to coordinates (forward geocoding)
 * @param query - Address or place name to search for
 * @param limit - Maximum number of results to return (default: 5)
 * @returns Promise resolving to an array of geocode results or empty array if geocoding fails
 */
export const geocode = async (
	query: string,
	limit: number = 5
): Promise<GeocodeResult[]> => {
	try {
		if (!query.trim()) {
			return [];
		}

		// Use Nominatim API (free, no API key required)
		// Rate limit: 1 request per second
		// Restrict search to Czech Republic (cz) and Slovakia (sk)
		const encodedQuery = encodeURIComponent(query);
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=${limit}&addressdetails=1&countrycodes=cz,sk`,
			{
				headers: {
					'User-Agent': 'FixIt App' // Required by Nominatim
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

		return data.map((item: {
			display_name: string;
			lat: string;
			lon: string;
			importance?: number;
		}) => ({
			displayName: item.display_name,
			lat: parseFloat(item.lat),
			lng: parseFloat(item.lon),
			importance: item.importance
		}));
	} catch (error) {
		console.error('Forward geocoding error:', error);
		return [];
	}
};
