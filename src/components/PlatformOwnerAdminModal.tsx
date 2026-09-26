import React, { useMemo, useState } from 'react';

export interface StudentProfile {
  fullName: string;
  email: string;
  [key: string]: any;
}

export interface InstructorProfile {
  fullName: string;
  email: string;
  [key: string]: any;
}

export interface Course {
  id: string;
  title: string;
  category?: string;
  [key: string]: any;
}

export interface CourseChangeRequest {
  id: string;
  courseTitle?: string;
  instructorName?: string;
  [key: string]: any;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courses?: Course[];
  registeredStudents?: StudentProfile[];
  registeredInstructors?: InstructorProfile[];
  pendingStudents?: StudentProfile[];
  pendingInstructors?: InstructorProfile[];
  pendingCourseRequests?: CourseChangeRequest[];
  onViewStudentDetails?: (student: StudentProfile) => void;
  onViewStudentCertificates?: (student: StudentProfile) => void;
  onApproveStudent?: (email: string) => void;
  onRejectStudent?: (email: string) => void;
  onDeleteStudent?: (email: string) => void;
  onApproveInstructor?: (email: string) => void;
  onRejectInstructor?: (email: string) => void;
  onDeleteInstructor?: (email: string) => void;
  onDeleteCourse?: (id: string) => void;
  onAddCourse?: (course: Course) => void;
  onUpdateCourse?: (course: Course) => void;
  updateAdminConfigInCloud?: (config: { passcode: string }) => Promise<void>;
  getStoredMasterPasscode?: () => string;
}

type Tab = 'students' | 'instructors' | 'courses' | 'requests';
type AuthView = 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-newpass';

// الإيميل الوحيد المسموح له باسترجاع كلمة مرور مالك المنصة
const ALLOWED_RECOVERY_EMAIL = 'mazenhamada37@gmail.com';

const labelFor = (key: string) => {
  const labels: Record<string, string> = {
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    specialty: 'التخصص',
    bio: 'نبذة تعريفية',
    category: 'التصنيف',
    level: 'المستوى',
    title: 'العنوان',
    description: 'الوصف',
    status: 'الحالة',
    createdAt: 'تاريخ التسجيل',
  };
  return labels[key] || key;
};

const safeEntries = (item: Record<string, any>) =>
  Object.entries(item || {}).filter(
    ([key, value]) =>
      !['password', 'id'].includes(key) &&
      value !== undefined &&
      value !== null &&
      value !== '' &&
      typeof value !== 'object'
  );

