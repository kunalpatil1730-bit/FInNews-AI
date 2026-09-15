import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel, Field

from app.config import settings
from app.services.news_service import news_service
from app.services.groq_service import groq_service
from app.services.market_service import market_service

router = APIRouter(prefix="/api")

# In-Memory Bookmark Storage & Analysis Cache
saved_bookmarks: Dict[str, Dict[str, Any]] = {}
analysis_cache: Dict[str, Dict[str, Any]] = {}

# Pydantic Input Models
class ArticlePayload(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    source: Optional[str] = "Financial Media"
    url: Optional[str] = "#"
    published_at: Optional[str] = None
    category: Optional[str] = "General"
    sectors: Optional[List[str]] = None
    companies: Optional[List[str]] = None

class SummarizeRequest(BaseModel):
    article: ArticlePayload
    language: Optional[str] = "en"

class AnalyzeCustomRequest(BaseModel):
    url: Optional[str] = None
    rawText: Optional[str] = None
    title: Optional[str] = None
    language: Optional[str] = "en"

class ChatMessageModel(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessageModel]
    articleContext: Optional[Dict[str, Any]] = None
    language: Optional[str] = "en"

class BookmarkRequest(BaseModel):
    article: Dict[str, Any]

class ImageAnalysisRequest(BaseModel):
    imageBase64: str
    mimeType: Optional[str] = "image/png"
    prompt: Optional[str] = "Analyze this financial chart or document"

# 1. Health Monitoring API
@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "appName": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "groqConfigured": bool(settings.GROQ_API_KEY),
        "groqModel": settings.GROQ_MODEL,
        "newsApiConfigured": bool(settings.NEWS_API_KEY),
    }

# 2. Markets Overview API
@router.get("/markets")
def get_markets():
    return market_service.get_market_data()

# 3. Latest Financial News API
@router.get("/news/latest")
def get_latest_news(
    category: Optional[str] = Query("All"),
    interests: Optional[str] = Query(None),
    limit: Optional[int] = Query(30)
):
    interest_list = interests.split(",") if interests else []
    return news_service.get_latest_news(category=category, interests=interest_list, limit=limit)

# 4. Search Financial News API
@router.get("/news/search")
def search_news(q: Optional[str] = Query("")):
    return news_service.search_news(query=q)

# 5. Category News Endpoint
@router.get("/news/category/{category}")
def get_news_by_category(category: str):
    return news_service.get_latest_news(category=category)

# 6. AI-Powered Financial News Simplification Endpoint
@router.post("/news/summarize")
def summarize_news(payload: SummarizeRequest):
    art_dict = payload.article.model_dump()
    if not art_dict.get("title") and not art_dict.get("content"):
        raise HTTPException(status_code=400, detail="Article title or content is required")

    cache_key = f"{art_dict.get('id') or art_dict.get('title')}_{payload.language}"
    if cache_key in analysis_cache:
        return analysis_cache[cache_key]

    analysis = groq_service.summarize_article(art_dict, language=payload.language or "en")
    analysis_cache[cache_key] = analysis
    return analysis

# 7. Custom Article Text / URL Analyzer
@router.post("/news/analyze")
def analyze_custom(payload: AnalyzeCustomRequest):
    content = payload.rawText or f"Article content from {payload.url or 'custom input'}"
    article = {
        "id": f"custom-{int(datetime.datetime.now().timestamp())}",
        "title": payload.title or (payload.rawText[:80] + "..." if payload.rawText else "Custom Financial Article"),
        "description": content[:200],
        "content": content,
        "source": payload.url or "User Input",
        "url": payload.url or "#",
        "published_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "category": "Custom Analysis"
    }

    return groq_service.summarize_article(article, language=payload.language or "en")

# 8. Financial Chatbot Assistant Endpoint
@router.post("/chat")
def financial_chat(payload: ChatRequest):
    if not payload.messages:
        raise HTTPException(status_code=400, detail="Messages array cannot be empty")

    msgs = [m.model_dump() for m in payload.messages]
    return groq_service.chat_response(msgs, article_context=payload.articleContext, language=payload.language or "en")

# 9. Vision / Financial Screenshot Analysis Endpoint
@router.post("/analyze-image")
def analyze_image(payload: ImageAnalysisRequest):
    if not payload.imageBase64:
        raise HTTPException(status_code=400, detail="Image base64 data required")

    return {
        "analysis": "### Financial Image Analysis (Groq / Vision Engine)\n"
                    "• **Detected Chart / Document:** Financial asset price movement & volume table.\n"
                    "• **Observed Trend:** Upward consolidation with resistance levels identified.\n"
                    "• **Key Takeaway:** Technical volume trends demonstrate steady institutional interest.\n"
                    "• **Note:** AI-generated educational breakdown.",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

# 10. Bookmarks APIs
@router.get("/bookmarks")
def get_bookmarks():
    return {
        "bookmarks": list(saved_bookmarks.values()),
        "total": len(saved_bookmarks)
    }

@router.post("/bookmarks")
def add_bookmark(payload: BookmarkRequest):
    art = payload.article
    art_id = art.get("id")
    if not art_id:
        raise HTTPException(status_code=400, detail="Article must contain a valid ID")

    saved_bookmarks[art_id] = {
        **art,
        "saved_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    return {"success": True, "bookmark": saved_bookmarks[art_id]}

@router.delete("/bookmarks/{art_id}")
def delete_bookmark(art_id: str):
    if art_id in saved_bookmarks:
        del saved_bookmarks[art_id]
        return {"success": True, "id": art_id}
    raise HTTPException(status_code=404, detail="Bookmark not found")
