import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "NVIDIA API key not configured." }, { status: 500 });
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You are Green AI, the helpful customer support assistant for BM Green House. You help customers with questions about our flagship product: Roasted Dates Seed Powder. Facts about the product: It is 100% natural, caffeine-free, rich in antioxidants and minerals (magnesium, calcium, iron), zero sugar, carefully sorted and roasted to perfection. It is a healthy, natural alternative to coffee. Be concise, friendly, and enthusiastic."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.5,
        max_tokens: 150
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to fetch AI response");

    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
