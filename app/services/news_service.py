import requests
import datetime
import re
from typing import List, Dict, Any, Optional
from app.config import settings

# High quality curated financial news baseline dataset
CURATED_FINANCIAL_ARTICLES = [
    {
        "id": "art-1",
        "title": "Federal Reserve Maintains Interest Rates at 5.25%-5.50% Amid Lingering Inflation Pressures",
        "description": "The US Federal Reserve decided to hold interest rates steady, acknowledging persistent economic resilience while waiting for clearer signs that inflation will cooling toward target.",
        "content": "The US Federal Reserve concluded its policy meeting by unanimously deciding to keep the benchmark federal funds rate steady between 5.25% and 5.50%, holding borrowing costs at a two-decade peak. Federal Reserve Chairman Jerome Powell noted during the post-decision press briefing that while significant progress has been made reducing annual headline inflation from its 9% peak in 2022 to approximately 2.9%, core service-sector inflation and housing rent pressures remain stubbornly elevated.",
        "source": "Bloomberg Financial",
        "url": "https://www.bloomberg.com/markets",
        "image_url": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
        "published_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "category": "Economy",
        "sectors": ["Banking", "Technology", "Real Estate"],
        "companies": ["Federal Reserve", "JPMorgan Chase", "Apple", "Microsoft"],
        "initial_sentiment": "Neutral",
        "sentiment_score": 5,
    },
    {
        "id": "art-2",
        "title": "NVIDIA Reports Record $30 Billion Quarterly Revenue as Cloud Providers Expand AI Infrastructure",
        "description": "Semiconductor giant NVIDIA blew past Wall Street revenue expectations powered by relentless enterprise demand for Blackwell and Hopper GPUs.",
        "content": "NVIDIA Corporation released record-breaking quarterly financial results, generating $30.04 billion in total revenue, marking an impressive 122% surge year-over-year. The company's specialized Data Center business alone contributed $26.3 billion, driven by hyperscale cloud service providers including Microsoft Azure, Amazon Web Services, Alphabet Google Cloud, and Meta Platforms.",
        "source": "Reuters Technology & Markets",
        "url": "https://www.reuters.com/technology",
        "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        "published_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=2)).isoformat(),
        "category": "Technology",
        "sectors": ["IT", "Semiconductors", "Cloud Computing"],
        "companies": ["NVIDIA", "Microsoft", "Amazon", "Alphabet", "TSMC"],
        "initial_sentiment": "Positive",
        "sentiment_score": 78,
    },
    {
        "id": "art-3",
        "title": "Reserve Bank of India (RBI) Keeps Repo Rate at 6.50%, Prioritizes Domestic Food Inflation Management",
        "description": "RBI Monetary Policy Committee retains repo rate at 6.5% for the ninth consecutive meeting to align CPI inflation with 4%.",
        "content": "The Reserve Bank of India's Monetary Policy Committee, chaired by Governor Shaktikanta Das, voted to retain the key benchmark repo rate unchanged at 6.50 percent. The central bank retained its monetary stance of withdrawal of accommodation to ensure that inflation progressively aligns with the medium-term target while supporting economic growth.",
        "source": "The Economic Times",
        "url": "https://economictimes.indiatimes.com",
        "image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
        "published_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=4)).isoformat(),
        "category": "Banking",
        "sectors": ["Banking", "FMCG", "Agriculture"],
        "companies": ["Reserve Bank of India", "State Bank of India", "HDFC Bank", "ICICI Bank"],
        "initial_sentiment": "Positive",
        "sentiment_score": 55,
    },
    {
        "id": "art-4",
        "title": "TCS Secures Multi-Million Dollar AI Transformation Deal with European Financial Group",
        "description": "Tata Consultancy Services inks an expansive multi-year digital transformation and cloud modernization contract.",
        "content": "India's largest IT services exporter, Tata Consultancy Services (TCS), announced a strategic multi-year agreement with a premier European financial conglomerate to modernize core retail banking applications using generative artificial intelligence and hybrid cloud architectures.",
        "source": "Financial Express",
        "url": "https://www.financialexpress.com",
        "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
        "published_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=6)).isoformat(),
        "category": "Stock Market",
        "sectors": ["IT", "Banking", "Consulting"],
        "companies": ["TCS", "Tata Group", "Infosys", "Wipro"],
        "initial_sentiment": "Positive",
        "sentiment_score": 68,
    },
    {
        "id": "art-5",
        "title": "Gold Surges to Record Highs Near $2,550/oz on Geopolitical Uncertainty and Central Bank Buying",
        "description": "Bullion prices hit unprecedented international territory as global central banks diversify reserve holdings.",
        "content": "Gold prices extended their historic rally today, touching an all-time record spot high of $2,550 per ounce on international commodity bourses. Market strategists attribute bullion's persistent strength to aggressive physical buying by central banks across emerging nations seeking to hedge geopolitical volatility.",
        "source": "Commodity Watch & Mint",
        "url": "https://www.livemint.com",
        "image_url": "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80",
        "published_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=8)).isoformat(),
        "category": "Global Markets",
        "sectors": ["Commodities", "Jewelry", "Central Banking"],
        "companies": ["MCX", "Titan Company", "World Gold Council"],
        "initial_sentiment": "Positive",
        "sentiment_score": 62,
    },
    {
        "id": "art-6",
        "title": "Fintech Unicorn PhonePe Achieves Annualized Payment Volume of $1.5 Trillion, Prepares for IPO",
        "description": "Walmart-backed PhonePe reports sustained UPI market share dominance exceeding 48%.",
        "content": "Leading Indian digital payments unicorn PhonePe confirmed crossing an annualized payment total volume (TPV) of $1.5 trillion, processing over 7.5 billion monthly transactions across the Unified Payments Interface (UPI) network.",
        "source": "TechCrunch & FinTech Daily",
        "url": "https://techcrunch.com",
        "image_url": "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
        "published_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=10)).isoformat(),
        "category": "Startups",
        "sectors": ["Fintech", "Banking", "E-commerce"],
        "companies": ["PhonePe", "Walmart", "Paytm", "NPCI"],
        "initial_sentiment": "Positive",
        "sentiment_score": 72,
    }
]

