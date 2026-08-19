# System Architecture
## Adaptive AI-Powered Behavioral Security Awareness Platform

### High-Level Overview

[Browser - Employee / Admin]
          ↓
[Frontend - Next.js + React]
          ↓
[Backend API - FastAPI (Python)]
          ↓
┌────────────────────┬──────────────────────┐
│   PostgreSQL       │   Vector Database    │
│   (Users, Scores,  │   (Embeddings for    │
│    Campaigns)      │    AI personalization)│
└────────────────────┴──────────────────────┘
          ↑
[AI Layer - LangChain + Open-source LLM]
Main Components

Frontend (Next.js)
Employee interface (simulations & training)
Admin dashboard (campaigns, reports, risk scores)

Backend (FastAPI)
REST API endpoints
Business logic and authentication
Communication with AI layer and database

AI Layer
Generates personalized phishing content
Adapts training difficulty
Uses LangChain + vector database for context

Database
PostgreSQL for structured data
Vector store for AI embeddings


text### 3. `docs/03_Setup_Guide.md`

```markdown
# Local Setup Guide

## Backend Setup
1. Open terminal in the `backend` folder
2. Create virtual environment:
   ```bash
   python -m venv venv

Activate virtual environment:
Windows: venv\Scripts\activate
Mac/Linux: source venv/bin/activate

Install packages:Bashpip install fastapi uvicorn sqlalchemy python-dotenv langchain
Run the server (later):Bashuvicorn main:app --reload

Frontend Setup

Open terminal in the frontend folder
Install dependencies (if needed):Bashnpm install
Run the development server:Bashnpm run dev
Open http://localhost:3000 in your browser

text### 4. `README.md` (in the root folder)

```markdown
# Adaptive AI-Powered Behavioral Security Awareness Platform

Internship project that uses generative AI to create personalized security awareness simulations and adaptive training.

## Project Structure
- `backend/` → FastAPI backend
- `frontend/` → Next.js frontend
- `docs/` → Project documentation
- `ai/` → AI-related modules
- `scripts/` → Helper scripts

## Current Status
Phase 1 completed: Requirements, Architecture, and local environment setup.


