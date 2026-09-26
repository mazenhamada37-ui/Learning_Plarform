import React from 'react';
import { Star, Clock, Users, BookOpen, Sparkles, CheckCircle, ArrowLeft, Edit3 } from 'lucide-react';
import { Course, UserProgress } from '../types';

interface CourseCardProps {
  course: Course;
  userProgress?: UserProgress;
  onSelectCourse: (course: Course) => void;
  onEditCourse?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  userProgress,
  onSelectCourse,
  onEditCourse
}) => {
  // Calculate completed lessons percentage
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = userProgress?.completedLessonIds?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  return (
    <div 
      onClick={() => onSelectCourse(course)}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Thumbnail & Badges */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        
        {/* Category Pill */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
          {course.category}
        </div>

        {/* AI Generated Badge */}
        {course.isAiGenerated && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>مُبتكرة بالـ AI</span>
          </div>
        )}

        {/* Level Tag bottom left */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm text-slate-200 text-[11px] font-medium border border-white/10">
          {course.level}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        
        {/* Title & Subtitle */}
        <div className="space-y-1.5 flex-1">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {course.subtitle}
          </p>
        </div>

        {/* Instructor Info & Rating */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {course.instructor.name}
            </span>
          </div>

          <div 
            className="flex items-center gap-1 text-amber-500 text-xs font-bold"
            title={`متوسط التقييم: ${(course.rating || 0).toFixed(1)} من 5 نجوم (${course.reviewsCount || 0} مراجعة)`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{(course.rating || 0).toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({course.reviewsCount || 0})</span>
          </div>
        </div>

        {/* Progress Bar (if enrolled) or Course Meta Info */}
        {progressPercent > 0 ? (
          <div className="space-y-1.5 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span>نسبة الإنجاز</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-200/60 dark:bg-emerald-900/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.estimatedHours} ساعة</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.studentsEnrolledCount.toLocaleString('ar-EG')} طالب</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{totalLessons} دروس</span>
            </div>
          </div>
        )}

        {/* Action Button & Quick Update */}
        <div className="pt-2 flex items-center gap-2">
          <button 
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              userProgress?.isCompleted
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : progressPercent > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white'
            }`}
          >
            {userProgress?.isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>مكتملة - استعراض الشهادة</span>
              </>
            ) : progressPercent > 0 ? (
              <>
                <span>متابعة التعلم</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>ابدأ التعلم الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>

          {onEditCourse && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditCourse(course);
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shrink-0 cursor-pointer"
              title="تحديث أو تعديل محتوى الكورس ✏️"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
