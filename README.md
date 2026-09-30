# 🇮🇳 IS-SPEC
## AI-Powered Indian Standards Recommendation & Compliance Assistant

> **Intelligent Standards Discovery for Procurement & Compliance**

IS-SPEC is an AI-powered recommendation engine designed to help procurement teams and organizations identify relevant **Indian Standards (IS)** from procurement requirements and tender documents.

The system uses **Natural Language Processing, Semantic Search, Vector Embeddings, BM25 Retrieval, Candidate Reranking, Version Validation, Regulatory Validation, and Explainable AI** to provide relevant and evidence-based recommendations.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [System Workflow](#-system-workflow)
- [AI Recommendation Pipeline](#-ai-recommendation-pipeline)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Project](#-running-the-project)
- [Example](#-example)
- [API Overview](#-api-overview)
- [Docker](#-docker)
- [Future Scope](#-future-scope)
- [Disclaimer](#-disclaimer)

---

# 🔎 Overview

Finding the correct Indian Standard for a procurement requirement can be difficult and time-consuming.

A single product may involve:

- Multiple Indian Standards
- Different standard versions
- Related test methods
- Safety requirements
- Certification requirements
- Quality Control Orders (QCO)
- Referenced or supporting standards

IS-SPEC simplifies this process by converting an unstructured requirement or tender document into a structured recommendation pipeline.

### The system follows:

```text
User Requirement / Tender Document
                ↓
        Document Processing
                ↓
       Requirement Extraction
                ↓
        Candidate Retrieval
                ↓
            Reranking
                ↓
     Relationship Expansion
                ↓
        Version Validation
                ↓
      Regulatory Validation
                ↓
      Explanation Generation
                ↓
          Human Review