class NewsService:
    def __init__(self):
        self.api_key = settings.NEWS_API_KEY

    def fetch_from_newsapi(self, category: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        """Fetch real-time financial news from NewsAPI."""
        if not self.api_key:
            return []

        try:
            url = "https://newsapi.org/v2/top-headlines"
            params = {
                "apiKey": self.api_key,
                "category": "business",
                "language": "en",
                "pageSize": limit
            }

            resp = requests.get(url, params=params, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                articles = []
                for idx, item in enumerate(data.get("articles", [])):
                    if not item.get("title") or item.get("title") == "[Removed]":
                        continue

                    title = item.get("title", "")
                    desc = item.get("description", "") or title
                    cat = self._determine_category(title + " " + desc)

                    articles.append({
                        "id": f"newsapi-{idx}-{int(datetime.datetime.now().timestamp())}",
                        "title": title,
                        "description": desc,
                        "content": item.get("content") or desc,
                        "source": item.get("source", {}).get("name", "NewsAPI"),
                        "url": item.get("url", "#"),
                        "image_url": item.get("urlToImage") or "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80",
                        "published_at": item.get("publishedAt") or datetime.datetime.now(datetime.timezone.utc).isoformat(),
                        "category": cat,
                        "sectors": ["Finance"],
                        "companies": [],
                        "initial_sentiment": "Neutral",
                        "sentiment_score": 10,
                    })
                return articles
        except Exception as e:
            print(f"NewsAPI fetch error: {e}")
        return []

    def fetch_from_google_rss(self) -> List[Dict[str, Any]]:
        """Fetch live financial news from Google News RSS feed as fallback."""
        try:
            rss_url = "https://news.google.com/rss/search?q=financial+markets+stocks+economy&hl=en-IN&gl=IN&ceid=IN:en"
            resp = requests.get(rss_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=4)
            if resp.status_code == 200:
                xml_text = resp.text
                items = re.findall(r'<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<\/item>', xml_text)

                articles = []
                idx = 100
                for title, link, pub_date in items[:10]:
                    clean_title = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', title).strip()
                    parts = clean_title.split(" - ")
                    source = parts.pop() if len(parts) > 1 else "Google News"
                    actual_title = " - ".join(parts) if parts else clean_title

                    cat = self._determine_category(actual_title)
                    articles.append({
                        "id": f"rss-{idx}",
                        "title": actual_title,
                        "description": f"{actual_title}. Real-time market headline and analysis.",
                        "content": actual_title,
                        "source": source,
                        "url": link.strip(),
                        "image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
                        "published_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                        "category": cat,
                        "sectors": ["Markets"],
                        "companies": [],
                        "initial_sentiment": "Neutral",
                        "sentiment_score": 15,
                    })
                    idx += 1
                return articles
        except Exception as e:
            print(f"Google RSS fetch note: {e}")
        return []

    def get_latest_news(self, category: Optional[str] = "All", interests: Optional[List[str]] = None, limit: int = 30) -> Dict[str, Any]:
        """Combine NewsAPI, RSS feeds, and curated datasets to serve robust news list."""
        articles = self.fetch_from_newsapi(category, limit)
        if not articles:
            articles = self.fetch_from_google_rss()
        
        # Combine with curated articles
        all_articles = articles + CURATED_FINANCIAL_ARTICLES

        # Filter by Category
        if category and category != "All":
            all_articles = [a for a in all_articles if a.get("category", "").lower() == category.lower()]

        # Sort by user interests if provided
        if interests:
            user_ints = [i.strip().lower() for i in interests if i.strip()]
            if user_ints:
                def match_score(a):
                    text = f"{a.get('category','')} {a.get('title','')} {' '.join(a.get('sectors',[]))}".lower()
                    return sum(1 for item in user_ints if item in text)
                all_articles.sort(key=match_score, reverse=True)

        return {
            "articles": all_articles[:limit],
            "total": len(all_articles),
            "asOf": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

    def search_news(self, query: str) -> Dict[str, Any]:
        clean_q = query.strip().lower()
        if not clean_q:
            return self.get_latest_news()

        # 1. Search local curated articles dataset
        local_matches = [
            a for a in CURATED_FINANCIAL_ARTICLES
            if clean_q in a.get("title", "").lower()
            or clean_q in a.get("description", "").lower()
            or clean_q in a.get("content", "").lower()
            or clean_q in a.get("source", "").lower()
            or clean_q in a.get("category", "").lower()
            or any(clean_q in c.lower() for c in a.get("companies", []))
            or any(clean_q in s.lower() for s in a.get("sectors", []))
        ]

        # 2. Fetch live search RSS from Google News for the query
        live_matches = []
        try:
            rss_url = f"https://news.google.com/rss/search?q={requests.utils.quote(query)}&hl=en-IN&gl=IN&ceid=IN:en"
            resp = requests.get(rss_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=4)
            if resp.status_code == 200:
                xml_text = resp.text
                items = re.findall(r'<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<\/item>', xml_text)

                idx = 300
                for title, link, pub_date in items[:15]:
                    clean_title = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', title).strip()
                    parts = clean_title.split(" - ")
                    source = parts.pop() if len(parts) > 1 else "Google News"
                    actual_title = " - ".join(parts) if parts else clean_title

                    cat = self._determine_category(actual_title)
                    live_matches.append({
                        "id": f"search-rss-{idx}",
                        "title": actual_title,
                        "description": f"{actual_title}. Latest financial market updates regarding {query}.",
                        "content": actual_title,
                        "source": source,
                        "url": link.strip(),
                        "image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
                        "published_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                        "category": cat,
                        "sectors": ["Markets"],
                        "companies": [query.upper()],
                        "initial_sentiment": "Neutral",
                        "sentiment_score": 15,
                    })
                    idx += 1
        except Exception as e:
            print(f"Search RSS fetch error: {e}")

        # Deduplicate results
        combined = list(local_matches)
        for live_item in live_matches:
            if not any(a["title"].lower() == live_item["title"].lower() or a["url"] == live_item["url"] for a in combined):
                combined.append(live_item)

        return {
            "articles": combined,
            "total": len(combined),
            "query": query
        }


    def _determine_category(self, text: str) -> str:
        t = text.lower()
        if any(w in t for w in ["stock", "nifty", "sensex", "nasdaq", "shares", "equity"]):
            return "Stock Market"
        elif any(w in t for w in ["bank", "rbi", "fed", "interest rate", "repo"]):
            return "Banking"
        elif any(w in t for w in ["tech", "ai", "nvidia", "apple", "semiconductor"]):
            return "Technology"
        elif any(w in t for w in ["crypto", "bitcoin", "ethereum", "blockchain"]):
            return "Cryptocurrency"
        elif any(w in t for w in ["startup", "unicorn", "funding", "ipo"]):
            return "Startups"
        elif any(w in t for w in ["gold", "oil", "crude", "dollar", "currency"]):
            return "Global Markets"
        elif any(w in t for w in ["economy", "gdp", "inflation", "tax", "budget"]):
            return "Economy"
        return "Business"

news_service = NewsService()
