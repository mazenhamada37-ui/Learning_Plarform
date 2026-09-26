import React from 'react';
import { Award, BookOpen, Clock, Flame, CheckCircle2, ArrowLeft, PlayCircle, Star, ShieldCheck, Download, UserCheck, Edit3, Mail, MapPin, Target, LogOut } from 'lucide-react';
import { Course, StudentProfile, UserProgress } from '../types';

interface StudentDashboardProps {
  enrolledCourses: Course[];
  userProgressMap: Record<string, UserProgress>;
  onSelectCourse: (course: Course) => void;
  onOpenCertificate: (course: Course) => void;
  streakDays: number;
  studentProfile: StudentProfile | null;
  onOpenRegistrationModal: () => void;
  onLogoutStudent?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  enrolledCourses,
  userProgressMap,
  onSelectCourse,
  onOpenCertificate,
  streakDays,
  studentProfile,
  onOpenRegistrationModal,
  onLogoutStudent
}) => {
  // تصفية الكورسات لتقتصر فقط على الكورس أو التراك الذي اختاره الطالب عند التسجيل
  const filteredCourses = enrolledCourses.filter((course) => {
    if (!studentProfile || !studentProfile.jobTitleOrGoal) return true;
    
    const targetGoal = studentProfile.jobTitleOrGoal.toLowerCase();
    const courseTitle = course.title.toLowerCase();
    const courseCategory = course.category.toLowerCase();

    // مطابقة اسم التراك المختار مع عنوان الكورس أو فئته
    return (
      targetGoal.includes(courseTitle) || 
      courseTitle.includes(targetGoal.split(' ')[0]) || 
      targetGoal.includes(courseCategory) ||
      courseCategory.includes(targetGoal.split(' ')[0])
    );
  });

  // إذا لم يتم العثور على مطابقة دقيقة، نعرض الكورسات المسجلة كاحتياطي لكي لا تظهر الواجهة فارغة تماماً
  const displayCourses = filteredCourses.length > 0 ? filteredCourses : enrolledCourses;

  // Compute overall stats based on displayed courses
  let totalHoursStudied = 0;
  let completedCoursesCount = 0;

  displayCourses.forEach((c) => {
    const prog = userProgressMap[c.id];
    const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = prog?.completedLessonIds?.length || 0;
    
    if (totalLessons > 0) {
      totalHoursStudied += Math.round((completedLessons / totalLessons) * c.estimatedHours);
    }
    if (prog?.isCompleted) {
      completedCoursesCount++;
    }
  });

  const completedCoursesList = displayCourses.filter(c => userProgressMap[c.id]?.isCompleted);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5 font-arabic">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>تتابع التعلم: {streakDays} أيام متواصلة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-arabic">
              {studentProfile ? `أهلاً بك، ${studentProfile.fullName}! 🎓` : 'مرحباً بك في لوحة تحكمك التعليمية! 🎓'}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              تابع إنجازاتك اليومية، استعرض مسارك التعليمي المخصص، واستخرج شهادات الإنجاز المعتمدة الخاصة بك.
            </p>
          </div>

          <button
            onClick={onOpenRegistrationModal}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 backdrop-blur-md transition-all shrink-0 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>{studentProfile ? 'تعديل البيانات الشخصية' : 'تسجيل البيانات الرسمية'}</span>
            <Edit3 className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>

        {/* Profile Card Summary if registered */}
        {studentProfile && (
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-100">
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span className="truncate">{studentProfile.email}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{studentProfile.country || 'مصر'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="truncate">{studentProfile.jobTitleOrGoal || 'التخصص المستهدف'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">الدورات المخصصة لتراكك</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {displayCourses.length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">الشهادات المكتسبة</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {completedCoursesCount}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">ساعات المذاكرة المنجزة</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {totalHoursStudied} ساعة
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 font-bold">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">معدل الانضباط</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {streakDays > 0 ? 'ممتاز 🔥' : 'بدء التعلم'}
            </div>
          </div>
        </div>

      </div>

      {/* Section 1: Filtered Courses for the Student's Track */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-arabic">
            كورسات مسارك التعليمي المختار
          </h2>
          {studentProfile?.jobTitleOrGoal && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
              التراك: {studentProfile.jobTitleOrGoal}
            </span>
          )}
        </div>

        {displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((course) => {
              const prog = userProgressMap[course.id];
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              const completedCount = prog?.completedLessonIds?.length || 0;
              const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                        {course.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {percent}%
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 font-arabic">
                      {course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500">
                      {completedCount} من {totalLessons} دروس
                    </span>

                    <button
                      onClick={() => onSelectCourse(course)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span>متابعة</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">لا توجد كورسات مطابقة لتراكك الحالي.</p>
            <p className="text-xs text-slate-500">يرجى تعديل بياناتك الشخصية واختيار التراك المناسب.</p>
          </div>
        )}
      </div>

      {/* Section 2: Earned Certificates Gallery */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-arabic flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>شهادات الإنجاز المكتسبة ({completedCoursesList.length})</span>
        </h2>

        {completedCoursesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedCoursesList.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 font-arabic">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      تقدير ممتاز (95%) • {course.estimatedHours} ساعة معتمدة
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenCertificate(course)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 shadow-sm transition-all cursor-pointer"
                >
                  معاينة وطباعة
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500">
            أكمل دروس أي دورة واجتز اختبارها النهائي للحصول على شهادة رسمية قابلة للطباعة فوراً.
          </div>
        )}
      </div>

    </div>
  );
};