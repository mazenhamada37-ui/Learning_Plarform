import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  RefreshCw, 
  AlertTriangle,
  Clock,
  Check,
  RotateCcw
} from 'lucide-react';
import { Course, Quiz } from '../types';

interface QuizEngineProps {
  course: Course;
  quiz: Quiz;
  onFinishQuiz: (scorePercent: number) => void;
  onClose: () => void;
  onViewCertificate: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  course,
  quiz,
  onFinishQuiz,
  onClose,
  onViewCertificate
}) => {
  const totalQuestions = quiz.questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(120 * totalQuestions); // 2 minutes per question
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showReviewList, setShowReviewList] = useState(false);

  // Timer Countdown
  useEffect(() => {
    if (showResults || timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          // If time expires, force evaluate what was answered
          handleSubmitQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResults, timeLeftSeconds]);

  const currentQuestion = quiz.questions[currentIndex];
  const selectedOptionIndex = selectedAnswers[currentIndex];
  const answeredIndices = Object.keys(selectedAnswers).map(Number);
  const answeredCount = answeredIndices.length;
  const isAllAnswered = answeredCount === totalQuestions;
  const remainingCount = totalQuestions - answeredCount;

  // Select or Change Option for the Current Question
  const handleSelectOption = (optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    setValidationError(null);
  };

  // Navigation: Previous
  const handlePrev = () => {
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Navigation: Next
  const handleNext = () => {
    setValidationError(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Jump to specific question
  const handleJumpToQuestion = (index: number) => {
    setValidationError(null);
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
    }
  };

  // Find and jump to first unanswered question
  const handleJumpToFirstUnanswered = () => {
    for (let i = 0; i < totalQuestions; i++) {
      if (selectedAnswers[i] === undefined) {
        setCurrentIndex(i);
        setValidationError(null);
        return;
      }
    }
  };

  // Submit Quiz Validation & Evaluation
  const handleSubmitQuiz = (forceDueToTimeout = false) => {
    if (!forceDueToTimeout && !isAllAnswered) {
      setValidationError(
        `تنبيه: يجب الإجابة على جميع الأسئلة العشرة أولاً قبل تسليم الاختبار! تبقى لديك (${remainingCount}) أسئلة بدون إجابة.`
      );
      return;
    }

    setValidationError(null);
    setShowResults(true);

    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const percent = Math.round((correct / totalQuestions) * 100);
    onFinishQuiz(percent);
  };

  // Retake Quiz
  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
    setValidationError(null);
    setShowReviewList(false);
    setTimeLeftSeconds(120 * totalQuestions);
  };

  // Compute Current Final Score
  let correctCount = 0;
  quiz.questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswerIndex) {
      correctCount++;
    }
  });
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercent >= 70;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-6 transition-all">
        
        {/* Quiz Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-800/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {course.title}
              </span>
              <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
                10 أسئلة تقييمية
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold font-arabic">
              {quiz.title}
            </h2>
          </div>

          {!showResults && (
            <div className={`px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm border flex items-center gap-1.5 shrink-0 ${
              timeLeftSeconds < 180 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                : 'bg-white/10 text-emerald-300 border-white/10'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
            </div>
          )}
        </div>

        {/* Quiz Body */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {!showResults ? (
            <>
              {/* Question Navigation Bar & Progress */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-xs">
                      السؤال {currentIndex + 1} من {totalQuestions}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                      (تمت الإجابة على {answeredCount} من {totalQuestions})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">نسبة الإنجاز:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      {Math.round((answeredCount / totalQuestions) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Smooth Progress Bar */}
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>

                {/* 10-Question Quick Jump Palette */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      لوحة التنقل السريع بين الأسئلة:
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      اضغط على أي رقم للانتقال إليه مباشرة
                    </span>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {quiz.questions.map((_, qIdx) => {
                      const isCurrent = currentIndex === qIdx;
                      const isAnswered = selectedAnswers[qIdx] !== undefined;

                      let btnStyle = "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400";
                      if (isCurrent) {
                        btnStyle = "bg-emerald-600 text-white font-extrabold border-emerald-600 shadow-sm ring-2 ring-emerald-400/40";
                      } else if (isAnswered) {
                        btnStyle = "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border-emerald-300 dark:border-emerald-700";
                      }

                      return (
                        <button
                          key={qIdx}
                          onClick={() => handleJumpToQuestion(qIdx)}
                          className={`h-8 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${btnStyle}`}
                          title={`السؤال ${qIdx + 1} ${isAnswered ? '(تمت الإجابة)' : '(لم يُجب بعد)'}`}
                        >
                          <span>{qIdx + 1}</span>
                          {isAnswered && !isCurrent && (
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Validation Alert if User Tries to Submit Before Answering All 10 */}
              {validationError && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 rounded-2xl text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-shake">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="font-semibold">{validationError}</span>
                  </div>
                  <button
                    onClick={handleJumpToFirstUnanswered}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shrink-0 transition-colors"
                  >
                    الانتقال لأول سؤال غير مُجاب
                  </button>
                </div>
              )}

              {/* Current Question Display */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                    السؤال رقم {currentIndex + 1} من {totalQuestions}
                  </span>
                  {selectedOptionIndex !== undefined ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                      ✓ تم تسجيل إجابتك
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                      بانتظار الإجابة
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-arabic leading-relaxed pt-1">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedOptionIndex === optIdx;

                  let optionStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:bg-slate-50/80 dark:hover:bg-slate-800/80";

                  if (isSelected) {
                    optionStyle = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-400/30";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 sm:p-4.5 rounded-2xl border text-right text-xs sm:text-sm transition-all flex items-center justify-between group ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border transition-all ${
                          isSelected 
                            ? 'bg-emerald-600 text-white border-emerald-600' 
                            : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600 group-hover:border-emerald-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </div>

                      <div className="shrink-0 mr-2">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-emerald-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Navigation Controls (Previous, Next, Submit) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-200/80 dark:border-slate-800">
                
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السؤال السابق</span>
                </button>

                {/* Middle Action / Cancel */}
                <button
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors order-last sm:order-none"
                >
                  إلغاء الاختبار والخروج
                </button>

                {/* Next or Submit Button */}
                <div className="w-full sm:w-auto flex items-center gap-2">
                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>السؤال التالي</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubmitQuiz(false)}
                      className={`w-full sm:w-auto px-6 py-2.5 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 ${
                        isAllAnswered 
                          ? 'bg-emerald-600 hover:bg-emerald-700 animate-pulse' 
                          : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {isAllAnswered ? 'إنهاء وتسليم الاختبار (10/10)' : `تسليم الاختبار (${answeredCount}/10)`}
                      </span>
                    </button>
                  )}
                </div>

              </div>
            </>
          ) : (
            /* Results & Evaluation Screen */
            <div className="py-4 space-y-6">
              
              {/* Result Status Icon */}
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 shadow-lg ${
                isPassed 
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-400/40' 
                  : 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-rose-400/40'
              }`}>
                {isPassed ? <Award className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
              </div>

              {/* Title & Score Announcement */}
              <div className="text-center space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-arabic">
                  {isPassed ? 'تهانينا! لقد اجتزت الاختبار بنجاح' : 'لم يتم اجتياز الاختبار هذه المرة'}
                </h3>
                
                <div className="flex items-center justify-center gap-3 pt-1">
                  <span className={`text-3xl font-extrabold font-mono px-4 py-1.5 rounded-2xl border ${
                    isPassed 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' 
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                  }`}>
                    {scorePercent}%
                  </span>
                  <div className="text-right text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <p className="font-bold">{correctCount} إجابات صحيحة من أصل {totalQuestions} أسئلة</p>
                    <p className="text-slate-400 text-xs">نسبة النجاح المطلوبة: 70% (7 أسئلة)</p>
                  </div>
                </div>
              </div>

              {/* Passed vs Failed Feedback Card */}
              {isPassed ? (
                <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 text-xs sm:text-sm font-arabic space-y-2 text-center max-w-xl mx-auto shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>تم اعتماد تخرجك وإصدار الشهادة الرسمية بنجاح!</span>
                  </div>
                  <p className="text-emerald-800 dark:text-emerald-200 text-xs leading-relaxed">
                    لقد أظهرت إتقاناً ممتازاً لمفاهيم React 19 و TypeScript في هذا الاختبار الشامل. تم تسجيل نتيجتك وحفظ إنجازك في ملفك الشخصي.
                  </p>
                </div>
              ) : (
                <div className="p-5 bg-rose-50/80 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200 text-xs sm:text-sm font-arabic space-y-2 text-center max-w-xl mx-auto">
                  <div className="flex items-center justify-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>النتيجة أقل من النسبة المطلوبة (70%)</span>
                  </div>
                  <p className="text-rose-800 dark:text-rose-300 text-xs leading-relaxed">
                    عذراً، لا يتم منح شهادة الإتمام إلا عند تحقيق 70% فأكثر (7 إجابات صحيحة على الأقل من الأسئلة العشرة). يمكنك مراجعة الأسئلة والإجابات النموذجية بالأسفل ثم إعادة المحاولة فوراً!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {/* Certificate button ONLY displayed when score is >= 70% */}
                {isPassed && (
                  <button
                    onClick={onViewCertificate}
                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Award className="w-5 h-5" />
                    <span>عرض وطباعة شهادة الإنجاز</span>
                  </button>
                )}

                {/* Retake Button for everyone, especially if failed */}
                <button
                  onClick={handleRetryQuiz}
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة محاولة الاختبار</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-bold text-sm transition-colors"
                >
                  العودة للدورة
                </button>
              </div>

              {/* Accordion / Toggle to Review all 10 Questions and Correct Answers */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowReviewList(!showReviewList)}
                  className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>مراجعة جميع الأسئلة العشرة والحلول النموذجية مع الشرح</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {showReviewList ? 'إخفاء المراجعة ▲' : 'إظهار المراجعة ▼'}
                  </span>
                </button>

                {showReviewList && (
                  <div className="mt-4 space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {quiz.questions.map((q, idx) => {
                      const userPick = selectedAnswers[idx];
                      const isCorrect = userPick === q.correctAnswerIndex;

                      return (
                        <div
                          key={q.id || idx}
                          className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
                            isCorrect 
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60' 
                              : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">
                              السؤال {idx + 1}: {q.question}
                            </span>
                            {isCorrect ? (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>إجابة صحيحة</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold shrink-0">
                                <XCircle className="w-4 h-4" />
                                <span>إجابة خاطئة</span>
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-1">
                            <p>
                              <strong className="text-slate-700 dark:text-slate-200">إجابتك: </strong>
                              <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-rose-700 dark:text-rose-300 font-semibold'}>
                                {userPick !== undefined ? q.options[userPick] : 'لم تجب على هذا السؤال'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p>
                                <strong className="text-slate-700 dark:text-slate-200">الإجابة الصحيحة: </strong>
                                <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                                  {q.options[q.correctAnswerIndex]}
                                </span>
                              </p>
                            )}
                          </div>

                          {q.explanation && (
                            <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                                التوضيح والشرح البرمجي:
                              </span>
                              <p className="leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