export const PlatformOwnerAdminModal: React.FC<Props> = ({
  isOpen,
  onClose,
  courses = [],
  registeredStudents = [],
  registeredInstructors = [],
  pendingStudents = [],
  pendingInstructors = [],
  pendingCourseRequests = [],
  onViewStudentDetails,
  onViewStudentCertificates,
  onApproveStudent,
  onRejectStudent,
  onDeleteStudent,
  onApproveInstructor,
  onRejectInstructor,
  onDeleteInstructor,
  onDeleteCourse,
  updateAdminConfigInCloud,
  getStoredMasterPasscode = () => localStorage.getItem('edu_admin_passcode') || '778899',
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot password flow states
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [flowError, setFlowError] = useState('');
  const [flowSuccess, setFlowSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tab, setTab] = useState<Tab>('students');
  const [search, setSearch] = useState('');
  const [details, setDetails] = useState<Record<string, any> | null>(null);

  const q = search.trim().toLowerCase();
  const students = useMemo(
    () => (Array.isArray(registeredStudents) ? registeredStudents : []).filter((x) => `${x.fullName || ''} ${x.email || ''}`.toLowerCase().includes(q)),
    [registeredStudents, q]
  );
  const instructors = useMemo(
    () => (Array.isArray(registeredInstructors) ? registeredInstructors : []).filter((x) => `${x.fullName || ''} ${x.email || ''}`.toLowerCase().includes(q)),
    [registeredInstructors, q]
  );
  const courseList = useMemo(
    () => (Array.isArray(courses) ? courses : []).filter((x) => `${x.title || ''} ${x.category || ''}`.toLowerCase().includes(q)),
    [courses, q]
  );

  if (!isOpen) return null;

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    if (passcode === getStoredMasterPasscode()) {
      setAuthenticated(true);
      setPasscode('');
      setLoginError('');
    } else {
      setLoginError('كلمة المرور غير صحيحة');
    }
  };

  const resetForgotFlowState = () => {
    setRecoveryEmail('');
    setOtpValue('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setFlowError('');
    setFlowSuccess('');
    setIsSubmitting(false);
  };

  const close = () => {
    setDetails(null);
    setAuthenticated(false);
    setPasscode('');
    setLoginError('');
    setAuthView('login');
    resetForgotFlowState();
    onClose();
  };

  const goToLogin = () => {
    setAuthView('login');
    resetForgotFlowState();
  };

  // الخطوة 1: التأكد من الإيميل وإرسال رمز التحقق
  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setFlowError('');
    setFlowSuccess('');

    const cleanEmail = recoveryEmail.trim().toLowerCase();
    if (cleanEmail !== ALLOWED_RECOVERY_EMAIL.toLowerCase()) {
      setFlowError('هذا البريد الإلكتروني غير مصرح له باسترجاع كلمة المرور.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: cleanEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFlowError(data.error || 'حدث خطأ أثناء إرسال رمز التحقق. حاول مرة أخرى.');
        setIsSubmitting(false);
        return;
      }
      setFlowSuccess(data.message || 'تم إرسال رمز التحقق بنجاح!');
      setIsSubmitting(false);
      setAuthView('forgot-otp');
    } catch (err) {
      setFlowError('تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  // الخطوة 2: التحقق من الرمز المرسل
  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setFlowError('');
    setFlowSuccess('');

    if (otpValue.trim().length !== 6) {
      setFlowError('يرجى إدخال رمز التحقق المكوّن من 6 أرقام كاملاً.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFlowError(data.error || 'رمز التحقق غير صحيح.');
        setIsSubmitting(false);
        return;
      }
      setFlowSuccess('');
      setIsSubmitting(false);
      setAuthView('forgot-newpass');
    } catch (err) {
      setFlowError('تعذر الاتصال بالخادم. حاول مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  // إعادة إرسال الرمز
  const handleResendOtp = async () => {
    setFlowError('');
    setFlowSuccess('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: ALLOWED_RECOVERY_EMAIL }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFlowError(data.error || 'تعذر إعادة إرسال الرمز.');
      } else {
        setFlowSuccess('تم إعادة إرسال رمز جديد إلى بريدك.');
      }
    } catch {
      setFlowError('تعذر الاتصال بالخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // الخطوة 3: تعيين كلمة مرور جديدة
  const handleSetNewPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setFlowError('');

    if (newPassword.length < 4) {
      setFlowError('يجب أن تكون كلمة المرور 4 أحرف/أرقام على الأقل.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFlowError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setIsSubmitting(true);
    try {
      localStorage.setItem('edu_admin_passcode', newPassword);
      if (updateAdminConfigInCloud) {
        await updateAdminConfigInCloud({ passcode: newPassword });
      }
      setIsSubmitting(false);
      setFlowSuccess('تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
      setTimeout(() => {
        goToLogin();
      }, 1500);
    } catch (err) {
      setFlowError('حدث خطأ أثناء حفظ كلمة المرور الجديدة.');
      setIsSubmitting(false);
    }
  };

  const openDetails = (item: Record<string, any>, callback?: () => void) => {
    setDetails(item);
    callback?.();
  };

  const action = (event: React.MouseEvent, fn?: () => void) => {
    event.stopPropagation();
    fn?.();
  };

  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" dir="rtl">
        <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl">

          {/* ============ شاشة تسجيل الدخول ============ */}
          {authView === 'login' && (
            <form onSubmit={login}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">دخول مالك المنصة</h2>
                  <p className="mt-1 text-xs text-slate-500">أدخل كلمة المرور للمتابعة</p>
                </div>
                <button type="button" onClick={close} className="rounded-xl px-3 py-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
              </div>

              {loginError && <div className="mb-3 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600">{loginError}</div>}

              <div className="relative mb-3">
                <input
                  autoFocus
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode((v) => !v)}
                  className="absolute left-1 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showPasscode ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPasscode ? '🙈' : '👁️'}
                </button>
              </div>

              <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-black text-white hover:bg-indigo-700">دخول</button>

              <button
                type="button"
                onClick={() => { setAuthView('forgot-email'); setRecoveryEmail(''); setFlowError(''); setFlowSuccess(''); }}
                className="mt-3 w-full text-center text-xs font-bold text-indigo-500 hover:text-indigo-700 hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </form>
          )}

          {/* ============ خطوة 1: إدخال الإيميل ============ */}
          {authView === 'forgot-email' && (
            <form onSubmit={handleSendOtp}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">استرجاع كلمة المرور</h2>
                  <p className="mt-1 text-xs text-slate-500">أدخل البريد الإلكتروني المصرح به لإرسال رمز التحقق</p>
                </div>
                <button type="button" onClick={close} className="rounded-xl px-3 py-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
              </div>

              {flowError && <div className="mb-3 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600">{flowError}</div>}

              <input
                autoFocus
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                dir="ltr"
                className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-left outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال رمز التحقق'}
              </button>

              <button
                type="button"
                onClick={goToLogin}
                className="mt-3 w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 hover:underline"
              >
                الرجوع لتسجيل الدخول
              </button>
            </form>
          )}

          {/* ============ خطوة 2: إدخال رمز التحقق ============ */}
          {authView === 'forgot-otp' && (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">رمز التحقق</h2>
                  <p className="mt-1 text-xs text-slate-500">تم إرسال رمز مكوّن من 6 أرقام إلى بريدك</p>
                </div>
                <button type="button" onClick={close} className="rounded-xl px-3 py-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
              </div>

              {flowSuccess && <div className="mb-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-600">{flowSuccess}</div>}
              {flowError && <div className="mb-3 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600">{flowError}</div>}

              <input
                autoFocus
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="- - - - - -"
                dir="ltr"
                className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSubmitting ? 'جارٍ التحقق...' : 'تحقق من الرمز'}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isSubmitting}
                className="mt-3 w-full text-center text-xs font-bold text-indigo-500 hover:text-indigo-700 hover:underline disabled:opacity-60"
              >
                إعادة إرسال الرمز
              </button>
              <button
                type="button"
                onClick={goToLogin}
                className="mt-2 w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 hover:underline"
              >
                الرجوع لتسجيل الدخول
              </button>
            </form>
          )}

          {/* ============ خطوة 3: كلمة مرور جديدة ============ */}
          {authView === 'forgot-newpass' && (
            <form onSubmit={handleSetNewPassword}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">كلمة مرور جديدة</h2>
                  <p className="mt-1 text-xs text-slate-500">اختر كلمة مرور جديدة لحساب مالك المنصة</p>
                </div>
                <button type="button" onClick={close} className="rounded-xl px-3 py-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
              </div>

              {flowSuccess && <div className="mb-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-600">{flowSuccess}</div>}
              {flowError && <div className="mb-3 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600">{flowError}</div>}

              <div className="relative mb-3">
                <input
                  autoFocus
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="كلمة المرور الجديدة"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute left-1 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <div className="relative mb-3">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="تأكيد كلمة المرور الجديدة"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute left-1 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ كلمة المرور'}
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  const pendingStudentRows = Array.isArray(pendingStudents) ? pendingStudents : [];
  const pendingInstructorRows = Array.isArray(pendingInstructors) ? pendingInstructors : [];
  const requestRows = Array.isArray(pendingCourseRequests) ? pendingCourseRequests : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3" dir="rtl" onClick={close}>
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between bg-gradient-to-l from-indigo-700 to-violet-600 px-5 py-4 text-white">
          <div><h1 className="text-lg font-black">إدارة المنصة</h1><p className="text-xs text-indigo-100">اضغط على أي اسم أو كورس لعرض بياناته</p></div>
          <button type="button" onClick={close} className="rounded-xl bg-white/15 px-3 py-1.5 hover:bg-white/25">✕</button>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 dark:border-slate-800">
          {([['students', 'الطلاب'], ['instructors', 'المحاضرون'], ['courses', 'الكورسات'], ['requests', 'طلبات التعديل']] as [Tab, string][]).map(([value, text]) => (
            <button key={value} type="button" onClick={() => { setTab(value); setSearch(''); }} className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-black ${tab === value ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>{text}</button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-5">
          {tab !== 'requests' && <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tab === 'students' ? 'بحث عن طالب...' : tab === 'instructors' ? 'بحث عن محاضر...' : 'بحث عن كورس...'} className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800" />}

          {tab === 'students' && <section className="space-y-4">
            {pendingStudentRows.length > 0 && <div className="space-y-2"><h3 className="text-sm font-black text-amber-600">طلبات طلاب معلقة ({pendingStudentRows.length})</h3>{pendingStudentRows.map((student, index) => <div key={student.email || index} onClick={() => setDetails(student)} className="flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:bg-amber-950/20"><div><b className="text-sm">{student.fullName || 'بدون اسم'}</b><p className="text-xs text-slate-500">{student.email}</p></div><div className="flex gap-2"><button type="button" onClick={(e) => action(e, () => onApproveStudent?.(student.email))} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white">موافقة</button><button type="button" onClick={(e) => action(e, () => onRejectStudent?.(student.email))} className="rounded-xl bg-rose-100 px-3 py-2 text-xs font-bold text-rose-600">رفض</button></div></div>)}</div>}
            {students.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">لا يوجد طلاب</p> : students.map((student, index) => <div key={student.email || index} onClick={() => openDetails(student, () => onViewStudentDetails?.(student))} className="mb-2 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-indigo-950/30"><div><b className="text-sm text-slate-900 dark:text-white">{student.fullName || 'بدون اسم'}</b><p className="text-xs text-slate-500">{student.email}</p></div><div className="flex gap-1"><button type="button" title="الشهادات" onClick={(e) => action(e, () => onViewStudentCertificates?.(student))} className="rounded-xl px-2 py-1 text-amber-500">🎖️</button><button type="button" title="حذف" onClick={(e) => action(e, () => onDeleteStudent?.(student.email))} className="rounded-xl px-2 py-1 text-rose-500">🗑️</button></div></div>)}
          </section>}

          {tab === 'instructors' && <section className="space-y-4">
            {pendingInstructorRows.length > 0 && <div className="space-y-2"><h3 className="text-sm font-black text-amber-600">طلبات محاضرين معلقة ({pendingInstructorRows.length})</h3>{pendingInstructorRows.map((instructor, index) => <div key={instructor.email || index} onClick={() => setDetails(instructor)} className="flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:bg-amber-950/20"><div><b className="text-sm">{instructor.fullName || 'بدون اسم'}</b><p className="text-xs text-slate-500">{instructor.email}</p></div><div className="flex gap-2"><button type="button" onClick={(e) => action(e, () => onApproveInstructor?.(instructor.email))} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white">موافقة</button><button type="button" onClick={(e) => action(e, () => onRejectInstructor?.(instructor.email))} className="rounded-xl bg-rose-100 px-3 py-2 text-xs font-bold text-rose-600">رفض</button></div></div>)}</div>}
            {instructors.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">لا يوجد محاضرون</p> : instructors.map((instructor, index) => <div key={instructor.email || index} onClick={() => setDetails(instructor)} className="mb-2 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-indigo-950/30"><div><b className="text-sm text-slate-900 dark:text-white">{instructor.fullName || 'بدون اسم'}</b><p className="text-xs text-slate-500">{instructor.email}</p></div><button type="button" title="حذف" onClick={(e) => action(e, () => onDeleteInstructor?.(instructor.email))} className="rounded-xl px-2 py-1 text-rose-500">🗑️</button></div>)}
          </section>}

          {tab === 'courses' && <section>{courseList.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">لا توجد كورسات</p> : courseList.map((course, index) => <div key={course.id || index} onClick={() => setDetails(course)} className="mb-2 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-indigo-950/30"><div><b className="text-sm text-slate-900 dark:text-white">{course.title || 'بدون عنوان'}</b><p className="text-xs text-slate-500">{course.category || 'عام'}</p></div><button type="button" title="حذف" onClick={(e) => action(e, () => onDeleteCourse?.(course.id))} className="rounded-xl px-2 py-1 text-rose-500">🗑️</button></div>)}</section>}

          {tab === 'requests' && <section className="space-y-2">{requestRows.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">لا توجد طلبات تعديل</p> : requestRows.map((request, index) => <div key={request.id || index} onClick={() => setDetails(request)} className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/70"><b className="text-sm text-slate-900 dark:text-white">{request.courseTitle || 'كورس بدون عنوان'}</b><p className="text-xs text-slate-500">{request.instructorName || ''}</p></div>)}</section>}
        </main>
      </div>

      {details && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4" onClick={() => setDetails(null)}><div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black text-slate-900 dark:text-white">البيانات الكاملة</h2><button type="button" onClick={() => setDetails(null)} className="rounded-xl bg-slate-100 px-3 py-1 text-slate-500 dark:bg-slate-800">إغلاق</button></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{safeEntries(details).map(([key, value]) => <div key={key} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><span className="block text-[10px] text-slate-400">{labelFor(key)}</span><span className="mt-1 block break-words text-sm font-bold text-slate-800 dark:text-slate-100">{String(value)}</span></div>)}</div></div></div>}
    </div>
  );
};

export default PlatformOwnerAdminModal;