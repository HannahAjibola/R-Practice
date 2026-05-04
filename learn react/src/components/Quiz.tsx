import { useState } from 'react';
import { QuizQuestion } from '../data/curriculum';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface QuizProps {
  questions: QuizQuestion[];
  lessonId: string;
  onComplete: (score: number, total: number) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const question = questions[current];
  const isCorrect = selected === question.correctIndex;
  const isLastQuestion = current === questions.length - 1;

  function handleSelect(index: number) {
    if (submitted) return;
    setSelected(index);
  }

  function handleCheck() {
    if (selected === null) return;
    setSubmitted(true);
    setAnswers([...answers, selected]);
  }

  function handleNext() {
    if (isLastQuestion) {
      const finalAnswers = [...answers];
      finalAnswers[current] = selected!;
      const score = finalAnswers.reduce((s, a, i) => s + (a === questions[i].correctIndex ? 1 : 0), 0);
      onComplete(score, questions.length);
      setShowResult(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  function handleRetry() {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setSubmitted(false);
  }

  if (showResult) {
    const score = answers.reduce((s, a, i) => s + (a === questions[i].correctIndex ? 1 : 0), 0);
    const passed = score === questions.length;

    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
        {passed ? (
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        ) : (
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        )}
        <h3 className="text-xl font-bold text-white mb-1">
          {passed ? 'Perfect Score!' : 'Almost there!'}
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          You got {score} out of {questions.length} correct
        </p>
        <div className="flex gap-2 justify-center">
          {!passed && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Quiz</h3>
        <span className="text-xs text-slate-500">{current + 1} / {questions.length}</span>
      </div>

      <div className="h-1 bg-slate-800 rounded-full mb-5">
        <div
          className="h-1 bg-cyan-500 rounded-full transition-all"
          style={{ width: `${((current + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-white font-medium mb-4">{question.question}</p>

      <div className="space-y-2 mb-5">
        {question.options.map((option, i) => {
          let classes = 'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ';
          if (!submitted) {
            classes += selected === i
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600';
          } else if (i === question.correctIndex) {
            classes += 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
          } else if (i === selected && i !== question.correctIndex) {
            classes += 'bg-red-500/10 border-red-500/30 text-red-300';
          } else {
            classes += 'bg-slate-800/50 border-slate-700/50 text-slate-500';
          }

          return (
            <button key={i} onClick={() => handleSelect(i)} className={classes}>
              {option}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="w-full py-2.5 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer
        </button>
      ) : (
        <div>
          {isCorrect ? (
            <p className="text-emerald-400 text-sm mb-3 font-medium">Correct!</p>
          ) : (
            <p className="text-red-400 text-sm mb-3 font-medium">
              Incorrect. The answer is: {question.options[question.correctIndex]}
            </p>
          )}
          <button
            onClick={handleNext}
            className="w-full py-2.5 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}
