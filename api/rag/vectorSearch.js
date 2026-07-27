import { sapKnowledgeChunks } from './knowledgeStore.js';

// Calculate term frequency & keyword overlap similarity score
function calculateSimilarity(query, chunk) {
  const queryTerms = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  if (queryTerms.length === 0) return 0;

  const contentText = `${chunk.category} ${chunk.tcodes.join(' ')} ${chunk.tables.join(' ')} ${chunk.content}`.toLowerCase();

  let score = 0;

  // Exact T-Code match multiplier
  chunk.tcodes.forEach((t) => {
    if (queryTerms.includes(t.toLowerCase())) {
      score += 5.0;
    }
  });

  // Table match multiplier
  chunk.tables.forEach((tbl) => {
    if (queryTerms.includes(tbl.toLowerCase())) {
      score += 3.0;
    }
  });

  // Term frequency matching
  queryTerms.forEach((term) => {
    if (term.length > 2 && contentText.includes(term)) {
      score += 1.5;
    }
  });

  return score;
}

export function searchVectorKnowledge(query, topK = 2) {
  if (!query || typeof query !== 'string') return [];

  const scoredChunks = sapKnowledgeChunks.map((chunk) => ({
    chunk,
    score: calculateSimilarity(query, chunk)
  }));

  // Sort by highest similarity score
  scoredChunks.sort((a, b) => b.score - a.score);

  // Return topK chunks with score > 1.0
  return scoredChunks
    .filter((item) => item.score > 1.0)
    .slice(0, topK)
    .map((item) => item.chunk);
}
