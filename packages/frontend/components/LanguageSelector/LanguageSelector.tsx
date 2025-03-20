'use client';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
  { code: 'pt', name: 'Português' },
];

async function translateTextArray(textArray: string[], targetLang: string) {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textArray, targetLang }),
  });

  const data = await response.json();
  return data.translations;
}

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [originalText, setOriginalText] = useState<string[]>([]);
  const [isTranslated, setIsTranslated] = useState(false);

  const handleTranslate = async (targetLang: string) => {
    if (!isTranslated) {
      const textNodes: { node: Node; original: string }[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);

      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeValue?.trim()) {
          textNodes.push({ node, original: node.nodeValue });
        }
      }

      console.log('textNodes ::', textNodes);
      setOriginalText(textNodes.map((t) => t.original)); // 원래 텍스트 저장
      const translatedTexts = await translateTextArray(
        textNodes.map((t) => t.original),
        targetLang
      );
      textNodes.forEach((t, i) => (t.node.nodeValue = translatedTexts[i])); // 번역 적용
    } else {
      // 원래 언어로 복구
      // const textNodes: { node: Node; original: string }[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      let index = 0;

      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeValue?.trim()) {
          node.nodeValue = originalText[index++];
        }
      }
    }

    setIsTranslated(!isTranslated);
    setSelectedLanguage(targetLang);
  };

  return (
    <div>
      <select value={selectedLanguage} onChange={(e) => handleTranslate(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
