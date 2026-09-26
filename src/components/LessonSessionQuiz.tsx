import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, RefreshCw, Award, Sparkles, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { Lesson, QuizQuestion } from '../types';

interface LessonSessionQuizProps {
  lesson: Lesson;
  onMarkLessonComplete?: () => void;
  isCompleted?: boolean;
}

export const LessonSessionQuiz: React.FC<LessonSessionQuizProps> = ({
  lesson,
  onMarkLessonComplete,
  isCompleted = false
}) => {
  // Generate 2 to 3 contextual questions if not provided in lesson
  const defaultQuestions: QuizQuestion[] = React.useMemo(() => {
    if (lesson.quiz?.questions && lesson.quiz.questions.length > 0) {
      return lesson.quiz.questions;
    }

    const title = lesson.title;
    const takeaways = lesson.keyTakeaways || [];
    const takeaway1 = takeaways[0] || 'فهم المفهوم العملي والتطبيقي لهذا الدرس';
    const takeaway2 = takeaways[1] || 'اتباع أفضل الممارسات البرمجية والتقنية';

    return [
      {
        id: `q-${lesson.id}-1`,
        question: `ما هو الهدف التعليمي والتقني الأبرز المستفاد من درس "${title}"؟`,
        options: [
          takeaway1,
          'تجاهل المعايير القياسية والاعتماد على الحلول العشوائية',
          'عدم مراجعة الكود أو التوثيق الخاص بالدرس',
          'استخدام أدوات غير متوافقة مع متطلبات النظام'
        ],
        correctAnswerIndex: 0,
        explanation: `الإجابة الصحيحة هي: "${takeaway1}"، حيث يُركز هذا الدرس على إتقان هذا المفهوم وتطبيقه العملي الصحيح.`
      },
      {
        id: `q-${lesson.id}-2`,
        question: `وفقاً لشرح هذا الدرس، ما هي أفضل ممارسة يجب تطبيقها في هذا السياق؟`,
        options: [
          'تخطي كتابة الاختبارات ومتابعة الأخطاء',
          takeaway2,
          'عدم مشاركة الكود أو مراجعته مع الفريق',
          'استخدام إصدارات غير مستقرة بدون التحقق'
        ],
        correctAnswerIndex: 1,
        explanation: `الإجابة الصحيحة هي: "${takeaway2}". الالتزام بهذه الممارسة يضمن جودة التطبيق وتجنب المشكلات الشائعة.`
      }
    ];
  }, [lesson]);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [hasAnsweredMap, setHasAnsweredMap] = useState<Record<number, boolean>>({});

  const currentQuestion = defaultQuestions[currentQIndex];
  const selectedOpt = selectedAnswers[currentQIndex];
  const isAnswered = hasAnsweredMap[currentQIndex] === true;
  const isCorrect = isAnswered && selectedOpt === currentQuestion.correctAnswerIndex;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return; // Locked until retry
    setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: index }));
    setHasAnsweredMap(prev => ({ ...prev, [currentQIndex]: true }));
  };

  const handleRetryQuestion = () => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQIndex];
      return copy;
    });
    setHasAnsweredMap(prev => ({ ...prev, [currentQIndex]: false }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < defaultQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const allQuestionsAnswered = defaultQuestions.every((_, idx) => hasAnsweredMap[idx]);
  const allCorrect = defaultQuestions.every((q, idx) => selectedAnswers[idx] === q.correctAnswerIndex);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 font-arabic" dir="rtl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              اختبار التحقق من فهم الدرس (السيشن)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              اختبر فهمك لمحتوى الدرس الحالي واحصل على تقييم وتوضيح فوري لكل إجابة.
            </p>
          </div>
        </div>

        {/* Question Counter Indicator */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {defaultQuestions.map((_, idx) => {
            const answered = hasAnsweredMap[idx];
            const correct = answered && selectedAnswers[idx] === defaultQuestions[idx].correctAnswerIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentQIndex(idx)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${
                  idx === currentQIndex
                    ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : answered
                      ? correct
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-rose-500 text-white border-rose-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title={`الانتقال للسؤال رقم ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Question Box */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            السؤال {currentQIndex + 1} من {defaultQuestions.length}
          </span>
          {isAnswered && (
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              isCorrect
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>إجابة صحيحة! أحسنت</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>إجابة خاطئة</span>
                </>
              )}
            </span>
          )}
        </div>
        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed pt-1">
          {currentQuestion.question}
        </h4>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, optIdx) => {
          const isSelected = selectedOpt === optIdx;
          const isThisCorrect = optIdx === currentQuestion.correctAnswerIndex;

          let btnClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/80";

          if (isAnswered) {
            if (isThisCorrect) {
              btnClass = "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/30";
            } else if (isSelected && !isCorrect) {
              btnClass = "bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-950 dark:text-rose-200 font-bold ring-2 ring-rose-500/30";
            } else {
              btnClass = "opacity-50 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500";
            }
          }

          return (
            <button
              key={optIdx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full p-4 rounded-2xl border text-right text-xs sm:text-sm transition-all flex items-center justify-between gap-3 group ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border transition-all ${
                  isAnswered
                    ? isThisCorrect
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isSelected
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 border-slate-200'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600 group-hover:border-emerald-400'
                }`}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="leading-relaxed">{option}</span>
              </div>

              <div className="shrink-0 mr-2">
                {isAnswered ? (
                  isThisCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />
                  )
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-emerald-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Instant Feedback Card with Explanation (Especially for Wrong Answers) */}
      {isAnswered && (
        <div className={`p-4 sm:p-5 rounded-2xl border animate-fade-in space-y-3 ${
          isCorrect
            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
        }`}>
          <div className="flex items-start gap-2.5">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1.5 flex-1">
              <div className="font-extrabold text-sm">
                {isCorrect ? 'إجابتك صحيحة 100%! أحسنت النتيجة.' : 'إجابة غير صحيحة!'}
              </div>
              {!isCorrect && (
                <div className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-300/40">
                  الإجابة الصحيحة هي: ({String.fromCharCode(65 + currentQuestion.correctAnswerIndex)}) {currentQuestion.options[currentQuestion.correctAnswerIndex]}
                </div>
              )}
              <div className="text-xs leading-relaxed opacity-90 pt-1">
                <span className="font-bold underline ml-1">التوضيح والشرح:</span>
                {currentQuestion.explanation}
              </div>
            </div>
          </div>

          {!isCorrect && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleRetryQuestion}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>إعادة محاولة هذا السؤال</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            disabled={currentQIndex === 0}
            onClick={handlePrevQuestion}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السؤال السابق</span>
          </button>

          <button
            type="button"
            disabled={currentQIndex >= defaultQuestions.length - 1}
            onClick={handleNextQuestion}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold disabled:opacity-30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>السؤال التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Mark Lesson Complete Action */}
        {allQuestionsAnswered && onMarkLessonComplete && (
          <button
            type="button"
            onClick={onMarkLessonComplete}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              isCompleted
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : allCorrect
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? '✓ تم إكمال هذا الدرس واختباره بنجاح' : 'تأكيد إكمال الدرس واختباره'}</span>
          </button>
        )}
      </div>

    </div>
  );
};
