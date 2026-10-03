const mongoose = require('mongoose');
const SkillAnalysis = require('../models/SkillAnalysis');
const ai = require('../services/aiService');

const ENUMS = {
  education: ['High School', 'Diploma', "Bachelor's", "Master's", 'PhD'],
  year: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'],
  experienceLevel: ['Beginner', 'Intermediate', 'Advanced'],
  careerPreference: ['Web Development', 'Data Science', 'AI / Machine Learning', 'Cybersecurity', 'Mobile Development', 'Cloud / DevOps', 'UI/UX Design', 'Not Sure']
};
const isStr = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const isArr = (v) => Array.isArray(v) && v.length > 0 && v.length <= 30 && v.every(s => isStr(s, 50));

function validate(b = {}) {
  if (!isStr(b.name, 80) || !isStr(b.branch, 80)) return 'Name and branch are required.';
  for (const k of Object.keys(ENUMS)) if (!ENUMS[k].includes(b[k])) return `Invalid value for ${k}.`;
  for (const k of ['technicalSkills', 'softSkills', 'interests']) if (!isArr(b[k])) return `Select at least one item for ${k}.`;
  return null;
}
const pick = (b) => ({ name: b.name.trim(), education: b.education, branch: b.branch.trim(), year: b.year, experienceLevel: b.experienceLevel,
  technicalSkills: b.technicalSkills, softSkills: b.softSkills, interests: b.interests, careerPreference: b.careerPreference });

exports.analyze = async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error });
  try {
    const profile = pick(req.body);
    const aiAnalysis = await ai.analyze(profile);           // validated before persist
    const doc = await SkillAnalysis.create({ ...profile, aiAnalysis });
    res.status(201).json({ success: true, id: doc._id });
  } catch (e) {
    console.error('Analyze failed:', e.response?.data || e.message);
    res.status(502).json({ success: false, message: 'The AI analysis could not be completed. Please retry.' });
  }
};
exports.getAll = async (req, res) => {
  try {
    const list = await SkillAnalysis.find({}, 'name branch careerPreference createdAt aiAnalysis.skillLevel').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: list });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Could not load history.' }); }
};
exports.getOne = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, message: 'Analysis not found.' });
  try {
    const doc = await SkillAnalysis.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: 'Analysis not found.' });
    res.json({ success: true, data: doc });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Could not load analysis.' }); }
};
exports.remove = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, message: 'Analysis not found.' });
  try {
    const doc = await SkillAnalysis.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Analysis not found.' });
    res.json({ success: true, message: 'Analysis deleted.' });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Could not delete analysis.' }); }
};
