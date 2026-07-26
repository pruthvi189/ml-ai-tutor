export interface Topic {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
  icon: string;
  color: string;
}

export const ML_TOPICS: Topic[] = [
  {
    id: "rag",
    title: "Retrieval-Augmented Generation",
    description:
      "Learn how RAG combines retrieval and generation for accurate, grounded AI responses",
    subtopics: [
      "What is RAG and why it matters",
      "Vector databases and embeddings",
      "Chunking strategies",
      "Retrieval methods (semantic, keyword, hybrid)",
      "RAG pipeline architecture",
      "Evaluation and optimization",
      "Advanced RAG patterns (self-RAG, corrective RAG)",
    ],
    icon: "Search",
    color: "#c8ff00",
  },
  {
    id: "langchain",
    title: "LangChain Fundamentals",
    description:
      "Master the LangChain framework for building LLM-powered applications",
    subtopics: [
      "LangChain architecture and core concepts",
      "Prompts and prompt templates",
      "Chains and sequential workflows",
      "Memory and conversation management",
      "Tools and agents",
      "Retrieval and RAG with LangChain",
      "LangGraph for complex workflows",
    ],
    icon: "Link",
    color: "#ff2d6f",
  },
  {
    id: "transformers",
    title: "Transformer Architecture",
    description:
      "Understand the transformer model that powers modern NLP",
    subtopics: [
      "Attention mechanism explained",
      "Self-attention and multi-head attention",
      "Positional encoding",
      "Encoder-decoder architecture",
      "BERT vs GPT: decoder vs encoder",
      "Fine-tuning transformers",
      "Modern variants (Mistral, LLaMA, Gemma)",
    ],
    icon: "Cpu",
    color: "#00d4ff",
  },
  {
    id: "neural-networks",
    title: "Neural Network Foundations",
    description:
      "Build solid intuition for how neural networks learn and make predictions",
    subtopics: [
      "Perceptrons and activation functions",
      "Forward and backward propagation",
      "Loss functions and optimizers",
      "Regularization techniques",
      "CNNs for computer vision",
      "RNNs and LSTMs for sequences",
      "When to use which architecture",
    ],
    icon: "Brain",
    color: "#a855f7",
  },
  {
    id: "fine-tuning",
    title: "Fine-Tuning & Transfer Learning",
    description:
      "Learn how to adapt pre-trained models to your specific tasks",
    subtopics: [
      "Transfer learning principles",
      "Full fine-tuning vs LoRA/QLoRA",
      "Dataset preparation and quality",
      "Hyperparameter tuning",
      "Evaluation and overfitting prevention",
      "PEFT methods explained",
      "When fine-tuning beats prompting",
    ],
    icon: "Sliders",
    color: "#f97316",
  },
  {
    id: "mlops",
    title: "MLOps Fundamentals",
    description:
      "Understand the infrastructure and practices behind production ML systems",
    subtopics: [
      "ML lifecycle overview",
      "Experiment tracking and versioning",
      "Model serving and deployment",
      "Monitoring and drift detection",
      "CI/CD for ML pipelines",
      "Feature stores and data pipelines",
      "Scaling ML systems",
    ],
    icon: "Server",
    color: "#22c55e",
  },
];

export function getTopicById(id: string): Topic | undefined {
  return ML_TOPICS.find((t) => t.id === id);
}
