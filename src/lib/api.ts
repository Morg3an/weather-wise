export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" });

  if (!res.ok) {
    // Let callers toast / handle
    throw new Error(`Request failed ${res.status}`);
  }
  return res.json() as Promise<T>;
}