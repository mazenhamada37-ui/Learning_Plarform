import React from 'react';
import { X, User, Mail, Phone, MapPin, Target, Calendar, BookOpen, Award, CheckCircle2, PlayCircle, Clock, ShieldCheck, Edit3, LogOut } from 'lucide-react';
import { StudentProfile, Course, UserProgress } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentProfile | null;
  courses: Course[];
  userProgressMap: Record<string, UserProgress>;
  onSelectCourse?: (course: Course) => void;
  onOpenCertificate?: (course: Course) => void;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  courses,
  userProgressMap,
  onSelectCourse,
  onOpenCertificate,
  onEditProfile,
  onLogout,
}) => {
  if (!isOpen) return null;

  // Enrolled courses for this student (تم تأمين الكود ضد الـ undefined)
  const safeCourses = courses || [];
  const safeProgressMap = userProgressMap || {};
  
  const enrolledCourses = safeCourses.filter((c) => safeProgressMap[c.id]);
  const completedCourses = enrolledCourses.filter((c) => safeProgressMap[c.id]?.isCompleted);
  const inProgressCourses = enrolledCourses.filter((c) => !safeProgressMap[c.id]?.isCompleted);

  const displayName = studentProfile?.fullName || 'مازن حمادة';
  const displayEmail = studentProfile?.email || 'mazenhamada37@gmail.com';
  const displayPhone = studentProfile?.phone || '+20 100 000 0000';
  const displayCountry = studentProfile?.country || 'مصر';
  const displayGoal = studentProfile?.jobTitleOrGoal || 'برمجة وتطوير الويب';
  const displayDate = studentProfile?.registeredAt || '2026-01-15';

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in font-arabic flex min-h-full items-center justify-center"
      dir="rtl"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative transition-all my-auto flex flex-col max-h-[90vh]"
      >
        {/* Header decoration banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner text-2xl sm:text-3xl font-black text-white shrink-0">
              {displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-2xl font-black">{displayName}</h3>
                <span className="px-2.5 py-0.5 text-[10px] sm:text-xs bg-emerald-400 text-slate-950 font-black rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  حساب طالب معتمد
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 font-mono">
                {displayEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-right">
          
          {/* Section 1: Personal Profile Data */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                <span>البيانات الشخصية للطالب</span>
              </h4>
              {onEditProfile && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditProfile();
                  }}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل البيانات</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  البريد الإلكتروني
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs font-mono block truncate">
                  {displayEmail}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  رقم الهاتف / الجوال
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs font-mono block">
                  {displayPhone}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  الدولة / البلد
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                  {displayCountry}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-emerald-500" />
                  التخصص والهدف التعليمي
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block truncate">
                  {displayGoal}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 sm:col-span-2">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  تاريخ الانضمام والتسجيل
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs font-mono block">
                  {displayDate}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Enrolled Courses & Learning Progress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>الكورسات المسجل بها ({enrolledCourses.length})</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                مكتمل: {completedCourses.length} | قيد التعلم: {inProgressCourses.length}
              </span>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs space-y-1">
                <BookOpen className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                <p className="font-bold">لم تلتحق بأي كورس حتى الآن</p>
                <p className="text-[11px]">تصفح كتالوج الدورات وابدأ التعلم الآن لتظهر دوراتك هنا.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {enrolledCourses.map((course) => {
                  const prog = safeProgressMap[course.id];
                  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
                  const completedLessons = prog?.completedLessonIds?.length || 0;
                  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                  const isDone = prog?.isCompleted;

                  return (
                    <div
                      key={course.id}
                      className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-emerald-500/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          isDone 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                            {course.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>{course.level}</span>
                            <span>•</span>
                            <span>{completedLessons} من {totalLessons} درس</span>
                            <span>•</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{percent}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isDone && onOpenCertificate && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenCertificate(course);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold flex items-center gap-1 hover:bg-amber-100 cursor-pointer"
                            title="عرض الشهادة المعتمدة"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>الشهادة</span>
                          </button>
                        )}
                        {onSelectCourse && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectCourse(course);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>{isDone ? 'مراجعة' : 'متابعة'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Logout Section */}
          {onLogout && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span>هل تريد الخروج من هذا الحساب؟</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};