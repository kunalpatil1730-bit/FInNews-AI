import json
import datetime
from typing import Dict, Any, List, Optional
from app.config import settings
from app.prompt_templates import (
    SYSTEM_PROMPT_SIMPLIFIER,
    get_simplification_prompt,
    get_chat_prompt
)

try:
    from groq import Groq  # type: ignore
except ImportError:
    Groq = None

class GroqAIService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL  # Default: llama-3.3-70b-versatile
        self.client = None

        if self.api_key and Groq:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"Failed to initialize Groq client: {e}")

    def summarize_article(self, article: Dict[str, Any], language: str = "en") -> Dict[str, Any]:
        """Summarize financial article using Groq LLaMA 3.3-70B Versatile."""
        title = article.get("title", "Financial News Article")
        source = article.get("source", "Financial Media")
        content = article.get("content") or article.get("description") or title

        if self.client:
            try:
                prompt = get_simplification_prompt(title, source, content, language)
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT_SIMPLIFIER},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.2,
                    max_tokens=1500
                )

                resp_content = response.choices[0].message.content
                parsed_json = json.loads(resp_content)

                return {
                    **parsed_json,
                    "article_id": article.get("id"),
                    "language": language,
                    "model_used": f"Groq ({self.model})",
                    "analyzed_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                    "disclaimer": "AI-generated educational analysis. Not guaranteed financial advice.",
                    "is_ai_generated": True
                }
            except Exception as e:
                print(f"Groq API call error: {e}, falling back to deterministic Engine")

        return self._generate_fallback_analysis(article, language)

    def chat_response(self, messages: List[Dict[str, str]], article_context: Optional[Dict[str, Any]] = None, language: str = "en") -> Dict[str, Any]:
        """Multi-turn financial chat assistant powered by Groq LLaMA 3.3-70B Versatile."""
        latest_msg = messages[-1]["content"] if messages else ""
        history_str = "\n".join([
            f"{m.get('role', 'user').capitalize()}: {m.get('content', '')}"
            for m in messages[-6:]
        ])

        art_ctx_str = ""
        if article_context:
            art_ctx_str = f"Title: {article_context.get('title', '')} | Summary: {article_context.get('summary', article_context.get('description', ''))}"

        if self.client:
            try:
                prompt = get_chat_prompt(history_str, latest_msg, art_ctx_str, language)
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.4,
                    max_tokens=600
                )
                reply = response.choices[0].message.content
                return {
                    "reply": reply,
                    "role": "assistant",
                    "model_used": f"Groq ({self.model})",
                    "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
                }
            except Exception as e:
                print(f"Groq chat error: {e}")

        # Deterministic fallback response
        reply = self._fallback_chat_reply(latest_msg, language)
        return {
            "reply": reply,
            "role": "assistant",
            "model_used": "Deterministic Financial Engine",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

    def _fallback_chat_reply(self, query: str, language: str = "en") -> str:
        q = query.lower()
        if language == "hi":
            if "pe" in q or "ratio" in q:
                return "**पीई रेशियो (P/E Ratio)** बताता है कि निवेशक कंपनी के हर ₹1 लाभ के लिए कितना मूल्य दे रहे हैं।\n\n• **उच्च P/E:** भविष्य में तेज विकास की उम्मीद।"
            return "वित्तीय समाचारों को समझने में आपकी सहायता के लिए मैं उपलब्ध हूँ। आप ब्याज दरों, शेयर बाजार या अर्थव्यवस्था के बारे में पूछ सकते हैं!"
        elif language == "mr":
            if "pe" in q or "ratio" in q:
                return "**पीई रेशिओ (P/E Ratio)** कंपनीच्या प्रत्येक ₹१ नफ्यासाठी गुंतवणूकदार किती रक्कम देतात हे दर्शवतो."
            return "आर्थिक बातम्या सोप्या भाषेत समजून घेण्यासाठी मी आपली मदत करू शकतो!"
        else:
            if "pe" in q or "ratio" in q:
                return "**Price-to-Earnings (P/E) Ratio** measures how much investors pay for every $1 (or ₹1) of profit.\n\n• **High P/E:** Markets expect high future earnings growth.\n• **Low P/E:** May indicate value stock or slower growth expectations."
            elif "inflation" in q or "cpi" in q:
                return "**Inflation** is the rate at which general prices rise over time, eroding purchasing power.\n\n• Central banks raise repo/interest rates to cool excessive inflation."
            return "Financial markets move based on corporate earnings, interest rate decisions by central banks, and macroeconomic health. Ask me any financial concept you'd like broken down simply!"

    def _generate_fallback_analysis(self, article: Dict[str, Any], language: str = "en") -> Dict[str, Any]:
        title = article.get("title", "Financial Article")
        sentiment = article.get("initial_sentiment", "Neutral")
        score = article.get("sentiment_score", 10)

        terms_en = [
            {
                "term": "Interest Rate / Repo Rate",
                "simple_meaning": "The base benchmark percentage cost set by a central bank for borrowing money.",
                "example": "If the repo rate is 6.5%, commercial banks adjust loan & mortgage rates accordingly."
            },
            {
                "term": "Market Capitalization",
                "simple_meaning": "The total market valuation of all shares issued by a company combined.",
                "example": "A company with 10 million shares priced at $100 each has a market cap of $1 Billion."
            },
            {
                "term": "Price-to-Earnings (P/E) Ratio",
                "simple_meaning": "How much money investors pay for every $1 of annual profit earned by a company.",
                "example": "A P/E of 20 means paying $20 for $1 of net company profit."
            }
        ]

        if language == "hi":
            return {
                "article_id": article.get("id"),
                "language": "hi",
                "summary": f"यह वित्तीय समाचार \"{title}\" बाजार की प्रमुख गतिविधियों और आर्थिक प्रभाव पर प्रकाश डालता है।",
                "key_points": [
                    "कंपनी प्रदर्शन और केंद्रीय बैंक की नीतियां बाजार को प्रभावित कर रही हैं।",
                    "निवेशकों के लिए जोखिम और प्रतिफल का विश्लेषण महत्वपूर्ण है।",
                    "प्रमुख क्षेत्रों और कंपनियों के मूल्यांकन पर प्रभाव दिख रहा है।"
                ],
                "why_it_matters": "ब्याज दरों और कॉर्पोरेट मुनाफे का असर आम उपभोक्ताओं की बचत, होम लोन की EMI और निवेश पर पड़ता है।",
                "market_impact": "स्टॉक मार्केट में तरलता और सेक्टर-विशेष के शेयरों में उतार-चढ़ाव की संभावना।",
                "affected_sectors": article.get("sectors") or ["बैंकिंग", "तकनीक"],
                "affected_companies": article.get("companies") or ["प्रमुख सूचीबद्ध कंपनियां"],
                "important_numbers": ["मुख्य दरें और वित्तीय आंकड़े"],
                "financial_terms": [
                    {
                        "term": "रेपो रेट (Repo Rate)",
                        "simple_meaning": "वह ब्याज दर जिस पर सेंट्रल बैंक (RBI) वाणिज्यिक बैंकों को ऋण देता है।",
                        "example": "रेपो दर 6.5% होने पर बैंक लोन ब्याज दरें समायोजित करते हैं।"
                    }
                ],
                "sentiment": sentiment,
                "sentiment_score": score,
                "sentiment_reason": "सकारात्मक वित्तीय रिपोर्टिंग और स्थिर आर्थिक रुझानों के कारण वर्गीकृत।",
                "uncertainty": "वैश्विक आर्थिक माहौल और मुद्रास्फीति की अनिश्चितता।",
                "takeaway": "दीर्घकालिक वित्तीय अनुशासन और शोध-आधारित निवेश निर्णय लें।",
                "disclaimer": "एआई-जनित शैक्षिक विश्लेषण। यह प्रमाणित वित्तीय सलाह नहीं है।",
                "analyzed_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "model_used": "Deterministic Engine (Fallback)",
                "is_ai_generated": True
            }

        return {
            "article_id": article.get("id"),
            "language": "en",
            "summary": f"{title}. Key financial indicators reflect how market participants evaluate corporate earnings resilience, monetary policy decisions, and macroeconomic trends.",
            "key_points": [
                "Corporate earnings and interest rate trajectory guide market direction.",
                "Balance sheet liquidity dictates sectoral performance across key benchmark indices.",
                "Retail and institutional investors are calibrating risk management strategies."
            ],
            "why_it_matters": "Macroeconomic shifts in borrowing costs directly influence mortgage rates, corporate job growth, and consumer purchasing power.",
            "market_impact": "Influencing equity valuations, bond yields, and currency exchange rates across major markets.",
            "affected_sectors": article.get("sectors") or ["Banking", "Technology", "Financial Services"],
            "affected_companies": article.get("companies") or ["Industry Leaders"],
            "important_numbers": ["Key financial statistics and benchmark rates"],
            "financial_terms": terms_en,
            "sentiment": sentiment,
            "sentiment_score": score,
            "sentiment_reason": "Calculated based on balance sheet strength, revenue trends, and policy consistency.",
            "uncertainty": "Inflation volatility, global geopolitical developments, and consumer spending shifts.",
            "takeaway": "Focus on business fundamentals and long-term economic trends rather than short-term market noise.",
            "disclaimer": "AI-generated educational analysis. Not guaranteed financial advice.",
            "analyzed_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "model_used": "Deterministic Engine (Fallback)",
            "is_ai_generated": True
        }

groq_service = GroqAIService()
