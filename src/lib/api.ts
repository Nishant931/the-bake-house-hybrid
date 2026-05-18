const API_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || 'http://localhost:3000';

export async function fetchFromApi(path: string) {
  // During build time, if the API URL is not set, we should avoid failing
  if (!process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL && typeof window === 'undefined') {
    console.warn(`Warning: NEXT_PUBLIC_CLOUDFLARE_API_URL is not set. Skipping fetch for ${path} during build.`);
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/api${path}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.error(`API request failed for ${path}: ${response.statusText}`);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching from API for ${path}:`, error);
    return [];
  }
}

export const api = {
  getProducts: (category?: string) => 
    fetchFromApi(`/products${category ? `?category=${category}` : ''}`),
  
  getProduct: (slug: string) => 
    fetchFromApi(`/products/${slug}`),
    
  getCategories: () => 
    fetchFromApi('/categories'),
};
