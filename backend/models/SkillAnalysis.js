const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String, education: String, branch: String, year: String, experienceLevel: String,
  technicalSkills: [String], softSkills: [String], interests: [String], careerPreference: String,
  aiAnalysis: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});
module.exports = mongoose.model('SkillAnalysis', schema);
