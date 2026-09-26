import React from 'react';
import { X, GraduationCap, Award, UserPlus, ArrowLeft } from 'lucide-react';

interface AddUserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: () => void;
  onSelectInstructor: () => void;
}

export const AddUserTypeModal: React.FC<AddUserTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  onSelectInstructor,
}) => {
  if (!isOpen) return null;

  const selectStudent = () => {
    onClose();
    onSelectStudent();
  };

  const selectInstructor = () => {
    onClose();
    onSelectInstructor();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-full items-center justify-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-4"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-account-title"
      onMouseDown={onClose}
    >
      <div
        className="my-auto flex max-h-[90vh] w-full max-w-md min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="relative shrink-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 p-5 text-white sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-3.5 top-3.5 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:left-4 sm:top-4"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 pl-10">
            <div className="shrink-0 rounded-xl bg-white/15 p-3">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 id="add-account-title" className="text-lg font-bold sm:text-xl">
                إضافة حساب جديد
              </h2>
              <p className="mt-1 text-xs font-medium text-white/90">
                اختر نوع الحساب الذي ترغب في تسجيله
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <p className="mb-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
            هل أنت طالب أم محاضر؟
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={selectStudent}
              className="group flex flex-col items-center rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-5 text-center transition-all hover:scale-[1.02] hover:bg-emerald-100/70 hover:shadow-md dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/60"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md transition-colors group-hover:bg-emerald-600">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                حساب طالب
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                حضور الكورسات والتعلم وحفظ التقدم
              </p>
              <span className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white transition-colors group-hover:bg-emerald-700">
                سجل كطالب
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              </span>
            </button>

            <button
              type="button"
              onClick={selectInstructor}
              className="group flex flex-col items-center rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-5 text-center transition-all hover:scale-[1.02] hover:bg-amber-100/70 hover:shadow-md dark:border-amber-800/60 dark:bg-amber-950/30 dark:hover:bg-amber-950/60"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md transition-colors group-hover:bg-amber-600">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                حساب محاضر
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                إنشاء وإدارة وتحديث الكورسات للطلاب
              </p>
              <span className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-600 py-2 text-xs font-bold text-white transition-colors group-hover:bg-amber-700">
                سجل كمحاضر
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 block w-full text-center text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserTypeModal;
