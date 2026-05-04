import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { lessons } from '../data/curriculum';
import { CodeBlock } from './CodeBlock';
import { Quiz } from './Quiz';
import { ChevronLeft, ChevronRight, BookOpen, Code2, HelpCircle, CheckCircle2 } from 'lucide-react';

interface LessonViewerProps {
  lessonId: string;
  onNavigate: (page: string) => void;
  progress: Record<string, string>;
  onProgressChange: () => void;
}

type Tab = 'lesson' | 'code' | 'quiz';

export function LessonViewer({ lessonId, onNavigate, progress, onProgressChange }: LessonViewerProps) {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('lesson');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const lesson = lessons.find(l => l.id === lessonId.replace('lesson-', ''));
  const currentIndex = lessons.findIndex(l => l.id === lessonId.replace('lesson-', ''));
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const markInProgress = useCallback(async () => {
    if (!session || !lesson) return;
    const status = progress[lesson.id];
    if (!status || status === 'not_started') {
      await supabase.from('lesson_progress').upsert({
        user_id: session.user.id,
        lesson_id: lesson.id,
        status: 'in_progress',
      }, { onConflict: 'user_id,lesson_id' });
      onProgressChange();
    }
  }, [session, lesson, progress, onProgressChange]);

  useEffect(() => { markInProgress(); }, [markInProgress]);

  async function markCompleted() {
    if (!session || !lesson) return;
    await supabase.from('lesson_progress').upsert({
      user_id: session.user.id,
      lesson_id: lesson.id,
      status: 'completed',
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    onProgressChange();
  }

  async function handleQuizComplete(score: number, total: number) {
    if (!session || !lesson) return;
    setQuizCompleted(true);
    await supabase.from('quiz_results').insert({
      user_id: session.user.id,
      lesson_id: lesson.id,
      score,
      total,
    });
    if (score === total) {
      await markCompleted();
    }
  }

  if (!lesson) {
    return <p className="text-slate-400">Lesson not found.</p>;
  }

  const isCompleted = progress[lesson.id] === 'completed';

  // Parse markdown-like content to JSX
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={i} className="text-lg font-bold text-white mt-5 mb-2">{line.replace(/\*\*/g, '')}</h3>;
      }
      // Bold inline
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-white font-semibold">{part.replace(/\*\*/g, '')}</strong>;
        }
        // Code inline
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((cp, k) => {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            return <code key={`${j}-${k}`} className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">{cp.replace(/`/g, '')}</code>;
          }
          return <span key={`${j}-${k}`}>{cp}</span>;
        });
      });

      // List items
      if (line.startsWith('- ')) {
        return <li key={i} className="text-slate-300 ml-4 list-disc">{rendered}</li>;
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        return <li key={i} className="text-slate-300 ml-4 list-decimal">{rendered}</li>;
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      // Code block markers
      if (line.startsWith('```')) {
        return null;
      }
      return <p key={i} className="text-slate-300 leading-relaxed">{rendered}</p>;
    });
  };

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: 'lesson', label: 'Lesson', icon: BookOpen },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">{lesson.module}</p>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
          {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        </div>
        <p className="text-slate-400 text-sm mt-1">{lesson.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900/50 rounded-lg p-1 border border-slate-800 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'lesson' && (
        <div className="prose-custom space-y-1 animate-fade-in">
          {renderContent(lesson.content)}
        </div>
      )}

      {activeTab === 'code' && (
        <div className="animate-fade-in">
          <CodeBlock code={lesson.codeExample} />
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="animate-fade-in">
          {quizCompleted ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-1">Quiz Complete!</h3>
              <p className="text-slate-400 text-sm">You can retake it anytime.</p>
            </div>
          ) : (
            <Quiz
              questions={lesson.quiz}
              lessonId={lesson.id}
              onComplete={handleQuizComplete}
            />
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        {prevLesson ? (
          <button
            onClick={() => onNavigate(`lesson-${prevLesson.id}`)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevLesson.title}
          </button>
        ) : <div />}

        {!isCompleted && (
          <button
            onClick={markCompleted}
            className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
          >
            Mark Complete
          </button>
        )}

        {nextLesson ? (
          <button
            onClick={() => onNavigate(`lesson-${nextLesson.id}`)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            {nextLesson.title}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Back to Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
