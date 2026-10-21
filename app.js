(function (root) {
  const typeBoost = { comparison: 22, 'best-of': 20, 'use-case': 16, faq: 12, guide: 10 };
  const difficultyPenalty = { low: 0, medium: 12, high: 28 };

  function parseLines(text) {
    return String(text || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line, index) => {
      const [prompt = '', brand = '', competitor = '', type = 'guide', difficulty = 'medium'] = line.split('|').map((part) => part.trim());
      return { index: index + 1, prompt, brand, competitor, type: type.toLowerCase(), difficulty: difficulty.toLowerCase() };
    }).filter((item) => item.prompt);
  }

  function score(item) {
    const words = item.prompt.toLowerCase().split(/\W+/).filter(Boolean);
    const commercial = /best|top|vs|compare|alternative|tool|software|buy|price|review/.test(item.prompt.toLowerCase()) ? 18 : 6;
    const gap = item.competitor && item.brand && item.competitor.toLowerCase() !== item.brand.toLowerCase() ? 24 : 8;
    const specificity = Math.min(18, Math.max(4, words.length * 2));
    const boost = typeBoost[item.type] || 8;
    const penalty = difficultyPenalty[item.difficulty] === undefined ? 12 : difficultyPenalty[item.difficulty];
    return Math.max(0, Math.min(100, commercial + gap + specificity + boost - penalty));
  }

  function plan(text) {
    return parseLines(text).map((item) => {
      const value = score(item);
      const action = item.type === 'comparison'
        ? `Publish a balanced ${item.brand} vs ${item.competitor || 'competitor'} page with schema, proof points and prompt FAQs.`
        : item.type === 'best-of'
          ? `Build a sourced best-of page that includes ${item.brand}, selection criteria and honest alternatives.`
          : item.type === 'use-case'
            ? `Create a focused use-case page showing the exact workflow, outcome and customer evidence.`
            : item.type === 'faq'
              ? 'Add concise FAQ blocks near the relevant product or comparison page.'
              : 'Create a practical guide with examples, sources and internal links.';
      return { ...item, score: value, action };
    }).sort((a, b) => b.score - a.score);
  }

  function render(items) {
    const output = document.querySelector('#results');
    if (!output) return;
    if (!items.length) {
      output.innerHTML = '<p class="empty-state">Add one opportunity per line: prompt | brand | competitor | type | difficulty.</p>';
      return;
    }
    output.innerHTML = items.map((item) => `<article><div class="score-row"><h4>${item.prompt}</h4><span class="score">${item.score}</span></div><ul><li><strong>Asset:</strong> ${item.type}</li><li><strong>Action:</strong> ${item.action}</li><li><strong>Difficulty:</strong> ${item.difficulty}</li></ul></article>`).join('');
  }

  function boot() {
    const input = document.querySelector('#opportunityInput');
    const button = document.querySelector('#planButton');
    if (!input || !button) return;
    button.addEventListener('click', () => render(plan(input.value)));
  }

  const api = { parseLines, plan, score };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root.document) root.SnezziCitationPlanner = api;
  if (root.document) root.addEventListener('DOMContentLoaded', boot);
})(typeof window !== 'undefined' ? window : globalThis);
