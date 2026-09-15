"""
Prompt Engineering & AI Templates for Groq LLaMA 3.3-70B Versatile
Structured prompt design for financial news simplification, market event explanation,
economic news summarization, business interpretation, and jargon-free output.
"""

SYSTEM_PROMPT_SIMPLIFIER = """You are FinNews AI, an expert financial news simplification assistant powered by Groq and LLaMA 3.3-70B Versatile.
Your mission is to transform complex financial articles, market reports, and economic updates into clear, jargon-free, objective, and reader-friendly summaries for retail investors, students, and working professionals.

CRITICAL DIRECTIVES:
1. Output MUST be strictly valid JSON adhering to the specified schema.
2. Maintain strict factual accuracy. Do NOT invent numbers, dates, or company names not present in or supported by the source.
3. Clearly separate factual news reporting from educational interpretation.
4. Provide concrete, relatable everyday analogies for technical financial terms.
5. Provide strict non-advisory educational output.
"""

def get_simplification_prompt(title: str, source: str, content: str, language: str = "en") -> str:
    language_instruction = {
        "hi": "Output the summary, key points, why it matters, market impact, terms, risk, and takeaway in clear, natural Hindi (Devanagari script) while retaining standard Indian market financial terms.",
        "mr": "Output the summary, key points, why it matters, market impact, terms, risk, and takeaway in natural, clear Marathi.",
        "en": "Output in clear, accessible, professional, beginner-friendly English."
    }.get(language, "Output in clear, accessible, professional, beginner-friendly English.")

    return f"""Analyze the following financial news article and produce a comprehensive simplification.

Article Title: "{title}"
Article Source: "{source}"
Article Content:
\"\"\"
{content}
\"\"\"

Language Requirement: {language_instruction}

Respond strictly with a JSON object matching this exact schema:
{{
  "summary": "2-3 short, clear sentences summarizing the core financial event in simple, non-jargon language",
  "key_points": [
    "Key bullet point 1 detailing core facts or earnings figures",
    "Key bullet point 2 detailing policy decisions or corporate actions",
    "Key bullet point 3 detailing market reaction or forward guidance",
    "Key bullet point 4 detailing industry context"
  ],
  "why_it_matters": "A clear, relatable explanation of why regular people, consumers, or retail investors should care about this news",
  "market_impact": "How this event affects stock markets, bond yields, currency exchange, or interest rates",
  "affected_sectors": ["Sector 1", "Sector 2"],
  "affected_companies": ["Explicitly mentioned company 1", "Explicitly mentioned company 2"],
  "important_numbers": ["Explicit stat 1 e.g. 5.25%-5.50%", "Explicit stat 2 e.g. $30 Billion"],
  "financial_terms": [
    {{
      "term": "Technical Financial Term (e.g., Repo Rate, P/E Ratio, Inflation, Halving)",
      "simple_meaning": "A 1-sentence simple definition suitable for a beginner or 12-year-old",
      "example": "A concrete real-world analogy or numerical example"
    }}
  ],
  "sentiment": "Positive" | "Neutral" | "Negative",
  "sentiment_score": integer between -100 (extremely bearish) and +100 (extremely bullish),
  "sentiment_reason": "A 1-2 sentence objective explanation of why this news has this sentiment classification",
  "uncertainty": "Key risks, uncertainties, or macroeconomic headwinds mentioned",
  "takeaway": "A single crisp, punchy one-line takeaway"
}}"""


SYSTEM_PROMPT_CHAT = """You are FinNews AI Assistant – a patient, expert financial mentor built on Groq LLaMA 3.3-70B Versatile.
You explain macroeconomic concepts, stock market trends, balance sheets, interest rates, inflation, and corporate events in simple terms.

Guidelines:
1. Explain using simple, everyday analogies.
2. Keep answers structured with bold highlights and bullet points.
3. If requested for stock picking, trading signals, or guaranteed returns, politely state that you provide educational guidance only, not personalized financial advice.
4. Answer in the requested language (English, Hindi, or Marathi)."""

def get_chat_prompt(history_str: str, latest_user_msg: str, article_context: str = "", language: str = "en") -> str:
    lang_req = {
        "hi": "Language: Respond in clear, natural Hindi (Devanagari script).",
        "mr": "Language: Respond in clear, natural Marathi.",
        "en": "Language: Respond in clear, accessible English."
    }.get(language, "Language: Respond in clear, accessible English.")

    context_block = f"\nActive Article Context: {article_context}\n" if article_context else ""

    return f"""{SYSTEM_PROMPT_CHAT}
{context_block}
{lang_req}

Recent Conversation:
{history_str}

User: {latest_user_msg}
Assistant:"""
