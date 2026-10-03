// The ONLY file that depends on the AI provider (default: Google Gemini). Swap callAI() to change provider.
const axios = require('axios');

function buildPrompt(p) {
  return `You are an expert career counsellor for college students. Analyze this student profile and respond with VALID JSON ONLY (no markdown, no extra text).

Profile:
- Education: ${p.education}, Branch: ${p.branch}, Year: ${p.year}, Experience: ${p.experienceLevel}
- Technical skills: ${p.technicalSkills.join(', ')}
- Soft skills: ${p.softSkills.join(', ')}
- Interests: ${p.interests.join(', ')}
- Career preference: ${p.careerPreference}${p.careerPreference === 'Not Sure' ? ' (recommend paths from the complete profile)' : ''}

Return exactly this JSON shape:
{"profileSummary":"string",
"skillLevel":{"level":"Beginner|Intermediate|Advanced","percentage":0-100,"reason":"string"},
"careerPaths":[{"name":"string","matchPercentage":0-100,"description":"string","roles":["string"]}] (3 to 5 items),
"existingSkills":["string"],
"missingSkills":[{"skill":"string","importance":"High|Medium|Low","reason":"string"}],
"skillStrengths":["string"],"improvementAreas":["string"],
"learningRoadmap":[{"step":1,"title":"string","description":"string","difficulty":"Easy|Medium|Hard","duration":"e.g. 2 weeks"}] (5 to 8 items),
"projectSuggestions":[{"name":"string","difficulty":"Beginner|Intermediate|Advanced","description":"string","skills":["string"]}] (3 to 4 items),
"careerTips":["string"] (4 to 6 items)}`;
}

async function callAI(prompt) {
  const model = process.env.AI_MODEL || 'gemini-2.0-flash';
  const { data } = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    { contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, responseMimeType: 'application/json' } },
    { headers: { 'x-goog-api-key': process.env.AI_API_KEY, 'Content-Type': 'application/json' }, timeout: 60000 }
  );
  return data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
}

function parseJSON(text) {
  const clean = text.replace(/```json|```/gi, '').trim();
  const s = clean.indexOf('{'), e = clean.lastIndexOf('}');
  if (s < 0 || e < 0) throw new Error('No JSON found');
  return JSON.parse(clean.slice(s, e + 1));
}

function validateShape(o) {
  const arr = (v, min = 1) => Array.isArray(v) && v.length >= min;
  const pct = (n) => typeof n === 'number' && n >= 0 && n <= 100;
  const ok = typeof o.profileSummary === 'string'
    && o.skillLevel && typeof o.skillLevel.level === 'string' && pct(o.skillLevel.percentage) && typeof o.skillLevel.reason === 'string'
    && arr(o.careerPaths) && o.careerPaths.every(c => c.name && pct(c.matchPercentage) && arr(c.roles, 0))
    && arr(o.existingSkills) && arr(o.missingSkills) && o.missingSkills.every(m => m.skill && m.importance && m.reason)
    && arr(o.skillStrengths) && arr(o.improvementAreas)
    && arr(o.learningRoadmap) && o.learningRoadmap.every(r => r.title && r.difficulty && r.duration)
    && arr(o.projectSuggestions) && o.projectSuggestions.every(p => p.name && p.difficulty && arr(p.skills, 0))
    && arr(o.careerTips);
  if (!ok) throw new Error('AI response failed shape validation');
  return o;
}

async function analyze(profile) {
  const obj = validateShape(parseJSON(await callAI(buildPrompt(profile))));
  obj.careerPaths = obj.careerPaths.slice(0, 5);
  return obj;
}
module.exports = { buildPrompt, callAI, parseJSON, validateShape, analyze };
