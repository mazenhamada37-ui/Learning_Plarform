import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookPlus, 
  Sparkles, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Image as ImageIcon, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Course, CategoryType, CourseLevel, Module, Lesson, CourseChangeRequest } from '../types';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onRequestCourseChange?: (request: CourseChangeRequest) => void;
  onDeleteCourse?: (courseId: string) => void;
  onOpenAiGenerator: () => void;
  allCourses: Course[];
  initialSelectedCourseId?: string | null;
  defaultInstructorName?: string;
  instructorEmail?: string;
  isOwnerSession?: boolean;
}

const CATEGORIES: CategoryType[] = [
  'برمجة وتطوير',
  'الذكاء الاصطناعي',
  'تصميم واجهات UI/UX',
  'علوم البيانات',
  'إدارة الأعمال والقيادة',
  'اللغات والتواصل'
];

const LEVELS: CourseLevel[] = ['مبتدئ', 'متوسط', 'عالمي', 'جميع المستويات'];

const SAMPLE_THUMBNAILS = [
  { label: 'برمجة وكود', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop' },
  { label: 'ذكاء اصطناعي', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop' },
  { label: 'تصميم UI/UX', url: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?q=80&w=800&auto=format&fit=crop' },
  { label: 'بيانات وإحصاء', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop' },
  { label: 'إدارة وتخطيط', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' }
];

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
  onUpdateCourse,
  onRequestCourseChange,
  onDeleteCourse,
  onOpenAiGenerator,
  allCourses,
  initialSelectedCourseId,
  defaultInstructorName = 'المحاضر المعتمد',
  instructorEmail,
  isOwnerSession = false
}) => {
  const [activeMode, setActiveMode] = useState<'create' | 'update'>('create');
  
  // Selected course for update mode
  const [selectedCourseToUpdateId, setSelectedCourseToUpdateId] = useState<string>('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('برمجة وتطوير');
  const [level, setLevel] = useState<CourseLevel>('متوسط');
  const [estimatedHours, setEstimatedHours] = useState<number>(6);
  const [thumbnail, setThumbnail] = useState<string>(SAMPLE_THUMBNAILS[0].url);
  const [instructorName, setInstructorName] = useState<string>(defaultInstructorName);
  const [firstLessonTitle, setFirstLessonTitle] = useState('مقدمة تمهيدية ونظرة شاملة');
  const [firstLessonVideoUrl, setFirstLessonVideoUrl] = useState('https://www.youtube.com/watch?v=6QAELgirvjs');
  const [firstLessonContent, setFirstLessonContent] = useState('مرحباً بك في هذا المقرر التعليمي! في هذا الدرس سنستعرض الأهداف والمفاهيم الرئيسية.');

  // Additional Lessons
  const [extraLessons, setExtraLessons] = useState<{ title: string; videoUrl: string; durationMinutes: number }[]>([]);

  // Status message
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync initial course if passed
  useEffect(() => {
    if (initialSelectedCourseId) {
      setActiveMode('update');
      setSelectedCourseToUpdateId(initialSelectedCourseId);
      loadCourseData(initialSelectedCourseId);
    }
  }, [initialSelectedCourseId]);

  const loadCourseData = (courseId: string) => {
    const course = allCourses.find((c) => c.id === courseId);
    if (!course) return;

    setTitle(course.title);
    setSubtitle(course.subtitle || course.description);
    setCategory(course.category);
    setLevel(course.level);
    setEstimatedHours(course.estimatedHours || 6);
    setThumbnail(course.thumbnail);
    setInstructorName(course.instructor?.name || defaultInstructorName);

    const firstLesson = course.modules?.[0]?.lessons?.[0];
    if (firstLesson) {
      setFirstLessonTitle(firstLesson.title);
      setFirstLessonVideoUrl(firstLesson.videoUrl || 'https://www.youtube.com/watch?v=6QAELgirvjs');
      setFirstLessonContent(firstLesson.contentMarkdown || '');
    }

    // Load remaining lessons
    const remaining: { title: string; videoUrl: string; durationMinutes: number }[] = [];
    course.modules?.forEach((mod, mIdx) => {
      mod.lessons?.forEach((les, lIdx) => {
        if (mIdx === 0 && lIdx === 0) return;
        remaining.push({
          title: les.title,
          videoUrl: les.videoUrl || 'https://www.youtube.com/watch?v=6QAELgirvjs',
          durationMinutes: les.durationMinutes || 15
        });
      });
    });
    setExtraLessons(remaining);
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setCategory('برمجة وتطوير');
    setLevel('متوسط');
    setEstimatedHours(6);
    setThumbnail(SAMPLE_THUMBNAILS[0].url);
    setInstructorName(defaultInstructorName);
    setFirstLessonTitle('مقدمة تمهيدية ونظرة شاملة');
    setFirstLessonVideoUrl('https://www.youtube.com/watch?v=6QAELgirvjs');
    setFirstLessonContent('مرحباً بك في هذا المقرر التعليمي! في هذا الدرس سنستعرض الأهداف والمفاهيم الرئيسية.');
    setExtraLessons([]);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleModeChange = (mode: 'create' | 'update') => {
    setActiveMode(mode);
    setErrorMsg('');
    setSuccessMsg('');
    if (mode === 'update' && allCourses.length > 0) {
      const firstId = selectedCourseToUpdateId || allCourses[0].id;
      setSelectedCourseToUpdateId(firstId);
      loadCourseData(firstId);
    } else {
      resetForm();
    }
  };

  const handleSelectCourseToUpdate = (courseId: string) => {
    setSelectedCourseToUpdateId(courseId);
    loadCourseData(courseId);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAddExtraLesson = () => {
    setExtraLessons((prev) => [
      ...prev,
      {
        title: `الدرس رقم ${prev.length + 2}: التطبيق العملي`,
        videoUrl: 'https://www.youtube.com/watch?v=6QAELgirvjs',
        durationMinutes: 20
      }
    ]);
  };

  const handleRemoveExtraLesson = (index: number) => {
    setExtraLessons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExtraLessonChange = (index: number, field: 'title' | 'videoUrl' | 'durationMinutes', value: any) => {
    setExtraLessons((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('يرجى كتابة عنوان الدورة التدريبية');
      return;
    }

    // Build modules and lessons
    const primaryLesson: Lesson = {
      id: `les-${Date.now()}-1`,
      title: firstLessonTitle.trim() || 'الدرس الأول: المقدمة',
      durationMinutes: 15,
      contentType: 'video',
      videoUrl: firstLessonVideoUrl.trim() || 'https://www.youtube.com/watch?v=6QAELgirvjs',
      contentMarkdown: firstLessonContent || 'محتوى الدرس التمهيدي.',
      keyTakeaways: ['فهم أسس ومفاهيم المقرر', 'التطبيق العملي المستمر']
    };

    const additionalLessonsObj: Lesson[] = extraLessons.map((les, idx) => ({
      id: `les-${Date.now()}-${idx + 2}`,
      title: les.title.trim() || `الدرس رقم ${idx + 2}`,
      durationMinutes: les.durationMinutes || 15,
      contentType: 'video',
      videoUrl: les.videoUrl.trim() || 'https://www.youtube.com/watch?v=6QAELgirvjs',
      contentMarkdown: `### ${les.title}\n\nشرح تفصيلي ومصادر إضافية للتطبيق العملي.`,
      keyTakeaways: ['إتقان مهارة الدرس', 'حل التمارين المصاحبة']
    }));

    const allLessonsList = [primaryLesson, ...additionalLessonsObj];

    const moduleObj: Module = {
      id: `mod-${Date.now()}-1`,
      title: 'الوحدة التدريبية الرئيسية والشاملة',
      lessons: allLessonsList
    };

    if (activeMode === 'create') {
      const newCourse: Course = {
        id: `custom-course-${Date.now()}`,
        title: title.trim(),
        subtitle: subtitle.trim() || 'منهج تعليمي حديث ومحدث.',
        description: subtitle.trim() || 'منهج تعليمي شامل يركز على التطبيق الفعلي.',
        category,
        level,
        thumbnail: thumbnail || SAMPLE_THUMBNAILS[0].url,
        instructor: {
          id: `inst-${Date.now()}`,
          name: instructorName.trim() || defaultInstructorName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          title: 'مدرب ومحاضر معتمد',
          bio: 'خبير تقني ومتخصص في إعداد المناهج.',
          rating: 5.0,
          studentsCount: 150
        },
        rating: 5.0,
        reviewsCount: 1,
        studentsEnrolledCount: 1,
        estimatedHours: Number(estimatedHours) || 6,
        price: 'مجاني',
        tags: [category, level, 'دورة حديثة'],
        learningObjectives: [
          'إتقان المهارات العملية الأساسية والمتقدمة',
          'بناء مشاريع تطبيقية واقعية',
          'الحصول على شهادة إنجاز معتمدة'
        ],
        modules: [moduleObj],
        quiz: {
          title: `اختبار دورة: ${title.trim()}`,
          passingScorePercent: 70,
          questions: [
            {
              id: 'q1',
              question: `ما هو المفهوم الأساسي الذي تدور حوله دورة ${title.trim()}؟`,
              options: [
                'التطبيق العملي واكتساب مهارات السوق الحديثة',
                'المفاهيم النظرية فقط دون ممارسة',
                'الحفظ الآلي دون فهم',
                'لا شيء مما ذكر'
              ],
              correctAnswerIndex: 0,
              explanation: 'تهدف الدورة إلى التركيز على المهارات التطبيقية المباشرة.'
            },
            {
              id: 'q2',
              question: 'ما هي الخطوة الفضلى لترسيخ ما تعلمته في المقرر؟',
              options: [
                'بناء مشاريع عملية وحل التمارين التفاعلية',
                'مشاهدة الدروس لمرة واحدة فقط',
                'تخطي الاختبارات والمشاريع',
                'الانتظار دون تطبيق'
              ],
              correctAnswerIndex: 0,
              explanation: 'المشاريع التطبيقية هي أفضل وسيلة لترسيخ المعرفة والمهارة.'
            }
          ]
        },
        updatedAt: new Date().toISOString()
      };

      if (!isOwnerSession && onRequestCourseChange) {
        const changeReq: CourseChangeRequest = {
          id: `req-${Date.now()}`,
          type: 'create',
          courseId: newCourse.id,
          courseTitle: newCourse.title,
          instructorName: instructorName.trim() || defaultInstructorName,
          instructorEmail,
          requestedAt: new Date().toISOString().split('T')[0],
          courseData: newCourse,
          changeNotes: `طلب اعتماد وإضافة كورس جديد بعنوان "${newCourse.title}"`,
          status: 'pending'
        };
        onRequestCourseChange(changeReq);
        setSuccessMsg('⏳ تم إرسال طلب إضافة الكورس إلى مسؤول المنصة! سيتم اعتماده ونشره فور موافقة الإدارة.');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1400);
      } else {
        onAddCourse(newCourse);
        setSuccessMsg('🎉 تم إضافة الكورس الجديد بنجاح! ستجده الآن في قائمة الدورات.');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 900);
      }
    } else {
      // Update existing course
      const existingCourse = allCourses.find((c) => c.id === selectedCourseToUpdateId);
      if (!existingCourse) {
        setErrorMsg('لم يتم العثور على الكورس المراد تحديثه.');
        return;
      }

      const updatedCourse: Course = {
        ...existingCourse,
        title: title.trim(),
        subtitle: subtitle.trim() || existingCourse.subtitle,
        description: subtitle.trim() || existingCourse.description,
        category,
        level,
        thumbnail: thumbnail || existingCourse.thumbnail,
        instructor: {
          ...existingCourse.instructor,
          name: instructorName.trim() || existingCourse.instructor?.name || defaultInstructorName
        },
        estimatedHours: Number(estimatedHours) || existingCourse.estimatedHours,
        modules: [moduleObj],
        updatedAt: new Date().toISOString()
      };

      if (!isOwnerSession && onRequestCourseChange) {
        const changeReq: CourseChangeRequest = {
          id: `req-${Date.now()}`,
          type: 'update',
          courseId: updatedCourse.id,
          courseTitle: updatedCourse.title,
          instructorName: instructorName.trim() || defaultInstructorName,
          instructorEmail,
          requestedAt: new Date().toISOString().split('T')[0],
          courseData: updatedCourse,
          changeNotes: `طلب تحديث واستبدال محتوى دورة "${updatedCourse.title}"`,
          status: 'pending'
        };
        onRequestCourseChange(changeReq);
        setSuccessMsg('⏳ تم إرسال طلب تحديث الكورس إلى مسؤول المنصة! سيتم اعتماد التغييرات فور موافقة الإدارة.');
        setTimeout(() => {
          onClose();
        }, 1400);
      } else {
        onUpdateCourse(updatedCourse);
        setSuccessMsg('✅ تم تحديث الكورس واستبدال محتواه بنجاح!');
        setTimeout(() => {
          onClose();
        }, 900);
      }
    }
  };

  const handleDeleteCurrentCourse = () => {
    if (!selectedCourseToUpdateId || !onDeleteCourse) return;
    const target = allCourses.find((c) => c.id === selectedCourseToUpdateId);
    if (!target) return;

    if (window.confirm(`هل أنت متأكد من حذف كورس "${target.title}"؟`)) {
      onDeleteCourse(selectedCourseToUpdateId);
      setSuccessMsg('تم حذف الكورس القديم بنجاح.');
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in dir-rtl flex min-h-full items-center justify-center"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[90vh] my-auto min-h-0"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <BookPlus className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold font-arabic">
                إدارة وإضافة الكورسات 📚
              </h3>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-medium mt-0.5">
                أضف كورس جديد يدوي أو حدّث واستبدل كورس قديم بفيديوهات ومحتوى أحدث
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1.5 border-b border-slate-200 dark:border-slate-800 shrink-0 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => handleModeChange('create')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all cursor-pointer ${
              activeMode === 'create'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة كورس جديد ➕</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('update')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all cursor-pointer ${
              activeMode === 'update'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>تحديث / استبدال كورس قديم 🔄</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAiGenerator();
            }}
            className="hidden sm:flex items-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 transition-all text-xs font-bold"
            title="توليد كورس كامل تلقائياً بالذكاء الاصطناعي"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>مُنشئ الـ AI ✨</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0 touch-pan-y overscroll-contain">
          
          {/* Approval Notice when not in owner session */}
          {!isOwnerSession && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-2.5">
              <span className="text-base">👑</span>
              <span>
                <strong>نظام اعتماد الكورسات:</strong> عند حفظ الكورس أو تعديله، سيتم إرسال الطلب تلقائياً إلى مسؤول المنصة لمراجعته والموافقة عليه قبل ظهوره للطلاب.
              </span>
            </div>
          )}

          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* If In Update Mode -> Course Selector */}
          {activeMode === 'update' && (
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                <span>اختر الكورس الذي ترغب في تحديثه أو استبداله:</span>
                {onDeleteCourse && (
                  <button
                    type="button"
                    onClick={handleDeleteCurrentCourse}
                    className="text-rose-600 hover:text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف هذا الكورس</span>
                  </button>
                )}
              </label>
              <select
                value={selectedCourseToUpdateId}
                onChange={(e) => handleSelectCourseToUpdate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                💡 يمكنك تعديل الروابط، النصوص، اسم المعلم، أو استبدال فيديوهات اليوتيوب للدروس بفيديوهات أحدث.
              </p>
            </div>
          )}

          {/* Section 1: Course Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>معلومات الدورة الأساسية</span>
            </h4>

            {/* Course Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                عنوان الدورة التدريبية <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: دورة الذكاء الاصطناعي الشاملة 2026 أو مهارات البرمجة الحديثة"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
              />
            </div>

            {/* Subtitle / Short Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                وصف مختصر أو أهداف الدورة
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="اكتب نبذة سريعة عما سيتعلمه الطالب في هذا المقرر..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
              />
            </div>

            {/* Category, Level, Hours & Instructor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  التصنيف الرئيسي
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المستوى المطلوب
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CourseLevel)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المحاضر / المدرب
                </label>
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder="مثال: د. مازن حمادة"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عدد الساعات المقدرة (بالساعات)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Thumbnail Image Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                صورة غلاف الكورس (Thumbnail)
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="ضع رابط صورة من الإنترنت..."
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
                />
                <img
                  src={thumbnail || SAMPLE_THUMBNAILS[0].url}
                  alt="معاينة"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = SAMPLE_THUMBNAILS[0].url;
                  }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">صور مقترحة:</span>
                {SAMPLE_THUMBNAILS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setThumbnail(sample.url)}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50 text-[11px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Lessons & Video Lectures */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>الدروس ومقاطع الفيديو (YouTube / شرح)</span>
              </h4>
              <button
                type="button"
                onClick={handleAddExtraLesson}
                className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة درس آخر +</span>
              </button>
            </div>

            {/* Lesson 1 (Primary) */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono">1</span>
                  <span>الدرس التمهيدي الأول</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">15 دقيقة</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                  عنوان الدرس
                </label>
                <input
                  type="text"
                  value={firstLessonTitle}
                  onChange={(e) => setFirstLessonTitle(e.target.value)}
                  placeholder="مقدمة الدورة ونظرة شاملة"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                  رابط فيديو YouTube
                </label>
                <input
                  type="url"
                  value={firstLessonVideoUrl}
                  onChange={(e) => setFirstLessonVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                  ملخص الشرح والنقاط الرئيسية
                </label>
                <textarea
                  rows={2}
                  value={firstLessonContent}
                  onChange={(e) => setFirstLessonContent(e.target.value)}
                  placeholder="ملخص محتوى الدرس وما يجب التركيز عليه..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Additional Lessons List */}
            {extraLessons.map((lesson, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">
                      {idx + 2}
                    </span>
                    <span>الدرس رقم {idx + 2}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExtraLesson(idx)}
                    className="text-rose-500 hover:text-rose-600 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                      عنوان الدرس
                    </label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => handleExtraLessonChange(idx, 'title', e.target.value)}
                      placeholder="عنوان الدرس..."
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                      المدة (دقائق)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={lesson.durationMinutes}
                      onChange={(e) => handleExtraLessonChange(idx, 'durationMinutes', Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                    رابط فيديو YouTube للدرس
                  </label>
                  <input
                    type="url"
                    value={lesson.videoUrl}
                    onChange={(e) => handleExtraLessonChange(idx, 'videoUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
            >
              {isOwnerSession ? (
                activeMode === 'create' ? (
                  <>
                    <BookPlus className="w-4 h-4" />
                    <span>حفظ ونشر الكورس للمنصة 🚀</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>حفظ وتطبيق تحديث الكورس 💾</span>
                  </>
                )
              ) : (
                activeMode === 'create' ? (
                  <>
                    <BookPlus className="w-4 h-4" />
                    <span>إرسال الكورس للمسؤول للموافقة 👑</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>إرسال التعديل للمسؤول للاعتماد 👑</span>
                  </>
                )
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
