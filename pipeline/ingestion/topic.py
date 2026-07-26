ML_TOPICS = {
    "rag": {
        "title": "Retrieval-Augmented Generation (RAG)",
        "description": "Learn how RAG combines retrieval and generation for accurate, grounded AI responses",
        "subtopics": [
            "What is RAG and why it matters",
            "Vector databases and embeddings",
            "Chunking strategies",
            "Retrieval methods (semantic, keyword, hybrid)",
            "RAG pipeline architecture",
            "Evaluation and optimization",
            "Advanced RAG patterns (self-RAG, corrective RAG)",
        ],
    },
    "langchain": {
        "title": "LangChain Fundamentals",
        "description": "Master the LangChain framework for building LLM-powered applications",
        "subtopics": [
            "LangChain architecture and core concepts",
            "Prompts and prompt templates",
            "Chains and sequential workflows",
            "Memory and conversation management",
            "Tools and agents",
            "Retrieval and RAG with LangChain",
            "LangGraph for complex workflows",
        ],
    },
    "transformers": {
        "title": "Transformer Architecture",
        "description": "Understand the transformer model that powers modern NLP",
        "subtopics": [
            "Attention mechanism explained",
            "Self-attention and multi-head attention",
            "Positional encoding",
            "Encoder-decoder architecture",
            "BERT vs GPT: decoder vs encoder",
            "Fine-tuning transformers",
            "Modern variants (Mistral, LLaMA, Gemma)",
        ],
    },
}


class TopicIngestor:
    def get_topic(self, topic_id: str) -> dict:
        if topic_id not in ML_TOPICS:
            raise ValueError(
                f"Unknown topic: {topic_id}. Available: {list(ML_TOPICS.keys())}"
            )
        return ML_TOPICS[topic_id]

    def list_topics(self) -> list[dict]:
        return [{"id": k, "title": v["title"]} for k, v in ML_TOPICS.items()]
