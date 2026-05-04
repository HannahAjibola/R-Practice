import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Code2 } from 'lucide-react';

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, displayName);
      if (error) setError(error);
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <Code2 className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ReactForge</h1>
          <p className="text-slate-400 text-sm mt-1">Master React, from zero to hero</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Display name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                placeholder="Min 6 characters"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
