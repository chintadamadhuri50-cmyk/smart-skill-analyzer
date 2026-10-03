import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';

const SUGGESTED = [
  'What should I learn next?',
  'How can I improve my DSA?',
  'What projects should I build?',
  'Is my resume job-ready?',
  'What skills am I missing?',
  'Create a 30-day learning plan for me.',
  'Explain React hooks simply.',
  'How do I prepare for placements?',
];

const WELCOME = `Hi! 👋 I'm your **SkillSnap AI Assistant**.

I know your profile — your skills, gaps, career goal, and roadmap progress. Ask me anything about:

- What to learn next
- How to close your skill gaps
- Project ideas to build
- Resume tips
- Career advice for your target role

How can I help you today?`;

// Simulate AI responses based on the user's message
function generateResponse(message, profile, userName) {
  const msg = message.toLowerCase();
  const name = (userName || 'you').split(' ')[0];
  const goal = profile?.careerGoal || 'your target career';
  const topGap = profile?.skillGaps?.filter(g => g.priority === 'High')[0]?.skill || 'JavaScript';
  const score = profile?.overallScore || 68;
  const allItems = profile?.roadmap?.flatMap(p => p.items) || [];
  const nextItem = allItems.find(i => !i.done)?.title || 'your next roadmap step';

  if (msg.includes('learn next') || msg.includes('what should i')) {
    return `Based on your current skill gaps, ${name}, I recommend focusing on **${topGap}** next — it's your highest-priority gap for becoming a **${goal}**.\n\nHere's a quick plan:\n1. Spend 1 week on ${topGap} fundamentals\n2. Build a small project using it\n3. Then move to **${allItems.find(i => !i.done && i.title.toLowerCase().includes(topGap.toLowerCase()))?.title || nextItem}** on your roadmap\n\nConsistency beats intensity — even 1 hour daily compounds fast.`;
  }
  if (msg.includes('dsa') || msg.includes('data structure')) {
    return `Great question! For DSA improvement, here's a structured approach:\n\n**Week 1-2:** Arrays, Strings, HashMaps\n**Week 3-4:** Linked Lists, Stacks, Queues\n**Month 2:** Trees, Graphs, Recursion\n**Month 3:** Dynamic Programming, Sorting\n\n**Resources I recommend:**\n- LeetCode (start with Easy, then Medium)\n- NeetCode roadmap (free on YouTube)\n- "Cracking the Coding Interview" book\n\nAim for 2 problems/day. Track your progress on your roadmap! 🎯`;
  }
  if (msg.includes('project') || msg.includes('build')) {
    return `For a **${goal}**, here are 3 projects that will impress recruiters:\n\n1. **Portfolio Website** — Showcase your skills, projects, and contact info. Use React + CSS animations.\n\n2. **Task Manager App** — Full stack CRUD app with auth. Use React, Node.js, MongoDB. Shows you can build end-to-end.\n\n3. **Real-time Chat App** — Uses WebSockets (Socket.io). Demonstrates advanced JavaScript and backend skills.\n\n💡 *Tip:* Deploy all projects to Vercel/Netlify + GitHub. Recruiters look for live demos.`;
  }
  if (msg.includes('resume')) {
    return `For a **${goal}** resume, here are the key improvements based on your profile:\n\n✅ **Keep:**\n- Your technical skills section\n- Any projects you've built\n\n⚠️ **Add:**\n- A 2-line professional summary at the top\n- Quantified results (e.g., "Built an app used by 200+ users")\n- GitHub profile link\n- Keywords: REST APIs, Agile, CI/CD\n\n📊 **Your current score:** roughly ${score >= 70 ? 'solid' : 'needs improvement'} — use the **Resume Analyzer** in the sidebar for a detailed breakdown!`;
  }
  if (msg.includes('missing') || msg.includes('skill gap')) {
    const gaps = profile?.skillGaps?.filter(g => g.priority === 'High').map(g => g.skill).join(', ') || topGap;
    return `Your top skill gaps for **${goal}** are: **${gaps}**.\n\nThese are "High Priority" because employers expect them at an intermediate or advanced level for this role.\n\n**How to close them fast:**\n1. Pick ONE gap at a time (don't multitask learning)\n2. Spend 2-3 weeks on focused practice\n3. Build a project using that skill\n4. Mark it done on your Roadmap\n\nYour roadmap already has the right sequence — just follow it consistently!`;
  }
  if (msg.includes('30 day') || msg.includes('plan')) {
    return `Here's a **30-Day Learning Plan** for **${goal}**:\n\n**Week 1 (Days 1-7):** ${topGap} fundamentals\n- 1 hour theory daily + 30 min practice\n- Complete 5 small exercises\n\n**Week 2 (Days 8-14):** Build a mini-project\n- Apply ${topGap} in a real context\n- Push to GitHub daily\n\n**Week 3 (Days 15-21):** Next skill on roadmap\n- Explore ${nextItem}\n- Watch 2 tutorials + follow along\n\n**Week 4 (Days 22-30):** Integration\n- Combine skills into a portfolio project\n- Deploy it online\n- Update your resume\n\n🔥 **Goal:** By day 30, you should be at Intermediate level in ${topGap}!`;
  }
  if (msg.includes('react') && msg.includes('hook')) {
    return `**React Hooks explained simply:**\n\nHooks let you use React features (like state) in function components.\n\n**The 3 you'll use 90% of the time:**\n\n1. \`useState\` — Store and update values\n   \`const [count, setCount] = useState(0)\`\n\n2. \`useEffect\` — Run code on mount/update (like API calls)\n   \`useEffect(() => { fetchData(); }, [])\`\n\n3. \`useContext\` — Share state across components without prop drilling\n\n💡 *Mental model:* Hooks are just regular functions that tap into React's "memory" for a component.`;
  }
  if (msg.includes('placement') || msg.includes('interview')) {
    return `**Placement Preparation Roadmap for ${name}:**\n\n**3 months before:**\n- Strengthen your top 3 languages\n- Start LeetCode (50 easy problems)\n- Build 2 strong projects to showcase\n\n**2 months before:**\n- Practice 3 medium LeetCode problems/day\n- Mock interviews on Pramp or interviewing.io\n- Polish your resume\n\n**1 month before:**\n- Company-specific prep (check GeeksForGeeks)\n- Behavioral questions (STAR method)\n- System design basics for senior roles\n\n📊 Your current score is **${score}%** — with focused prep, you can reach 80%+ before placements!`;
  }

  // Generic fallback
  return `That's a great question! Based on your profile as an aspiring **${goal}** with an overall score of **${score}%**, here's my take:\n\n${message.includes('?') ? 'To answer your question specifically' : 'Here are my thoughts'}: focus on closing your high-priority skill gaps first, then apply those skills in real projects. Your learning roadmap already has a clear path — just stay consistent!\n\nIs there something more specific about your **skills, roadmap, resume, or career path** I can help with? 💡`;
}

