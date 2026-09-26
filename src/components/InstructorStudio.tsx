import React, { useState } from 'react';
import { Plus, BookOpen, Users, Sparkles, Clock, AlertCircle, CheckCircle2, UserCheck, Edit3, Mail, Phone, Award, LogOut, Settings } from 'lucide-react';
import { Course, CategoryType, CourseLevel, InstructorProfile, CourseChangeRequest } from '../types';

interface InstructorStudioProps {
  instructorCourses: Course[];
  onAddCourse: (course: Course) => void;
  onOpenAiGenerator: () => void;
  onOpenAddCourseModal?: () => void;
  onOpenEditCourse?: (course: Course) => void;
  pendingCourseRequests?: CourseChangeRequest[];
  instructorProfile: InstructorProfile | null;
  onOpenRegistrationModal: () => void;
  onLogoutInstructor?: () => void;
  isApprovedInstructor?: boolean;
}

export const InstructorStudio: React.FC<InstructorStudioProps> = ({
  instructorCourses,
  onAddCourse,
  onOpenAiGenerator,
  onOpenAddCourseModal,
  onOpenEditCourse,
  pendingCourseRequests = [],
  instructorProfile,
  onOpenRegistrationModal,
  onLogoutInstructor,
  isApprovedInstructor = false
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('برمجة وتطوير');
  const [level, setLevel] = useState<CourseLevel>('متوسط');
  const [estimatedHours, setEstimatedHours] = useState(8);

  // Check if instructor is verified & approved
  const isApproved = isApprovedInstructor || (instructorProfile?.isApproved === true && instructorProfile.status !== 'pending');

  // If No Instructor Profile Registered Yet -> Show Gated Registration Screen
  if (!instructorProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 font-arabic text-center space-y-6" dir="rtl">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 shadow-xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              استوديو المحاضر وإعداد المناهج 👨‍🏫
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              مرحباً بك! لإضافة وتعديل الدورات التدريبية ونشر المناهج على المنصة، يجب تسجيل بياناتك الرسمية كمحاضر والحصول على موافقة المسؤول أولاً.
            </p>
          </div>

          <div className="bg-amber-50/80 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm max-w-lg mx-auto flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>نظام الحماية: يشترط موافقة المسؤول وإدارة المنصة قبل الدخول ونشر أي محتوى.</span>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenRegistrationModal}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-5 h-5" />
              <span>تسجيل بيانات المحاضر الآن للانضمام</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If Registered But Awaiting Admin Approval -> Show Pending Approval Lock Screen
  if (!isApproved) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 font-arabic text-center space-y-6" dir="rtl">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-amber-300 dark:border-amber-800/80 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 animate-pulse" />

          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/30">
            <Clock className="w-10 h-10 animate-spin-slow" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>طلب التسجيل قيد المراجعة والاعتماد</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              أهلاً بك أستاذ {instructorProfile.fullName} 👨‍🏫
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              تم إرسال طلب تسجيلك كمحاضر في المنصة بنجاح. الطلب الآن معروض في لوحة تحكم المسؤول والإدارة للمراجعة والموافقة عليه قبل منح صلاحيات إنشاء وإدارة الدورات.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-right max-w-lg mx-auto space-y-2 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>بيانات الطلب المقدم:</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>الاسم الكامل:</span>
              <span className="font-bold text-slate-900 dark:text-white">{instructorProfile.fullName}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>البريد الإلكتروني:</span>
              <span className="font-bold text-slate-900 dark:text-white">{instructorProfile.email}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>المسمى الوظيفي:</span>
              <span className="font-bold text-slate-900 dark:text-white">{instructorProfile.title}</span>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs max-w-lg mx-auto flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>المنصة متصلة بقاعدة البيانات السحابية - سيتم فتح استوديو المحاضر تلقائياً فور موافقة المسؤول دون الحاجة لتحديث الصفحة.</span>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenRegistrationModal}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
            >
              تعديل بيانات التسجيل
            </button>
            {onLogoutInstructor && (
              <button
                onClick={onLogoutInstructor}
                className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all"
              >
                تسجيل الخروج
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filter pending course requests submitted by this lecturer
  const myPendingRequests = pendingCourseRequests.filter(
    (req) => !instructorProfile?.email || req.instructorEmail === instructorProfile.email || req.instructorName === instructorProfile.fullName
  );

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCourse: Course = {
      id: `custom-course-${Date.now()}`,
      title,
      subtitle: subtitle || 'دورة تعليمية احترافية مخصصة من إعداد المحاضر.',
      description: subtitle || 'منهج تعليمي شامل.',
      category,
      level,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      instructor: {
        id: `inst-${Date.now()}`,
        name: instructorProfile?.fullName || 'المحاضر المحترف',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        title: instructorProfile?.title || 'مدرب ومحاضر معتمد',
        bio: instructorProfile?.bio || 'خبير إعداد وتدريس المناهج الرقمية.',
        rating: 5.0,
        studentsCount: 120
      },
      rating: 5.0,
      reviewsCount: 1,
      studentsEnrolledCount: 1,
      estimatedHours,
      price: 'مجاني',
      tags: [category, 'منهج مخصص'],
      learningObjectives: ['اكتساب المهارة الأساسية', 'التطبيق العملي في الميدان'],
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          title: 'الوحدة 1: المقدمة والأساسيات',
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: 'مقدمة ونظرة عامة على المقرر',
              durationMinutes: 15,
              contentType: 'text',
              contentMarkdown: `### مرحباً بك في هذه الدورة!\n\nهذا الدرس الأول تم إعداده بواسطة المحاضر. يمكنك إضافة مقاطع فيديو أو نصوص توضيحية.`,
              keyTakeaways: ['التعرف على أهداف الدورة', 'خطة العمل والتطبيقات']
            }
          ]
        }
      ]
    };

    onAddCourse(newCourse);
    setShowAddForm(false);
    setTitle('');
    setSubtitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
      
      {/* Studio Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-amber-800/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Award className="w-4 h-4 text-amber-400" />
              <span>استوديو المحاضر والمدرب</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-arabic">
              {instructorProfile ? `مرحباً بك أستاذ ${instructorProfile.fullName} 👨‍🏫` : 'استوديو المحاضر وإنشاء المناهج 👨‍🏫'}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              أضف أو عدّل دوراتك التدريبية، وسترسل مباشرة للمسؤول لاعتمادها ونشرها للطلاب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenRegistrationModal}
              className="px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{instructorProfile ? 'تعديل بيانات المحاضر' : 'سجل بياناتك كمحاضر أولاً'}</span>
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (onOpenAddCourseModal) {
                  onOpenAddCourseModal();
                } else if (!instructorProfile) {
                  onOpenRegistrationModal();
                } else {
                  setShowAddForm(!showAddForm);
                }
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm shadow-md hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              <span>إضافة كورس جديد ➕</span>
            </button>

            <button
              onClick={() => {
                if (!instructorProfile) {
                  onOpenRegistrationModal();
                } else {
                  onOpenAiGenerator();
                }
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>توليد دورة بالـ AI</span>
            </button>
          </div>
        </div>

        {/* Saved Instructor Profile Card Banner if registered */}
        {instructorProfile ? (
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-100">
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="truncate">{instructorProfile.title}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="truncate">{instructorProfile.email}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="truncate">تخصص: {instructorProfile.specialization || 'تدريب رقمي'}</span>
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-white/10 p-3 bg-amber-500/10 rounded-xl border border-amber-400/20 text-xs text-amber-200 flex items-center justify-between gap-2">
            <span>⚠️ تنبيه: يفضل إكمال تسجيل بياناتك كمحاضر لتظهر أستاذيتك على شهادات ودورات المنصة.</span>
            <button
              onClick={onOpenRegistrationModal}
              className="underline font-bold text-amber-300 hover:text-white shrink-0 cursor-pointer"
            >
              سجل الآن
            </button>
          </div>
        )}
      </div>

      {/* Pending Course Requests Status (Awaiting Admin Approval) */}
      {myPendingRequests.length > 0 && (
        <div className="p-4 sm:p-5 bg-amber-50/70 dark:bg-amber-950/30 rounded-3xl border border-amber-200 dark:border-amber-800/80 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                طلبات كورسات قيد مراجعة وموافقة المسؤول ({myPendingRequests.length})
              </h3>
            </div>
            <span className="text-xs bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
              بانتظار موافقة المسؤول 👑
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {myPendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 text-xs space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {req.courseTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                    {req.type === 'create' ? 'إضافة كورس جديد' : req.type === 'update' ? 'تعديل كورس' : 'حذف'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  <span>تاريخ الإرسال: {req.requestedAt}</span>
                </div>
                {req.changeNotes && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                    {req.changeNotes}
                  </p>
                )}
                <div className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1 font-semibold pt-1">
                  <span>⏳ الكورس سيظهر للطلاب بمجرد اعتماد المسؤول للطلب</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Add Form Toggle */}
      {showAddForm && (
        <form onSubmit={handleCreateCourse} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-arabic">
            بيانات الدورة الجديدة
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              required
              placeholder="عنوان الدورة التعليمية..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />

            <input
              type="text"
              placeholder="وصف مختصر للدورة..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold"
              >
                <option value="برمجة وتطوير">برمجة وتطوير</option>
                <option value="الذكاء الاصطناعي">الذكاء الاصطناعي</option>
                <option value="تصميم واجهات UI/UX">تصميم واجهات UI/UX</option>
                <option value="علوم البيانات">علوم البيانات</option>
              </select>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
                className="p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold"
              >
                <option value="مبتدئ">مبتدئ</option>
                <option value="متوسط">متوسط</option>
                <option value="عالمي">عالمي</option>
              </select>

              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                placeholder="عدد الساعات"
                className="p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
          >
            حفظ وإنشاء الدورة
          </button>
        </form>
      )}

      {/* Instructor Courses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-arabic">
            الدورات التدريبية المتاحة ({instructorCourses.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            اضغط على أي دورة لتعديل محتواها وإرسال التحديث للمسؤول
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructorCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{course.level}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 font-arabic">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {course.subtitle || course.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.studentsEnrolledCount} طلاب</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} دروس</span>
                  </div>
                </div>

                {onOpenEditCourse && (
                  <button
                    type="button"
                    onClick={() => onOpenEditCourse(course)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>تعديل وتحديث الكورس (طلب موافقة)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
