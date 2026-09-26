import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle2, User, Sparkles, Filter, Trash2 } from 'lucide-react';
import { Course, CourseReview, StudentProfile } from '../types';

interface CourseReviewsSectionProps {
  course: Course;
  reviews: CourseReview[];
  currentStudent?: StudentProfile | null;
  activeLessonTitle?: string;
  onAddReview: (review: Omit<CourseReview, 'id' | 'createdAt'>) => void;
  onDeleteReview?: (reviewId: string) => void;
  isAdmin?: boolean;
}

export const CourseReviewsSection: React.FC<CourseReviewsSectionProps> = ({
  course,
  reviews,
  currentStudent,
  activeLessonTitle,
  onAddReview,
  onDeleteReview,
  isAdmin = false,
}) => {
  // Filter state
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');

  // New review form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>(currentStudent?.fullName || '');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Course specific reviews
  const courseReviews = reviews.filter((r) => r.courseId === course.id);

  // Calculate statistics
  const totalCount = courseReviews.length;
  const avgRating = totalCount > 0
    ? Math.round((courseReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 10) / 10
    : course.rating;

  const starCounts = {
    5: courseReviews.filter((r) => r.rating === 5).length,
    4: courseReviews.filter((r) => r.rating === 4).length,
    3: courseReviews.filter((r) => r.rating === 3).length,
    2: courseReviews.filter((r) => r.rating === 2).length,
    1: courseReviews.filter((r) => r.rating === 1).length,
  };

  const filteredReviews = selectedFilter === 'all'
    ? courseReviews
    : courseReviews.filter((r) => r.rating === selectedFilter);

  const starLabels: Record<number, string> = {
    5: 'ممتاز للغاية (5 نجوم)',
    4: 'جيد جداً (4 نجوم)',
    3: 'جيد ومفيد (3 نجوم)',
    2: 'مقبول (نجمتان)',
    1: 'يحتاج تحسين (نجمة واحدة)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const finalName = authorName.trim() || currentStudent?.fullName || 'طالب متميز';
    if (!comment.trim()) {
      setFormError('يرجى كتابة تعليق أو ملاحظاتك حول الكورس قبل النشر.');
      return;
    }

    setIsSubmitting(true);

    try {
      onAddReview({
        courseId: course.id,
        studentName: finalName,
        studentEmail: currentStudent?.email,
        rating,
        comment: comment.trim(),
        lessonTitle: activeLessonTitle,
      });

      setComment('');
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
      }, 4000);
    } catch {
      setFormError('حدث خطأ أثناء حفظ التقييم. حاول مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return 'مؤخراً';
    }
  };

  return (
    <div className="space-y-8" id="course-reviews-section">
      {/* 1. Header & Rating Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          {/* Main Score Box */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30 border border-amber-200 dark:border-amber-800 flex flex-col items-center justify-center shrink-0 shadow-xs">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {avgRating.toFixed(1)}
              </span>
              <div className="flex items-center gap-0.5 mt-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${s <= Math.round(avgRating) ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white font-arabic">
                تقييمات ومراجعات الطلاب
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                متوسط التقييم العام للدورة مبني على {totalCount > 0 ? totalCount : course.reviewsCount} مراجعة موثوقة من الطلاب والمشاركين.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start md:self-center px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>مراجعات مباشرة ومحدّثة لحظياً</span>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-6">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star as keyof typeof starCounts];
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : star >= 4 ? 80 : 10;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedFilter(selectedFilter === star ? 'all' : star)}
                className={`p-3 rounded-2xl border transition-all text-right ${
                  selectedFilter === star
                    ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 ring-2 ring-amber-400/30'
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200">
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline" />
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{count} ({pct}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Leave a Review Form */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white font-arabic">
                أضف تقييمك ورأيك في هذه الدورة
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ملاحظاتك تساعد المعلم في تحسين المحتوى وترشد زملاءك الطلاب.
              </p>
            </div>
          </div>

          {activeLessonTitle && (
            <span className="hidden sm:inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700">
              بعد درس: {activeLessonTitle}
            </span>
          )}
        </div>

        {submittedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">شكراً لك! تم تسجيل ومزامنة تقييمك بنجاح.</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                تم تحديث متوسط تقييم الكورس تلقائياً ليظهر لجميع الطلاب والمحاضرين.
              </p>
            </div>
          </div>
        )}

        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Interactive Star Rating Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              اختر تقييمك بالنجوم:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-115 focus:outline-none"
                      title={starLabels[star]}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                {starLabels[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسمك (كما سيظهر مع التقييم):
            </label>
            <input
              type="text"
              placeholder="مثال: أحمد عبد الرحمن"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              رأيك وملاحظاتك المكتوبة:
            </label>
            <textarea
              rows={3}
              placeholder="اكتب ما أعجبك في الدورة، جودة الشرح، التمارين العملية، أو أي نصائح لزملائك..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري النشر...' : 'نشر التقييم والمراجعة'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Filter Bar & Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2 font-arabic">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>المراجعات المنشورة ({filteredReviews.length})</span>
          </h4>

          {selectedFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              عرض جميع المراجعات
            </button>
          )}
        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-6 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              لا توجد مراجعات تطابق الفلتر المحدد حالياً.
            </p>
            <p className="text-xs text-slate-400">
              كن أول من يترك مراجعة وتقييم لهذه الدورة في الأعلى!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative group"
              >
                {/* Header: Student Info & Stars */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {rev.studentName ? rev.studentName.slice(0, 1) : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {rev.studentName}
                      </h5>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(rev.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Optional Lesson context */}
                {rev.lessonTitle && (
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/50 inline-block">
                    تقييم بعد درس: {rev.lessonTitle}
                  </div>
                )}

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Admin delete button */}
                {isAdmin && onDeleteReview && (
                  <button
                    type="button"
                    onClick={() => onDeleteReview(rev.id)}
                    title="حذف المراجعة (صلاحية المسؤول)"
                    className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
