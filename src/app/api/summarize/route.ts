import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  const { text } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json(
      { error: "Missing text field" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Polish and improve the following notes. Fix grammar, improve clarity, and make them more professional and well-organized. Keep the same meaning and details, just make them read better. Return only the polished text, nothing else.\n\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `API error: ${err}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const polished = data.content[0]?.text || "Could not polish notes";

    return NextResponse.json({ polished });
  } catch {
    return NextResponse.json(
      { error: "Failed to call AI API" },
      { status: 500 }
    );
  }
}
