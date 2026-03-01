/**
 * Builds a clean WordPress REST API URL handling both pretty and plain permalinks.
 * 
 * @param {string} endpoint The endpoint path (e.g., 'academia-lms/v1/courses')
 * @param {Object} params Key-value pairs of query parameters
 * @returns {string} The full constructed URL
 */
export const buildApiUrl = (endpoint, params = {}) => {
    const root = window.academiaLmsData.root;

    // Clean endpoint: remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

    // Base URL construction
    let url = root;

    // Check if root already has query params (common in plain permalinks)
    const hasParams = url.includes('?');

    if (hasParams) {
        // Plain permalinks: root is something like index.php?rest_route=/
        // We append the endpoint directly
        url += cleanEndpoint;
    } else {
        // Pretty permalinks: root is something like wp-json/
        url += cleanEndpoint;
    }

    // Append query parameters
    const queryEntries = Object.entries(params).filter(([_, value]) => value !== undefined && value !== '');

    if (queryEntries.length > 0) {
        const queryParams = new URLSearchParams();
        queryEntries.forEach(([key, value]) => queryParams.append(key, value));

        // Use '&' if the URL already has a '?' (either from root or endpoint), otherwise use '?'
        const separator = url.includes('?') ? '&' : '?';
        url += separator + queryParams.toString();
    }

    return url;
};
