import axios from 'axios';

const API_KEY = 'AIzaSyCHqiFGPCdU6uqI3kwDb_P-x3NckEd86zc';

const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { textArray, targetLang } = req.body;

  // console.log('textArray', textArray);
  try {
    // console.log('textArray');

    console.log('url', url);

    console.log('찍힙닏~~');
    const response = await axios.post(url, { q: ['korean'], target: targetLang, format: 'text' });
    console.log('response ::: ', response);
    res.status(200).json({ translations: response.data.data.translations.map((t) => t.translatedText) });
  } catch (error) {
    res.status(500).json({ error: 'Translation Failed' });
  }
}
