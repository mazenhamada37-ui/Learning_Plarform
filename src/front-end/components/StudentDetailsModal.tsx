import React, { useState } from 'react';
import { StudentProfile, Course, UserProgress } from '../types';
import { User, Mail, Phone, Globe, Briefcase, Award, BookOpen, CheckCircle, Clock, X } from 'lucide-react';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  courses: Course[];
  userProgressMap: Record<string, UserProgress>;
  initialTab?: 'details' | 'certificates';
  onOpenCertificate: (course: Course) => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  student,
  courses = [],
  userProgressMap = {},
  initialTab = 'details',
  onOpenCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'certificates'>(initialTab);

  if (!isOpen || !student) return null;

  const safeCourses = Array.isArray(courses) ? courses : [];

  const completedCourses = safeCourses.filter((course) => {
    const progress = userProgressMap[course.id];
    return progress && (progress.isCompleted || progress.certificateIssuedAt);
  });

  const enrolledCourses = safeCourses.filter((course) => {
    const progress = userProgressMap[course.id];
    return progress && (progress.completedLessonIds?.length > 0 || progress.isCompleted);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xl border border-blue-500/30">
              {student.fullName ? student.fullName.charAt(0) : 'ط'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.fullName || 'بيانات الطالب'}</h2>
              <p className="text-sm text-slate-400">{student.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            بيانات الطالب الشخصية
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            الشهادات والمؤهلات ({completedCourses.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'details' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-xs text-slate-400 block">البريد الإلكتروني</span>
                    <span className="text-sm font-medium">{student.email || 'غير مدخل'}</span>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <span className="text-xs text-slate-400 block">رقم الهاتف</span>
                    <span className="text-sm font-medium">{student.phone || 'غير مدخل'}</span>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <div>
                    <span className="text-xs text-slate-400 block">الدولة</span>
                    <span className="text-sm font-medium">{student.country || 'غير مدخل'}</span>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-yellow-400" />
                  <div>
                    <span className="text-xs text-slate-400 block">المسمى الوظيفي / الهدف</span>
                    <span className="text-sm font-medium">{student.jobTitleOrGoal || 'طالب'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/40 mt-6">
                <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  ملخص النشاط الأكاديمي
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-800/60 p-3 rounded-lg">
                    <span className="text-2xl font-bold text-blue-400">{enrolledCourses.length}</span>
                    <span className="text-xs text-slate-400 block mt-1">الدورات المشترك بها</span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg">
                    <span className="text-2xl font-bold text-green-400">{completedCourses.length}</span>
                    <span className="text-xs text-slate-400 block mt-1">الدورات المكتملة</span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg">
                    <span className="text-2xl font-bold text-yellow-400">{completedCourses.length}</span>
                    <span className="text-xs text-slate-400 block mt-1">الشهادات المكتسبة</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {completedCourses.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                  <Award className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
                  <p className="text-slate-400 font-medium">لم يحصل هذا الطالب على أي شهادات حتى الآن.</p>
                  <p className="text-xs text-slate-500 mt-1">تظهر الشهادة هنا فور إكمال الكورس واجتياز الاختبار بنجاح.</p>
                </div>
              ) : (
                completedCourses.map((course) => {
                  const progress = userProgressMap[course.id];
                  return (
                    <div
                      key={course.id}
                      className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between hover:border-blue-500/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{course.title}</h4>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            تاريخ الإصدار: {progress?.certificateIssuedAt ? new Date(progress.certificateIssuedAt).toLocaleDateString('ar-EG') : 'غير محدد'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenCertificate(course)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                      >
                        <Award className="w-4 h-4" />
                        عرض الشهادة
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};