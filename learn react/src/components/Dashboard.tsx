import { lessons, modules } from '../data/curriculum';
import { BookOpen, CheckCircle2, Clock, Trophy, ArrowRight, Zap } from 'lucide-react';

interface DashboardProps {
  progress: Record<string, string>;
  onNavigate: (page: string) => void;
  displayName: string;
}

export function Dashboard({ progress, onNavigate, displayName }: DashboardProps) {
  const totalLessons = lessons.length;
  const completedLessons = Object.values(progress).filter(s => s === 'completed').length;
  const inProgressLessons = Object.values(progress).filter(s => s === 'in_progress').length;
  const percent = Math.round((completedLessons / totalLessons) * 100);

  // Find next lesson to study
  const nextLesson = lessons.find(l => {
    const s = progress[l.id];
    return !s || s === 'not_started' || s === 'in_progress';
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{greeting()}, {displayName || 'Student'}</h1>
        <p className="text-slate-400 text-sm mt-1">Continue your React journey.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={BookOpen} label="Total Lessons" value={String(totalLessons)} color="cyan" />
        <StatCard icon={CheckCircle2} label="Completed" value={String(completedLessons)} color="emerald" />
        <StatCard icon={Clock} label="In Progress" value={String(inProgressLessons)} color="amber" />
        <StatCard icon={Trophy} label="Progress" value={`${percent}%`} color="cyan" />
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Overall Progress</h2>
          <span className="text-xs text-slate-500">{completedLessons} / {totalLessons} lessons</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Continue Learning */}
      {nextLesson && (
        <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">Continue Learning</p>
              <h3 className="text-lg font-bold text-white">{nextLesson.title}</h3>
              <p className="text-slate-400 text-sm mt-0.5">{nextLesson.description}</p>
            </div>
            <button
              onClick={() => onNavigate(`lesson-${nextLesson.id}`)}
              className="shrink-0 p-3 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Module Progress */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Modules</h2>
        {modules.map((mod, mi) => {
          const moduleLessons = lessons.filter(l => l.moduleIndex === mi);
          const completed = moduleLessons.filter(l => progress[l.id] === 'completed').length;
          const modulePercent = Math.round((completed / moduleLessons.length) * 100);

          return (
            <div key={mod} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${modulePercent === 100 ? 'text-emerald-400' : 'text-cyan-400'}`} />
                  <span className="text-sm font-medium text-white">{mod}</span>
                </div>
                <span className="text-xs text-slate-500">{completed}/{moduleLessons.length}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    modulePercent === 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${modulePercent}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {moduleLessons.map(l => {
                  const status = progress[l.id];
                  return (
                    <button
                      key={l.id}
                      onClick={() => onNavigate(`lesson-${l.id}`)}
                      className={`text-[11px] px-2 py-1 rounded-md transition-colors ${
                        status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : status === 'in_progress'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 hover:text-white'
                      }`}
                    >
                      {l.title}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  color: 'cyan' | 'emerald' | 'amber';
}) {
  const colorMap = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorMap[color]} mb-3`}>
        <Icon className={`w-4 h-4 ${colorMap[color].split(' ')[0]}`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
