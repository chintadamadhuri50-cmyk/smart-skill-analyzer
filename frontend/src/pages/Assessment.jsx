import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';

const QUESTIONS = [
  // JavaScript
  { id: 1, skill: 'JavaScript', difficulty: 'Beginner', q: 'What does `typeof null` return in JavaScript?', options: ['null', 'undefined', 'object', 'string'], answer: 2 },
  { id: 2, skill: 'JavaScript', difficulty: 'Intermediate', q: 'Which of the following correctly creates a Promise that resolves with the value 42?', options: ['Promise.resolve(42)', 'new Promise(42)', 'Promise(42)', 'Promise.create(42)'], answer: 0 },
  { id: 3, skill: 'JavaScript', difficulty: 'Advanced', q: 'What is the output of: console.log(0.1 + 0.2 === 0.3)?', options: ['true', 'false', 'undefined', 'NaN'], answer: 1 },
  // Python
  { id: 4, skill: 'Python', difficulty: 'Beginner', q: 'What is the output of: print(type([]))?', options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"], answer: 0 },
  { id: 5, skill: 'Python', difficulty: 'Intermediate', q: 'Which decorator is used to define a static method in Python?', options: ['@classmethod', '@staticmethod', '@property', '@abstractmethod'], answer: 1 },
  { id: 6, skill: 'Python', difficulty: 'Advanced', q: 'What does the `__slots__` attribute do in a Python class?', options: ['Prevents adding new attributes', 'Restricts memory by pre-defining attributes', 'Creates class-level slots for methods', 'Enables operator overloading'], answer: 1 },
  // SQL
  { id: 7, skill: 'SQL', difficulty: 'Beginner', q: 'Which SQL clause is used to filter rows after grouping?', options: ['WHERE', 'HAVING', 'FILTER', 'GROUP BY'], answer: 1 },
  { id: 8, skill: 'SQL', difficulty: 'Intermediate', q: 'What is the difference between INNER JOIN and LEFT JOIN?', options: ['No difference', 'INNER JOIN returns only matching rows; LEFT JOIN also returns unmatched rows from the left table', 'LEFT JOIN is faster', 'INNER JOIN returns all rows from both tables'], answer: 1 },
  // DSA
  { id: 9, skill: 'DSA', difficulty: 'Beginner', q: 'What is the time complexity of binary search on a sorted array?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1 },
  { id: 10, skill: 'DSA', difficulty: 'Intermediate', q: 'Which data structure uses LIFO (Last In, First Out) order?', options: ['Queue', 'Stack', 'Deque', 'Linked List'], answer: 1 },
  { id: 11, skill: 'DSA', difficulty: 'Advanced', q: 'What is the worst-case time complexity of QuickSort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 2 },
  // Git
  { id: 12, skill: 'Git', difficulty: 'Beginner', q: 'Which command stages all changed files for a commit?', options: ['git commit -a', 'git add .', 'git push', 'git stage all'], answer: 1 },
  { id: 13, skill: 'Git', difficulty: 'Intermediate', q: 'What does `git rebase` do?', options: ['Merges two branches with a merge commit', 'Moves or combines commits onto a new base commit', 'Reverts the last commit', 'Deletes a remote branch'], answer: 1 },
  // Web Dev
  { id: 14, skill: 'Web Dev', difficulty: 'Beginner', q: 'Which CSS property makes an element a flex container?', options: ['display: grid', 'display: flex', 'position: flex', 'layout: flex'], answer: 1 },
  { id: 15, skill: 'Web Dev', difficulty: 'Intermediate', q: 'What does the `useEffect` hook do in React?', options: ['Manages component state', 'Runs side effects after render', 'Memoizes expensive computations', 'Creates context'], answer: 1 },
];

const SKILL_COLORS = {
  JavaScript: 'bg-yellow-100 text-yellow-700',
  Python:     'bg-blue-100 text-blue-700',
  SQL:        'bg-emerald-100 text-emerald-700',
  DSA:        'bg-violet-100 text-violet-700',
  Git:        'bg-orange-100 text-orange-700',
  'Web Dev':  'bg-sky-100 text-sky-700',
};

const DIFF_COLORS = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced:     'bg-red-100 text-red-700',
};

export default function Assessment() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});   // { questionId: selectedIndex }
  const [submitted, setSubmitted] = useState(false);

  const q = QUESTIONS[current];
  const total = QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const selected = answers[q.id];

  const select = (idx) => {
    if (submitted) return;
    setAnswers(p => ({ ...p, [q.id]: idx }));
  };

  const submit = () => {
    if (answered < total) {
      const unanswered = QUESTIONS.filter(q => answers[q.id] === undefined).length;
      if (!window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    }
    setSubmitted(true);
    // Compute scores per skill
    const skillScores = {};
    const skillCounts = {};
    QUESTIONS.forEach(q => {
      if (!skillScores[q.skill]) { skillScores[q.skill] = 0; skillCounts[q.skill] = 0; }
      skillCounts[q.skill]++;
      if (answers[q.id] === q.answer) skillScores[q.skill]++;
    });
    const results = Object.entries(skillScores).map(([skill, correct]) => ({
      skill,
      score: Math.round((correct / skillCounts[skill]) * 100),
      correct,
      total: skillCounts[skill],
    }));
    const overall = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
    navigate('/assessment/results', { state: { results, overall, answers } });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-slate-500 text-sm font-medium">Question {current + 1} of {total}</h2>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock size={13} />
            <span>{answered}/{total} answered</span>
          </div>
        </div>
        <ProgressBar value={current + 1} max={total} size="md" />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-4 animate-fade-in">
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${SKILL_COLORS[q.skill] || 'bg-slate-100 text-slate-600'}`}>
            {q.skill}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${DIFF_COLORS[q.difficulty]}`}>
            {q.difficulty}
          </span>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-5 leading-snug">{q.q}</h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => select(i)}
              className={[
                'w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all',
                selected === i
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-slate-50',
              ].join(' ')}
            >
              <span className={[
                'inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold mr-3',
                selected === i ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500',
              ].join(' ')}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Question nav dots */}
      <div className="flex flex-wrap gap-1.5 mb-5 justify-center">
        {QUESTIONS.map((qu, i) => (
          <button
            key={qu.id}
            onClick={() => setCurrent(i)}
            title={`Q${i + 1}: ${qu.skill}`}
            className={[
              'w-7 h-7 rounded-lg text-xs font-bold transition-all',
              i === current ? 'bg-brand-600 text-white' :
              answers[qu.id] !== undefined ? 'bg-brand-100 text-brand-600' :
              'bg-slate-100 text-slate-500',
            ].join(' ')}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrent(c => c - 1)}
          disabled={current === 0}
        >
          <ChevronLeft size={16} /> Previous
        </Button>

        {current < total - 1 ? (
          <Button onClick={() => setCurrent(c => c + 1)}>
            Next <ChevronRight size={16} />
          </Button>
        ) : (
          <Button onClick={submit}>
            <CheckCircle size={16} /> Submit Assessment
          </Button>
        )}
      </div>
    </div>
  );
}
