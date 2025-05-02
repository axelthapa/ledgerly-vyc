
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

interface Quote {
  text: string;
  author: string;
}

// Some inspirational quotes
const QUOTES: Quote[] = [
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis"
  },
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair"
  },
  {
    text: "Dream big and dare to fail.",
    author: "Norman Vaughan"
  }
];

// Nepali translations of the quotes
const NEPALI_QUOTES: Quote[] = [
  {
    text: "भविष्य भविष्यवाणी गर्ने सबैभन्दा राम्रो तरिका यसलाई निर्माण गर्नु हो।",
    author: "पिटर ड्रकर"
  },
  {
    text: "सफलता अन्तिम होइन, असफलता घातक होइन: यो निरन्तरता दिने साहस नै महत्त्वपूर्ण छ।",
    author: "विन्स्टन चर्चिल"
  },
  {
    text: "तिम्रो समय सीमित छ, यसलाई अरू कसैको जीवन जिएर खेर नफाल।",
    author: "स्टिभ जब्स"
  },
  {
    text: "महान् काम गर्ने एकमात्र तरिका आफूले गर्ने कामलाई माया गर्नु हो।",
    author: "स्टिभ जब्स"
  },
  {
    text: "अगाडि बढ्ने रहस्य भनेको सुरु गर्नु हो।",
    author: "मार्क ट्वेन"
  },
  {
    text: "तिमीले गर्न सक्छौ भन्ने विश्वास गर र तिमी आधा बाटोमा पुगिसकेका हुन्छौ।",
    author: "थियोडोर रुजवेल्ट"
  },
  {
    text: "तपाईं कति विस्तारै अघि बढ्नुहुन्छ भन्ने कुरा महत्त्वपूर्ण होइन, जब सम्म तपाईं रोक्नुहुन्न।",
    author: "कन्फुसियस"
  },
  {
    text: "सफलता प्राय: ती व्यक्तिहरूमा आउँछ जो त्यसलाई खोज्नका लागि धेरै व्यस्त छन्।",
    author: "हेनरी डेभिड थोरो"
  },
  {
    text: "घडीलाई नहेर्नुहोस्; त्यसले के गर्छ त्यही गर्नुहोस्। अगाडि बढ्नुहोस्।",
    author: "स्याम लेभेन्सन"
  },
  {
    text: "भविष्य तिनीहरूको हो जसले आफ्नो सपनाको सुन्दरतामा विश्वास गर्दछन्।",
    author: "इलेनोर रुजवेल्ट"
  },
  {
    text: "अर्को लक्ष्य राख्न वा नयाँ सपना देख्न तपाईं कहिल्यै धेरै बूढो हुनुहुन्न।",
    author: "सी.एस. लुइस"
  },
  {
    text: "हाम्रो भोलिको प्राप्तिको एकमात्र सीमा आजको हाम्रो शंका हो।",
    author: "फ्रेंकलिन डी. रुजवेल्ट"
  },
  {
    text: "तपाईं जहाँ हुनुहुन्छ, तपाईंसँग जे छ, त्यसबाट जे गर्न सक्नुहुन्छ गर्नुहोस्।",
    author: "थियोडोर रुजवेल्ट"
  },
  {
    text: "तपाईंले कहिल्यै चाहेको हरेक कुरा डरको अर्को पट्टि छ।",
    author: "जर्ज एडेयर"
  },
  {
    text: "ठूलो सपना देख्नुहोस् र असफल हुने साहस गर्नुहोस्।",
    author: "नोर्मन भान"
  }
];

const QuoteOfTheDay: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const { isNepali } = useLanguage();

  useEffect(() => {
    const getRandomQuote = () => {
      const quotesList = isNepali ? NEPALI_QUOTES : QUOTES;
      const randomIndex = Math.floor(Math.random() * quotesList.length);
      return quotesList[randomIndex];
    };

    setQuote(getRandomQuote());
  }, [isNepali]);

  if (!quote) return null;

  return (
    <Card className="bg-vyc-primary/5 border-none shadow-sm">
      <CardContent className="p-4">
        <p className="text-lg font-medium italic mb-2">"{quote.text}"</p>
        <p className="text-right text-sm text-muted-foreground">— {quote.author}</p>
      </CardContent>
    </Card>
  );
};

export default QuoteOfTheDay;
