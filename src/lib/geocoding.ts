/**
 * Reverse geocoding utility to convert coordinates to human-readable addresses
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

export type Address = {
	displayName: string;
	street?: string;
	city?: string;
	country?: string;
};

/**
 * Converts latitude and longitude to a human-readable address
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Promise resolving to an address object or null if geocoding fails
 */
export async function reverseGeocode(
	lat: number,
	lng: number
): Promise<Address | null> {
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

		if (!data || !data.address) {
			return null;
		}

		const address = data.address;
		const displayName = data.display_name || '';

		// Extract address components
		const street = [
			address.road,
			address.house_number
		]
			.filter(Boolean)
			.join(' ');

		const city =
			address.city ||
			address.town ||
			address.village ||
			address.municipality ||
			'';

		const country = address.country || '';

		return {
			displayName,
			street: street || undefined,
			city: city || undefined,
			country: country || undefined
		};
	} catch (error) {
		console.error('Reverse geocoding error:', error);
		return null;
	}
}

