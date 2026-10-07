/**
 * Voice Expense Parser for Financial Observatory
 * Deterministic, fast, offline-capable natural language speech parsing.
 * Supports INR/India colloquial speech patterns:
 * - "Spent 450 rupees on dinner"
 * - "Paid 120 for Uber using UPI"
 * - "Spent 800 on groceries yesterday"
 * - "₹250 coffee"
 * - "Paid 1500 for shopping"
 * - "500 rs"
 * - "1.2k on petrol"
 */

import type { PaymentMethod } from "../types";

export interface VoiceParsedExpense {
  amount: number | null;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  type: "expense";
  rawTranscript: string;
  confidence: number;
}

const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
  lakh: 100000,
  crore: 10000000,
};

function wordsToNumber(text: string): number | null {
  const words = text.toLowerCase().split(/[\s-]+/);
  let total = 0;
  let current = 0;
  let hasNumber = false;

  for (const word of words) {
    if (NUMBER_WORDS[word] !== undefined) {
      hasNumber = true;
      const val = NUMBER_WORDS[word];
      if (val === 100) {
        current = (current === 0 ? 1 : current) * 100;
      } else if (val === 1000 || val === 100000 || val === 10000000) {
        current = (current === 0 ? 1 : current) * val;
        total += current;
        current = 0;
      } else {
        current += val;
      }
    }
  }

  if (!hasNumber) return null;
  return total + current;
}

