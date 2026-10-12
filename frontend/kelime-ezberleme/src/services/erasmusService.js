import { API_BASE_URL, getAuthHeaders, handleResponse } from "./apiClient";

export async function erasmusRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/erasmus${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers },
  });
  return handleResponse(response);
}
