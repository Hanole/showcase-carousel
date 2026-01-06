const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";



export function fetchCollection(slug) {
  const url = `${BASE_URL}/collections/${slug}/games?key=${API_KEY}`;
  return fetch(url)
    .then((response) => {
      console.log("RAWG response status:", response.status);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("RAWG data:", data);
      if (!data.results) return [];
      return data.results.map((game) => {
        return {
          id: game.id,
          name: game.name,
          short_screenshots: game.short_screenshots || [],
          link: `https://rawg.io/games/${game.slug}`,
          clip: game.clip ? game.clip.clip : null,
          released: game.released,
          rating: game.rating,
          genres: game.genres || [],
          upvotes: 0,
          downvotes: 0,
        };
      });
    });
}

