import { ReactNode } from 'react';
import { useAuth } from '../lib/auth';
import { lessons, modules } from '../data/curriculum';
import {
  Code2,
  BookOpen,
  LayoutDashboard,
  LogOut,
  X,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
  progress: Record<string, string>;
  children: ReactNode;
}

export function AppShell({ currentPage, onNavigate, mobileOpen, onMobileToggle, progress, children }: SidebarProps) {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onMobileToggle} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">ReactForge</span>
          <button onClick={onMobileToggle} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-slate-800">
          <button
            onClick={() => { onNavigate('dashboard'); onMobileToggle(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'dashboard'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {modules.map((mod, mi) => {
            const moduleLessons = lessons.filter(l => l.moduleIndex === mi);
            return (
              <div key={mod}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-1.5">
                  {mod}
                </p>
                <div className="space-y-0.5">
                  {moduleLessons.map(lesson => {
                    const status = progress[lesson.id];
                    const isActive = currentPage === `lesson-${lesson.id}`;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => { onNavigate(`lesson-${lesson.id}`); onMobileToggle(); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                          isActive
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-auto">
        <div className="lg:hidden p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-30 flex items-center gap-3">
          <button onClick={onMobileToggle} className="text-slate-400 hover:text-white">
            <BookOpen className="w-6 h-6" />
          </button>
          <span className="text-sm font-medium text-white">ReactForge</span>
        </div>
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
