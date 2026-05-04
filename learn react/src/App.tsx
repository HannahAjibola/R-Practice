import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { AppShell } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LessonViewer } from './components/LessonViewer';

function AppContent() {
  const { session, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [displayName, setDisplayName] = useState('');

  const fetchProgress = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from('lesson_progress')
      .select('lesson_id, status')
      .eq('user_id', session.user.id);
    if (data) {
      const map: Record<string, string> = {};
      data.forEach(d => { map[d.lesson_id] = d.status; });
      setProgress(map);
    }
  }, [session]);

  const fetchProfile = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', session.user.id)
      .maybeSingle();
    if (data) setDisplayName(data.display_name);
  }, [session]);

  useEffect(() => { fetchProgress(); fetchProfile(); }, [fetchProgress, fetchProfile]);

  // Navigate to first lesson if new user with no progress
  useEffect(() => {
    if (session && Object.keys(progress).length === 0 && currentPage === 'dashboard') {
      // Stay on dashboard — it will show the "Continue Learning" card
    }
  }, [session, progress, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <AuthForm />;

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      mobileOpen={mobileOpen}
      onMobileToggle={() => setMobileOpen(!mobileOpen)}
      progress={progress}
    >
      {currentPage === 'dashboard' && (
        <Dashboard
          progress={progress}
          onNavigate={setCurrentPage}
          displayName={displayName}
        />
      )}
      {currentPage.startsWith('lesson-') && (
        <LessonViewer
          lessonId={currentPage}
          onNavigate={setCurrentPage}
          progress={progress}
          onProgressChange={fetchProgress}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
