import json
import faiss
import numpy as np
import os
from sentence_transformers import SentenceTransformer


class ConstitutionRAG:
    def __init__(self, json_path: str):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        self.data = self.load_json(json_path)
        self.text_chunks, self.metadata = self.prepare_chunks()

        if os.path.exists("constitution.index"):
            self.index = faiss.read_index("constitution.index")
            print("Loaded existing FAISS index")
        else:
            self.index = self.build_index()

        print("Loaded chunks:", len(self.text_chunks))
        print("FAISS index size:", self.index.ntotal)

    def load_json(self, path: str):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def prepare_chunks(self):
        chunks = []
        metadata = []

        for entry in self.data:
            article_id = entry.get("article")
            title = entry.get("title", "")
            description = entry.get("description", "")

            label = "Preamble" if article_id == 0 else f"Article {article_id}"

            full_text = f"{label}: {title}. {description}"

            chunks.append(full_text)

            metadata.append({
                "article_id": label,
                "title": title
            })

        return chunks, metadata

    def build_index(self):
        print("Building FAISS index...")

        embeddings = self.model.encode(self.text_chunks)
        dimension = embeddings.shape[1]

        index = faiss.IndexFlatL2(dimension)
        index.add(np.array(embeddings))

        faiss.write_index(index, "constitution.index")

        return index

    def retrieve(self, query: str, k: int = 5):
        query_embedding = self.model.encode([query])

        distances, indices = self.index.search(np.array(query_embedding), k)

        results = []

        for idx in indices[0]:
            results.append({
                "text": self.text_chunks[idx],
                "metadata": self.metadata[idx]
            })

        return results