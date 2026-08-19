# Adaptive AI-Powered Behavioral Security Awareness Platform

A prototype security awareness platform that uses generative AI to create personalized phishing simulation emails and tracks employee behavioral risk scores.

Built as part of an Offensive Security & Pentesting internship project.

## Features

- AI-powered personalized phishing email generation (Google Gemini)
- User management (Create, View, Delete)
- Campaign management (Create, View, Delete)
- Behavioral risk scoring system
- Admin dashboard with live statistics
- Modern web interface

## Tech Stack

**Backend**
- Python
- FastAPI
- SQLAlchemy
- SQLite
- LangChain + Google Gemini

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

1. Install dependencies:
```bash
pip install -r requirements.txt

Create a .env file and add your Google Gemini API key:

textGOOGLE_API_KEY=your_api_key_here

Start the server:

Bashuvicorn main:app --reload
Backend will run at: http://127.0.0.1:8000
API Docs: http://127.0.0.1:8000/docs
Frontend

Install dependencies:

Bashnpm install

Start the development server:

Bashnpm run dev
Frontend will run at: http://localhost:3000



