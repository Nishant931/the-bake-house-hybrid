const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchFromApi(path: string) {
  const response = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
}

export const api = {
  getProducts: (category?: string) => 
    fetchFromApi(`/products${category ? `?category=${category}` : ''}`),
  
  getProduct: (slug: string) => 
    fetchFromApi(`/products/${slug}`),
    
  getCategories: () => 
    fetchFromApi('/categories'),
};
