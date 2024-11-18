const api_url = process.env.NEXT_PUBLIC_API_URL;

if (!api_url) {
  throw new Error("API is not defined.");
}

export default api_url;
