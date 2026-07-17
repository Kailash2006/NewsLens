import { config } from '../config.js';

// OpenAI wrapper for summarization + bias detection. In mock mode we return
// deterministic stub output so the app runs with no API key. In live mode,
// swap the bodies for real calls with the official `openai` SDK.
//
//   import OpenAI from 'openai';
//   const client = new OpenAI({ apiKey: config.openaiKey });
//   const res = await client.chat.completions.create({ model: config.openaiModel, messages: [...] });

const hasKey = Boolean(config.openaiKey);

/** One-paragraph TL;DR (< 100 words) covering who/what/when/where/why. */
export async function summarize(article) {
  if (!hasKey) {
    // Mock: reuse the pre-generated summary if present, else derive from excerpt.
    return (
      article.summary ||
      `${article.excerpt} (Auto-generated TL;DR — set OPENAI_API_KEY for live summaries.)`
    );
  }
  // TODO(live): call OpenAI with a summarization prompt and return the text.
  throw new Error('Live OpenAI summarization not yet implemented.');
}

/**
 * Bias detection assist. Sources carry an editorial lean from AllSides /
 * Ad Fontes; this can refine per-article tone. Mock returns the source lean.
 */
export async function detectBias(article, sourceBias) {
  if (!hasKey) return { lean: sourceBias, confidence: 0.4, method: 'source-default' };
  // TODO(live): call OpenAI to classify article tone/framing.
  throw new Error('Live OpenAI bias detection not yet implemented.');
}

export const summarizerBackend = hasKey ? `openai(${config.openaiModel})` : 'mock';
