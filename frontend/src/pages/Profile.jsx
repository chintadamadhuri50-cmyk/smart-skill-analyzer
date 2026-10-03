import { useState } from 'react';
import { Camera, Save, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { Card } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';

const EDUCATION = ["Bachelor's", "Master's", 'Diploma', 'High School', 'PhD'];
const YEARS     = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'];
const INTERESTS = ['Web Development','App Development','AI / Machine Learning','Data Science','Cybersecurity','Cloud Computing','DevOps','UI/UX Design','Data Analytics'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { profile, showToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:       user?.name       || '',
    email:      user?.email      || '',
    education:  user?.education  || '',
    branch:     user?.branch     || '',
    year:       user?.year       || '',
    careerGoal: user?.careerGoal || profile?.careerGoal || '',
    interests:  user?.interests  || [],
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleInterest = (i) => set('interests', form.interests.includes(i) ? form.interests.filter(x => x !== i) : [...form.interests, i]);

  const save = () => {
    if (!form.name.trim()) { showToast('Name is required.', 'error'); return; }
    updateUser(form);
    showToast('Profile updated successfully!');
    setEditing(false);
  };

  const initials = (form.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-2xl space-y-5">
      {/* Avatar + name */}
      <Card>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-brand-grad flex items-center justify-center text-white text-2xl font-black">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-600 shadow-sm">
              <Camera size={13} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-900">{form.name || 'Your Name'}</h2>
            <p className="text-slate-500 text-sm">{form.email}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.careerGoal && <Badge variant="blue">{form.careerGoal}</Badge>}
              {form.year && <Badge variant="gray">{form.year}</Badge>}
              {form.education && <Badge variant="purple">{form.education}</Badge>}
            </div>
          </div>
          <Button variant={editing ? 'outline' : 'secondary'} size="sm" onClick={() => setEditing(!editing)}>
            <Edit2 size={13} /> {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </Card>

      {/* Stats mini */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Skill Score',    value: `${profile?.overallScore || 0}%` },
          { label: 'Skills',         value: profile?.skills?.length || 0      },
          { label: 'Roadmap',        value: `${profile?.roadmap?.flatMap(p=>p.items).filter(i=>i.done).length || 0} done` },
        ].map(s => (
          <Card key={s.label} className="text-center py-4">
            <p className="text-xl font-black gradient-text">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Edit form */}
      {editing ? (
        <Card>
          <h3 className="font-bold text-slate-800 mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full name"    value={form.name}   onChange={e => set('name', e.target.value)} />
              <Input label="Email"        value={form.email}  onChange={e => set('email', e.target.value)} type="email" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Education"   value={form.education} onChange={e => set('education', e.target.value)} options={EDUCATION} />
              <Select label="Year"        value={form.year}      onChange={e => set('year', e.target.value)}      options={YEARS}     />
            </div>
            <Input label="Branch / Major" value={form.branch}    onChange={e => set('branch', e.target.value)} placeholder="e.g. Computer Science" />
            <Input label="Career Goal"    value={form.careerGoal} onChange={e => set('careerGoal', e.target.value)} placeholder="e.g. Full Stack Developer" />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    className={[
                      'px-3 py-1.5 rounded-xl border text-xs font-medium transition-all',
                      form.interests.includes(i)
                        ? 'bg-brand-grad text-white border-transparent'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300',
                    ].join(' ')}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={save}><Save size={14} /> Save changes</Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <h3 className="font-bold text-slate-800 mb-4">Profile Information</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              ['Full Name',    form.name],
              ['Email',        form.email],
              ['Education',    form.education   || '—'],
              ['Year',         form.year        || '—'],
              ['Branch',       form.branch      || '—'],
              ['Career Goal',  form.careerGoal  || '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{k}</dt>
                <dd className="text-sm font-medium text-slate-800 mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
          {form.interests.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {form.interests.map(i => <Badge key={i} variant="blue">{i}</Badge>)}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
