# 🧠 Personal Knowledge OS (PKOS)

A full-stack, AI-powered Zettelkasten-based knowledge management system designed to help you organize, search, and understand your personal notes — with semantic search, auto-tagging, and knowledge graph linking.

> Built with FastAPI · PostgreSQL + pgvector · Redis · Prisma ORM · Google Gemini API

---

## Features

- **Note Ingestion**: Add notes via REST API.
- **AI-Powered Summarization & Tagging**: Uses Google Gemini to summarize and classify content.
- **Semantic Search**: Vector embeddings via `pgvector` and `sentence-transformers`.
- **Knowledge Graph Links**: Auto-detects and links related notes.
- **FastAPI + Prisma**: Clean architecture and async processing.
- **Docker-ready**: Runs locally or containerized.

---

## Architecture Overview

**Data Flow:**

- User Input → Ingestion API
- Ingestion API → Content Processor
- Content Processor → Gemini for summarization/classification
- Content Processor → Embedding Generator → pgvector
- Summarized Data + Embeddings → PostgreSQL + pgvector
- Query Engine uses semantic search from embeddings
- User receives relevant note responses

---

## Getting Started

### Prerequisites

- Docker + Docker Compose
- Google Gemini API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pkos.git
cd pkos
```

---

### 2. Setup `.env`

```env
DATABASE_URL=postgresql://app:secret@db:5432/knowledge
REDIS_URL=redis://redis:6379
GEMINI_API_KEY=your-gemini-api-key
```

---

### 3. Start the Services

```bash
docker-compose up --build
```

---

### 4. Apply DB Schema

```bash
docker-compose exec app poetry run prisma db push
```

---

### 5. Test the API

```bash
curl -X POST http://localhost:8000/notes \
-H "Content-Type: application/json" \
-d '{"content": "The Zettelkasten method enables deep thinking through linking ideas."}'
```

---

## Testing

```bash
poetry run pytest
```

---

## Planned Features

- Gemini Vision integration for PDF/Image note classification
- Knowledge graph traversal and UI
- Federated fine-tuning of AI on personal data
- Automated Memex digests (weekly summary)

---



## Credits

- Inspired by the [Zettelkasten](https://zettelkasten.de/introduction/) method.


---