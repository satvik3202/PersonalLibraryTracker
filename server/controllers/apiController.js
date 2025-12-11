import fetch from 'node-fetch';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${process.env.GEMINI_API_KEY}`;


// @desc    Search Google Books
// @route   GET /api/external/gbooks/search
// @access  Private
export const searchGoogleBooks = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query "q" is required' });
  }

  try {
    const response = await fetch(`${GOOGLE_BOOKS_API_URL}${encodeURIComponent(q)}&maxResults=5`);
    const data = await response.json();
    
    const items = data.items || [];
    const results = items.map(item => {
      const info = item.volumeInfo;
      return {
        id: item.id,
        title: info.title || 'N/A',
        author: info.authors ? info.authors.join(', ') : 'Unknown Author',
        genre: info.categories ? info.categories[0] : 'Fiction',
        coverUrl: info.imageLinks ? info.imageLinks.thumbnail : '',
      };
    });
    
    res.json(results);
  } catch (error) {
    console.error("Google Books API error:", error);
    res.status(500).json({ message: 'Error fetching from Google Books API' });
  }
};

// @desc    Get insights from Gemini API
// @route   POST /api/external/gemini/insights
// @access  Private
export const getGeminiInsights = async (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  const systemPrompt = "You are a helpful literary expert. You provide concise insights about books.";
  const userQuery = `
    Please provide the following for the book "${title}" by ${author}:
    1. A one-paragraph summary.
    2. A list of 3-5 key themes.
    3. A list of 3 related reading suggestions (title and author).
    
    Base your answer on publicly available information.
  `;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    tools: [{ "google_search": {} }],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API Error:", errorBody);
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      const text = candidate.content.parts[0].text;
      
      let sources = [];
      const groundingMetadata = candidate.groundingMetadata;
      if (groundingMetadata && groundingMetadata.groundingAttributions) {
          sources = groundingMetadata.groundingAttributions
              .map(attr => ({
                  uri: attr.web?.uri,
                  title: attr.web?.title,
              }))
              .filter(source => source.uri && source.title);
      }
      
      res.json({ insight: text, sources: sources });
    } else {
      throw new Error("Invalid response structure from API.");
    }
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    res.status(500).json({ message: error.message });
  }
};