export function parseVoiceExpense(rawTranscript: string): VoiceParsedExpense {
  const trimmed = rawTranscript.trim();
  const lower = trimmed.toLowerCase();

  // 1. Amount Extraction
  let amount: number | null = null;

  // Handle "1.2k" or "1k"
  const kMatch = lower.match(/\b(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    amount = Math.round(parseFloat(kMatch[1]) * 1000);
  }

  // Handle numeric currency formats: ₹500, Rs. 500, 500 rupees, 500 rs, INR 500
  if (amount === null) {
    const currencyBefore = lower.match(/(?:₹|rs\.?|inr)\s*(\d+(?:\.\d{1,2})?)/i);
    if (currencyBefore) {
      amount = parseFloat(currencyBefore[1]);
    }
  }

  if (amount === null) {
    const currencyAfter = lower.match(/(\d+(?:\.\d{1,2})?)\s*(?:₹|rs\.?|inr|rupees?|bucks)/i);
    if (currencyAfter) {
      amount = parseFloat(currencyAfter[1]);
    }
  }

  // Handle "spent 500", "paid 500", "for 500"
  if (amount === null) {
    const verbMatch = lower.match(/(?:spent|paid|cost|for)\s+(\d+(?:\.\d{1,2})?)/i);
    if (verbMatch) {
      amount = parseFloat(verbMatch[1]);
    }
  }

  // Generic fallback: first number found
  if (amount === null) {
    const anyNumber = lower.match(/\b(\d+(?:\.\d{1,2})?)\b/);
    if (anyNumber) {
      amount = parseFloat(anyNumber[1]);
    }
  }

  // Word fallback: e.g. "five hundred rupees"
  if (amount === null) {
    const wordNum = wordsToNumber(lower);
    if (wordNum !== null && wordNum > 0) {
      amount = wordNum;
    }
  }

  // 2. Payment Method Extraction
  let paymentMethod: PaymentMethod = "UPI"; // INR-first default
  if (/\b(?:credit\s*card)\b/i.test(lower)) {
    paymentMethod = "Credit Card";
  } else if (/\b(?:debit\s*card)\b/i.test(lower)) {
    paymentMethod = "Debit Card";
  } else if (/\b(?:cash|in\s*cash)\b/i.test(lower)) {
    paymentMethod = "Cash";
  } else if (/\b(?:bank\s*transfer|net\s*banking|transfer|neft|imps)\b/i.test(lower)) {
    paymentMethod = "Bank Transfer";
  } else if (/\b(?:upi|gpay|google\s*pay|phonepe|paytm)\b/i.test(lower)) {
    paymentMethod = "UPI";
  }

  // 3. Date Extraction
  // Use local date arithmetic to avoid UTC vs IST off-by-one errors.
  function localDateString(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const today = new Date();
  let dateStr = localDateString(today);

  if (/\b(?:day\s*before\s*yesterday)\b/i.test(lower)) {
    const d = new Date(today);
    d.setDate(d.getDate() - 2);
    dateStr = localDateString(d);
  } else if (/\b(?:yesterday)\b/i.test(lower)) {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    dateStr = localDateString(d);
  }

  // 4. Category & Description Extraction
  let category = "Other";
  let detectedMerchant = "";

  const categoryMap: Record<string, { category: string; keywords: string[] }> = {
    food: {
      category: "Food & Dining",
      keywords: [
        "dinner", "lunch", "breakfast", "food", "meal", "coffee", "tea", "chai",
        "snacks", "cafe", "restaurant", "pizza", "burger", "biryani", "noodles",
        "zomato", "swiggy", "groceries", "grocery", "supermarket", "milk", "bread",
        "veggies", "vegetables", "fruits", "chicken", "meat", "starbucks",
      ],
    },
    transport: {
      category: "Transport",
      keywords: [
        "uber", "ola", "cab", "taxi", "auto", "rickshaw", "metro", "bus", "petrol",
        "diesel", "fuel", "toll", "parking", "train", "flight", "rapido", "ride",
      ],
    },
    utilities: {
      category: "Utilities",
      keywords: [
        "electricity", "water", "gas", "cylinder", "wifi", "broadband", "internet",
        "recharge", "phone bill", "mobile bill", "dth", "bill",
      ],
    },
    entertainment: {
      category: "Entertainment",
      keywords: [
        "movie", "movies", "cinema", "tickets", "ticket", "netflix", "prime",
        "hotstar", "spotify", "youtube", "concert", "game", "gaming", "party",
        "pub", "club", "drinks", "beer",
      ],
    },
    shopping: {
      category: "Shopping",
      keywords: [
        "shopping", "clothes", "shirt", "t-shirt", "pants", "jeans", "dress",
        "shoes", "amazon", "flipkart", "myntra", "zara", "mall", "electronics",
        "laptop", "headphones", "gadget",
      ],
    },
    housing: {
      category: "Housing",
      keywords: [
        "rent", "maintenance", "society", "flat", "house", "maid", "domestic",
        "repair", "plumber", "carpenter",
      ],
    },
    health: {
      category: "Health",
      keywords: [
        "medicine", "meds", "medical", "doctor", "hospital", "clinic", "pharmacy",
        "gym", "fitness", "dentist", "dental", "tests",
      ],
    },
  };

  // Find best matching category and keyword
  for (const group of Object.values(categoryMap)) {
    for (const kw of group.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "i");
      if (regex.test(lower)) {
        category = group.category;
        detectedMerchant = kw.charAt(0).toUpperCase() + kw.slice(1);
        break;
      }
    }
    if (category !== "Other") break;
  }

  // 5. Clean up description
  let description = detectedMerchant;
  if (!description) {
    // Attempt to extract item from phrases like "spent X on Y" or "paid X for Y"
    const prepMatch = lower.match(/(?:on|for)\s+([a-z0-9\s]+?)(?:\s+(?:using|by|in|with|yesterday|today)|$)/i);
    if (prepMatch && prepMatch[1]) {
      const candidate = prepMatch[1]
        .replace(/\b(?:rs|rupees|inr|cash|upi|card)\b/gi, "")
        .trim();
      if (candidate.length > 1) {
        description = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }
  }

  if (!description) {
    description = category !== "Other" ? category : "Expense";
  }

  return {
    amount,
    category,
    description,
    paymentMethod,
    date: dateStr,
    type: "expense",
    rawTranscript: trimmed,
    confidence: amount !== null && category !== "Other" ? 0.95 : amount !== null ? 0.8 : 0.4,
  };
}
