/**
 * Converts latitude and longitude to a Maidenhead Grid Square (locator).
 * @param lat Latitude in decimal degrees
 * @param lon Longitude in decimal degrees
 * @param precision Precision level (2, 4, or 6 characters). Default is 6.
 * @returns Maidenhead grid square string
 */
export function getMaidenheadLocator(lat: number, lon: number, precision: number = 6): string {
    let adjLat = lat + 90;
    let adjLon = lon + 180;

    // Field (18x18)
    const fieldLon = String.fromCharCode('A'.charCodeAt(0) + Math.floor(adjLon / 20));
    const fieldLat = String.fromCharCode('A'.charCodeAt(0) + Math.floor(adjLat / 10));

    if (precision <= 2) return fieldLon + fieldLat;

    // Square (10x10)
    adjLon %= 20;
    adjLat %= 10;
    const squareLon = Math.floor(adjLon / 2);
    const squareLat = Math.floor(adjLat / 1);

    if (precision <= 4) return fieldLon + fieldLat + squareLon + squareLat;

    // Subsquare (24x24)
    adjLon %= 2;
    adjLat %= 1;
    const subsquareLon = String.fromCharCode('a'.charCodeAt(0) + Math.floor(adjLon * 12));
    const subsquareLat = String.fromCharCode('a'.charCodeAt(0) + Math.floor(adjLat * 24));

    return fieldLon + fieldLat + squareLon + squareLat + subsquareLon + subsquareLat;
}