export default function AIAssistant() {
  const { profile } = useApp();
  const { user }    = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: WELCOME, time: new Date() }
  ]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg, time: new Date() };
    setMessages(p => [...p, userMsg]);
    setTyping(true);

    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

    const response = generateResponse(msg, profile, user?.name);
    setMessages(p => [...p, { id: Date.now() + 1, role: 'assistant', text: response, time: new Date() }]);
    setTyping(false);
  };

  const reset = () => {
    setMessages([{ id: 1, role: 'assistant', text: WELCOME, time: new Date() }]);
  };

  // Simple markdown-ish renderer
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      const code = bold.replace(/`(.+?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono text-brand-700">$1</code>');
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: code.slice(2) }} />;
      }
      if (/^\d+\./.test(line)) {
        return <li key={i} className="ml-4 list-decimal" dangerouslySetInnerHTML={{ __html: code.replace(/^\d+\.\s/, '') }} />;
      }
      if (line === '') return <br key={i} />;
      return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: code }} />;
    });
  };

  return (
    <div className="max-w-3xl flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-grad flex items-center justify-center shadow-glow">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-base">SkillSnap AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-slate-500">Online · Knows your profile</p>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw size={14} /> New chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin mb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
            <div className={[
              'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold',
              msg.role === 'assistant' ? 'bg-brand-grad' : 'bg-slate-700',
            ].join(' ')}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={14} />}
            </div>
            <div className={[
              'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
              msg.role === 'assistant'
                ? 'bg-white border border-slate-100 shadow-card text-slate-800'
                : 'bg-brand-grad text-white',
            ].join(' ')}>
              <div className="space-y-1">{renderText(msg.text)}</div>
              <p className={`text-[10px] mt-2 ${msg.role === 'assistant' ? 'text-slate-400' : 'text-white/60'}`}>
                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-brand-grad flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-slate-100 shadow-card rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="mb-3 shrink-0">
          <p className="text-xs text-slate-500 mb-2 font-medium">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.slice(0, 4).map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 shrink-0">
        <input
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
          placeholder="Ask me anything about your career, skills, or roadmap…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={typing}
        />
        <Button onClick={() => send()} disabled={!input.trim() || typing} size="md" className="px-4">
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
