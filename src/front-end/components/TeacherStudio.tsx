import React from 'react';
import { Plus, Edit3, Sparkles, UserCheck, Mail, BookOpen } from 'lucide-react';
import { Course } from '../types';

interface TeacherStudioProps {
  instructorName?: string;
  instructorEmail?: string;
  specialty?: string;
  courses?: Course[];
  onAddCourse?: () => void;
  onEditProfile?: () => void;
  onGenerateAiCourse?: () => void;
  onSelectCourse?: (courseId: string) => void;
}

export const TeacherStudio: React.FC<TeacherStudioProps> = ({
  instructorName = 'أستاذ محمد احمد',
  instructorEmail = 'mazenhamada37@gmail.com',
  specialty = 'برمجة وتطوير الويب',
  courses = [],
  onAddCourse,
  onEditProfile,
  onGenerateAiCourse,
  onSelectCourse,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6 font-arabic" dir="rtl">
      {/* هيدر استوديو المحاضر */}
      <div className="bg-gradient-to-r from-[#2e1405] via-[#421d08] to-[#1a0b02] border border-amber-600/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-bold">
              <span>استوديو المحاضر والمدرب</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              مرحباً بك {instructorName} 👨‍🏫
            </h1>
            <p className="text-xs text-amber-200/70">
              أضف أو عدّل دوراتك التدريبية، وسترسل مباشرة للمسؤول لاعتمادها ونشرها للطلاب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onAddCourse}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>إضافة كورس جديد</span>
            </button>

            <button
              onClick={onEditProfile}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/40 text-amber-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>تعديل بيانات المحاضر</span>
            </button>

            <button
              onClick={onGenerateAiCourse}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>توليد دورة بالـ AI</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-amber-500/20 text-xs">
          <div className="bg-black/30 border border-amber-500/20 p-2.5 rounded-xl text-amber-200 flex items-center justify-between">
            <span className="text-amber-400/80">الصفة:</span>
            <span className="font-bold flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" /> مدرب خبير ومستشار رقمي
            </span>
          </div>

          <div className="bg-black/30 border border-amber-500/20 p-2.5 rounded-xl text-amber-200 flex items-center justify-between">
            <span className="text-amber-400/80">البريد:</span>
            <span className="font-bold flex items-center gap-1.5 dir-ltr">
              <Mail className="w-3.5 h-3.5 text-amber-400" /> {instructorEmail}
            </span>
          </div>

          <div className="bg-black/30 border border-amber-500/20 p-2.5 rounded-xl text-amber-200 flex items-center justify-between">
            <span className="text-amber-400/80">التخصص:</span>
            <span className="font-bold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> {specialty}
            </span>
          </div>
        </div>
      </div>

      {/* قسم الدورات المتاحة للمحاضر */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            الدورات التدريبية المتاحة <span className="text-amber-400 text-sm">({courses.length})</span>
          </h2>
          <span className="text-xs text-slate-400">اضغط على أي دورة لتعديل محتواها وإرسال التحديث للمسؤول</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse && onSelectCourse(course.id)}
              className="bg-[#0e1726] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01] space-y-3"
            >
              <div className="flex justify-between items-center text-[11px]">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-md font-bold">
                  {course.category || 'عام'}
                </span>
                <span className="text-slate-400">{course.level || 'مبتدئ'}</span>
              </div>
              <h3 className="font-bold text-white text-sm line-clamp-1">{course.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudio;
