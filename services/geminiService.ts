
import { GoogleGenAI, Type } from "@google/genai";

export const getChineseExplanation = async (word: string, lang: 'EN' | 'BN') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Explain the Chinese word or character "${word}" to a ${lang === 'EN' ? 'English' : 'Bengali'} speaker. 
  Provide: 
  1. Pinyin 
  2. Meaning in ${lang === 'EN' ? 'English' : 'Bengali'}
  3. Example sentence in Chinese, Pinyin, and ${lang === 'EN' ? 'English' : 'Bengali'}
  4. Cultural context or usage tip if applicable.
  Keep it concise and educational.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn't fetch the explanation right now.";
  }
};

export const getDailyWord = async (lang: 'EN' | 'BN') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a 'Chinese Word of the Day' for a student. Return JSON format.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            pinyin: { type: Type.STRING },
            meaning: { type: Type.STRING },
            example: { type: Type.STRING },
          },
          required: ["word", "pinyin", "meaning", "example"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return {
      word: '你好',
      pinyin: 'Nǐ hǎo',
      meaning: lang === 'EN' ? 'Hello' : 'হ্যালো/নমস্কার',
      example: '你好，很高兴见到你 (Nǐ hǎo, hěn gāoxìng jiàn dào nǐ)'
    };
  }
};

export const getChatbotResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are the official AI Assistant for "Masud Language Lab" (owned by Md. Masud Rana). 
    Your goal is to help students learn Chinese and navigate the website.

    PERSONALITY:
    - Extremely friendly, polite, and student-friendly.
    - Act like a helpful, caring teacher assistant.
    - Use a respectful and encouraging tone.
    - Never be rude or robotic.

    GREETING BEHAVIOR:
    - Use Islamic and polite greetings like "আসসালামু আলাইকুম 😊" or "হ্যালো! আমি আপনার সহকারী".
    - Welcome students warmly.

    CONVERSATION STYLE:
    - Primary language: Bengali (Bangla). Respond in simple, clear Bengali unless the user specifically asks in English.
    - Use encouraging words for learners.
    - Provide beautifully organized, step-by-step explanations.
    - For Chinese language questions, explain clearly and patiently with Pinyin and Bengali meaning. Provide examples where helpful.

    CONTEXT & KNOWLEDGE:
    - Instructor: Md. Masud Rana (Chinese Interpreter & Teacher with 7+ years experience).
    - Courses: HSK 1, 2, 3, 4, and Spoken Chinese. Prices: ৳ 1,500 to ৳ 6,000.
    - Books: "Bengali to Chinese Master Guide" and "Vocabulary Flashcards".
    - Payments: bKash, Nagad, Rocket. Students pay to personal numbers, then submit TxID.
    - Contact: WhatsApp 01788060657.

    SUPPORT GUIDANCE:
    - If a student is confused, guide them politely to the right section (Courses, Lessons, or Blog).
    - If a question is unclear, politely ask for clarification.
    - Explain enrollment clearly: Visit Courses page, pay via mobile banking, then submit Transaction ID for admin approval.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "দুঃখিত, এই মুহূর্তে আমি উত্তর দিতে পারছি না। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।";
  }
};

export const notifyAdminOfPayment = async (enrollmentData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    New Course Enrollment Payment Received.
    Subject: New Course Enrollment Payment Received
    Recipient: mdmasudrana0783@gmail.com
    
    Details:
    User Name: ${enrollmentData.userName}
    User Email: ${enrollmentData.userEmail}
    Course Name: ${enrollmentData.courseName}
    Amount: ${enrollmentData.amount}
    Payment Method: ${enrollmentData.paymentMethod}
    Sender Mobile Number: ${enrollmentData.senderNumber}
    Transaction Number: ${enrollmentData.transactionId}

    Act as an email server. Confirm that this notification has been formatted and triggered for sending.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    console.log("Admin Notification Sent (Simulated):", response.text);
    return true;
  } catch (error) {
    console.error("Notification Error:", error);
    return false;
  }
};

export const notifyAdminOfBookOrder = async (orderData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    New Book Order Payment Received.
    Subject: New Book Order Payment Received
    Recipient: mdmasudrana0783@gmail.com
    
    Details:
    User Name: ${orderData.userName}
    User Email: ${orderData.userEmail}
    Books Ordered: ${orderData.items.map((i: any) => i.title).join(', ')}
    Total Amount: ${orderData.totalAmount}
    Payment Method: ${orderData.paymentMethod}
    Sender Mobile Number: ${orderData.senderNumber}
    Transaction Number: ${orderData.transactionId}

    Act as an email server. Confirm that this notification has been formatted and triggered for sending.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    console.log("Admin Book Notification Sent (Simulated):", response.text);
    return true;
  } catch (error) {
    console.error("Notification Error:", error);
    return false;
  }
};
