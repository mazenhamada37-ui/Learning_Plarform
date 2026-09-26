import React, { useState, useEffect } from 'react';
import { Course, Role, StudentProfile, InstructorProfile, UserProgress, CourseChangeRequest, CourseReview } from './types';
import { INITIAL_COURSES } from './data/mockCourses';
import { INITIAL_REVIEWS } from './data/mockReviews';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CourseCatalog } from './components/CourseCatalog';
import { CoursePlayer } from './components/CoursePlayer';
import { QuizEngine } from './components/QuizEngine';
import { CertificateModal } from './components/CertificateModal';
import { AITutorDrawer } from './components/AITutorDrawer';
import { AICourseGeneratorModal } from './components/AICourseGeneratorModal';
import { StudentDashboard } from './components/StudentDashboard';
import { InstructorStudio } from './components/InstructorStudio';
import { StudentRegistrationModal } from './components/StudentRegistrationModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { InstructorRegistrationModal } from './components/InstructorRegistrationModal';
import { AddUserTypeModal } from './components/AddUserTypeModal';
import { PlatformOwnerAdminModal } from './components/PlatformOwnerAdminModal';
import { StudentDetailsModal } from './components/StudentDetailsModal';
import { LoginModal } from './components/LoginModal';
import {
  subscribeToCourses,
  subscribeToCourseRequests,
  subscribeToStudents,
  subscribeToInstructors,
  subscribeToReviews,
  subscribeToPendingStudents,
  deletePendingStudentFromCloud,
  subscribeToPendingInstructors,
  deletePendingInstructorFromCloud,
  subscribeToStudentProgress,
  saveStudentProgressToCloud,
  seedInitialCoursesIfEmpty,
  saveCourseToCloud,
  deleteCourseFromCloud,
  saveStudentToCloud,
  deleteStudentFromCloud,
  saveInstructorToCloud,
  deleteInstructorFromCloud,
  saveReviewToCloud,
  testFirestoreConnection
} from './services/realtimeSync';

class SafeErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: error?.toString() || 'Unknown Error' };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("App boundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-white bg-slate-900 min-h-screen flex flex-col items-center justify-center" dir="rtl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">حدث خطأ أثناء عرض الصفحة</h2>
          <p className="text-slate-400 mb-6 font-mono text-sm">{this.state.error}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <SafeErrorBoundary>
      <MainAppContent />
    </SafeErrorBoundary>
  );
}

function MainAppContent() {
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<Role>('student');
  const [activeTab, setActiveTab] = useState<'catalog' | 'dashboard' | 'instructor'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('edu_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return null;
  });

  const [pendingStudentRequests, setPendingStudentRequests] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('edu_pending_students');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });

  const [extraRegisteredStudents, setExtraRegisteredStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('edu_registered_students');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });

  const [pendingInstructorRequests, setPendingInstructorRequests] = useState<InstructorProfile[]>(() => {
    try {
      const saved = localStorage.getItem('edu_pending_instructors');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });

  const [pendingCourseRequests, setPendingCourseRequests] = useState<CourseChangeRequest[]>(() => {
    try {
      const saved = localStorage.getItem('edu_pending_course_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });

  const [extraRegisteredInstructors, setExtraRegisteredInstructors] = useState<InstructorProfile[]>(() => {
    try {
      const saved = localStorage.getItem('edu_registered_instructors');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });

  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile | null>(() => {
    try {
      const saved = localStorage.getItem('edu_instructor_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return null;
  });

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isStudentProfileModalOpen, setIsStudentProfileModalOpen] = useState(false);
  const [isInstructorRegistrationModalOpen, setIsInstructorRegistrationModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingCourseToStart, setPendingCourseToStart] = useState<Course | null>(null);

  // States الخاصة بنافذة تفاصيل الطالب والشهادات
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<StudentProfile | null>(null);
  const [studentDetailsTab, setStudentDetailsTab] = useState<'details' | 'certificates'>('details');
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('edu_dark_mode') === 'true';
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const savedAll = localStorage.getItem('edu_all_courses_v2');
      if (savedAll) {
        const parsed: Course[] = JSON.parse(savedAll);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c) => {
            const initMatch = INITIAL_COURSES.find((ic) => ic.id === c.id);
            if (initMatch) {
              return {
                ...c,
                quiz: initMatch.quiz && (!c.quiz || !c.quiz.questions || c.quiz.questions.length < (initMatch.quiz.questions?.length || 0)) ? initMatch.quiz : (c.quiz || initMatch.quiz),
                modules: c.modules && c.modules.length > 0 ? c.modules : initMatch.modules,
              };
            }
            return c;
          });
        }
      }
      return INITIAL_COURSES;
    } catch (e) { console.error(e); }
    return INITIAL_COURSES;
  });

  const [userProgressMap, setUserProgressMap] = useState<Record<string, UserProgress>>(() => {
    try {
      const saved = localStorage.getItem('edu_user_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return {};
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeQuizCourse, setActiveQuizCourse] = useState<Course | null>(null);
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);

  const [reviews, setReviews] = useState<CourseReview[]>(() => {
    try {
      const saved = localStorage.getItem('edu_course_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('edu_dark_mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('edu_course_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('edu_user_progress', JSON.stringify(userProgressMap));
  }, [userProgressMap]);

  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsCloudSynced(connected);
    });

    seedInitialCoursesIfEmpty(INITIAL_COURSES);

    const unsubCourses = subscribeToCourses((cloudCourses) => {
      if (cloudCourses && Array.isArray(cloudCourses) && cloudCourses.length > 0) {
        setCourses(cloudCourses);
        localStorage.setItem('edu_all_courses_v2', JSON.stringify(cloudCourses));
      }
    });

    const unsubRequests = subscribeToCourseRequests((cloudRequests) => {
      setPendingCourseRequests(cloudRequests || []);
      localStorage.setItem('edu_pending_course_requests', JSON.stringify(cloudRequests || []));
    });

    const unsubStudents = subscribeToStudents((cloudStudents) => {
      setExtraRegisteredStudents(cloudStudents || []);
      localStorage.setItem('edu_registered_students', JSON.stringify(cloudStudents || []));
    });

    const unsubPendingStudents = subscribeToPendingStudents((cloudPending) => {
      setPendingStudentRequests(cloudPending || []);
      localStorage.setItem('edu_pending_students', JSON.stringify(cloudPending || []));
    });

    const unsubInstructors = subscribeToInstructors((cloudInstructors) => {
      setExtraRegisteredInstructors(cloudInstructors || []);
      localStorage.setItem('edu_registered_instructors', JSON.stringify(cloudInstructors || []));
    });

    const unsubPendingInstructors = subscribeToPendingInstructors((cloudPending) => {
      setPendingInstructorRequests(cloudPending || []);
      localStorage.setItem('edu_pending_instructors', JSON.stringify(cloudPending || []));
    });

    const unsubReviews = subscribeToReviews((cloudReviews) => {
      if (cloudReviews && Array.isArray(cloudReviews) && cloudReviews.length > 0) {
        setReviews(cloudReviews);
        localStorage.setItem('edu_course_reviews', JSON.stringify(cloudReviews));
      }
    });

    return () => {
      unsubCourses();
      unsubRequests();
      unsubStudents();
      unsubPendingStudents();
      unsubInstructors();
      unsubPendingInstructors();
      unsubReviews();
    };
  }, []);

  useEffect(() => {
    if (!studentProfile?.email) return;
    const unsubProgress = subscribeToStudentProgress(studentProfile.email, (cloudProgress) => {
      if (cloudProgress && typeof cloudProgress === 'object') {
        setUserProgressMap((prev) => ({
          ...prev,
          ...cloudProgress
        }));
      }
    });
    return () => unsubProgress();
  }, [studentProfile?.email]);

  const handleAddReview = async (newReviewData: Omit<CourseReview, 'id' | 'createdAt'>) => {
    const newReview: CourseReview = {
      ...newReviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    setReviews((prev) => [newReview, ...prev]);
    try {
      await saveReviewToCloud(newReview);
    } catch (err) {
      console.warn('Failed to sync review:', err);
    }
  };

  const handleToggleLessonComplete = (courseId: string, lessonId: string) => {
    setUserProgressMap((prev) => {
      const current = prev[courseId] || {
        courseId,
        completedLessonIds: [],
        quizScores: {},
        isCompleted: false,
        lastStudiedAt: new Date().toISOString()
      };
      const isCompleted = current.completedLessonIds.includes(lessonId);
      const updatedLessonIds = isCompleted
        ? current.completedLessonIds.filter((id) => id !== lessonId)
        : [...current.completedLessonIds, lessonId];

      const targetCourse = courses.find((c) => c.id === courseId);
      const totalLessonsCount = targetCourse?.modules
        ? targetCourse.modules.reduce((acc, m) => acc + (m.lessons ? m.lessons.length : 0), 0)
        : 0;
      const courseFullyDone = updatedLessonIds.length === totalLessonsCount && totalLessonsCount > 0;

      const updatedProgressMap = {
        ...prev,
        [courseId]: {
          ...current,
          completedLessonIds: updatedLessonIds,
          isCompleted: courseFullyDone,
          lastStudiedAt: new Date().toISOString()
        }
      };

      if (studentProfile?.email) {
        saveStudentProgressToCloud(studentProfile.email, updatedProgressMap).catch(console.warn);
      }
      return updatedProgressMap;
    });
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev.filter((c) => c.id !== newCourse.id)]);
    saveCourseToCloud(newCourse).catch(console.warn);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    if (selectedCourse?.id === updatedCourse.id) {
      setSelectedCourse(updatedCourse);
    }
    saveCourseToCloud(updatedCourse).catch(console.warn);
  };

  const handleFinishQuiz = (courseId: string, scorePercent: number) => {
    setUserProgressMap((prev) => {
      const current = prev[courseId] || {
        courseId,
        completedLessonIds: [],
        quizScores: {},
        isCompleted: false,
        lastStudiedAt: new Date().toISOString()
      };
      const isPassed = scorePercent >= 70;
      const updatedProgressMap = {
        ...prev,
        [courseId]: {
          ...current,
          quizScores: { ...current.quizScores, [courseId]: scorePercent },
          isCompleted: isPassed ? true : current.isCompleted,
          certificateIssuedAt: isPassed ? new Date().toISOString() : current.certificateIssuedAt
        }
      };
      if (studentProfile?.email) {
        saveStudentProgressToCloud(studentProfile.email, updatedProgressMap).catch(console.warn);
      }
      return updatedProgressMap;
    });
  };

  const handleSaveProfile = (profile: StudentProfile) => {
    const approvedProfile: StudentProfile = {
      ...profile,
      status: 'approved',
      isApproved: true
    };
    setStudentProfile(approvedProfile);
    localStorage.setItem('edu_student_profile', JSON.stringify(approvedProfile));
    saveStudentToCloud(approvedProfile).catch(console.warn);

    setIsRegistrationModalOpen(false);
    setSelectedCourse(null);
    setActiveTab('catalog');

    if (pendingCourseToStart) {
      setSelectedCourse(pendingCourseToStart);
      setPendingCourseToStart(null);
    }

    return { isPending: false };
  };

  // تسجيل دخول الطالب اللي عنده حساب موجود بالفعل (إيميل + باسورد)
  const handleLoginSuccess = (student: StudentProfile) => {
    const approvedProfile: StudentProfile = {
      ...student,
      status: 'approved',
      isApproved: true
    };
    setStudentProfile(approvedProfile);
    localStorage.setItem('edu_student_profile', JSON.stringify(approvedProfile));
    setIsLoginModalOpen(false);
    setActiveTab('catalog');

    if (pendingCourseToStart) {
      setSelectedCourse(pendingCourseToStart);
      setPendingCourseToStart(null);
    }
  };

  const handleLogoutStudent = () => {
    setStudentProfile(null);
    localStorage.removeItem('edu_student_profile');
    setActiveTab('catalog');
    setSelectedCourse(null);
  };

  const handleSaveInstructorProfile = (profile: InstructorProfile) => {
    const approvedProfile: InstructorProfile = {
      ...profile,
      status: 'approved',
      isApproved: true
    };
    setInstructorProfile(approvedProfile);
    localStorage.setItem('edu_instructor_profile', JSON.stringify(approvedProfile));
    saveInstructorToCloud(approvedProfile).catch(console.warn);
    return { isPending: false };
  };

  const safeStudentProfile: StudentProfile = studentProfile || {
    fullName: 'طالب جديد',
    email: 'student@example.com',
    phone: '',
    country: 'مصر',
    jobTitleOrGoal: 'طالب'
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-arabic" dir="rtl">
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedCourse(null);
          setActiveTab(tab);
        }}
        onOpenAiTutor={() => setIsAiTutorOpen(true)}
        onOpenStudentProfile={() => setIsStudentProfileModalOpen(true)}
        onOpenAddAccount={() => setIsAddUserModalOpen(true)}
        onOpenCatalog={() => {
          setSelectedCourse(null);
          setActiveTab('catalog');
        }}
        onOpenDashboard={() => {
          setSelectedCourse(null);
          setActiveTab('dashboard');
        }}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        courses={courses}
        onSelectCourse={(course) => {
          setActiveTab('catalog');
          setSelectedCourse(course);
        }}
        studentProfile={studentProfile}
        instructorProfile={instructorProfile}
        onOpenRegistrationModal={() => setIsRegistrationModalOpen(true)}
        onOpenInstructorRegistrationModal={() => setIsInstructorRegistrationModalOpen(true)}
        onOpenAddUserModal={() => setIsAddUserModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isCloudSynced={isCloudSynced}
      />

      <main className="w-full pb-16">
        {selectedCourse ? (
          <CoursePlayer
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            userProgress={userProgressMap[selectedCourse.id] || {
              courseId: selectedCourse.id,
              completedLessonIds: [],
              quizScores: {},
              isCompleted: false,
              lastStudiedAt: new Date().toISOString()
            }}
            onToggleLessonComplete={handleToggleLessonComplete}
            onOpenQuiz={(course) => setActiveQuizCourse(course)}
            onOpenCertificate={(course) => setCertificateCourse(course)}
          />
        ) : activeTab === 'dashboard' ? (
          <StudentDashboard
            courses={courses}
            userProgressMap={userProgressMap}
            studentProfile={safeStudentProfile}
            onSelectCourse={(course) => setSelectedCourse(course)}
            onOpenCertificate={(course) => setCertificateCourse(course)}
          />
        ) : activeTab === 'instructor' ? (
          <InstructorStudio
            courses={courses}
            instructorProfile={instructorProfile}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={(id) => {
              setCourses(prev => prev.filter(c => c.id !== id));
              deleteCourseFromCloud(id).catch(console.warn);
            }}
            onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
          />
        ) : (
          <>
            <HeroBanner
              onExplore={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAiTutor={() => setIsAiTutorOpen(true)}
            />
            <div id="catalog-section">
              <CourseCatalog
                courses={courses}
                onSelectCourse={(course) => {
                  if (!studentProfile) {
                    setPendingCourseToStart(course);
                    setIsRegistrationModalOpen(true);
                  } else {
                    setSelectedCourse(course);
                  }
                }}
                searchQuery={searchQuery}
                userProgressMap={userProgressMap}
                reviews={reviews}
                onAddReview={handleAddReview}
              />
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      {isRegistrationModalOpen && (
        <StudentRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => {
            setIsRegistrationModalOpen(false);
            setPendingCourseToStart(null);
          }}
          studentProfile={studentProfile}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogoutStudent}
        />
      )}

      {isInstructorRegistrationModalOpen && (
        <InstructorRegistrationModal
          isOpen={isInstructorRegistrationModalOpen}
          onClose={() => setIsInstructorRegistrationModalOpen(false)}
          onSave={handleSaveInstructorProfile}
        />
      )}

      {isStudentProfileModalOpen && (
        <StudentProfileModal
          isOpen={isStudentProfileModalOpen}
          onClose={() => setIsStudentProfileModalOpen(false)}
          studentProfile={safeStudentProfile}
          onLogout={handleLogoutStudent}
        />
      )}

      {isAddUserModalOpen && (
        <AddUserTypeModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onSelectStudent={() => setIsRegistrationModalOpen(true)}
          onSelectInstructor={() => setIsInstructorRegistrationModalOpen(true)}
        />
      )}

      {/* نافذة تسجيل الدخول لحساب موجود بالفعل (إيميل + باسورد) - منفصلة تمامًا عن إضافة حساب */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          registeredStudents={extraRegisteredStudents || []}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {isAdminModalOpen && (
        <PlatformOwnerAdminModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          courses={courses || []}
          registeredStudents={extraRegisteredStudents || []}
          registeredInstructors={extraRegisteredInstructors || []}
          pendingStudents={pendingStudentRequests || []}
          pendingInstructors={pendingInstructorRequests || []}
          pendingCourseRequests={pendingCourseRequests || []}
          onViewStudentDetails={(student) => {
            setSelectedStudentForDetails(student);
            setStudentDetailsTab('details');
            setIsStudentDetailsOpen(true);
          }}
          onViewStudentCertificates={(student) => {
            setSelectedStudentForDetails(student);
            setStudentDetailsTab('certificates');
            setIsStudentDetailsOpen(true);
          }}
          onApproveStudent={(email) => {
            const target = pendingStudentRequests.find(p => p.email.toLowerCase() === email.toLowerCase());
            if (target) {
              saveStudentToCloud(target);
              deletePendingStudentFromCloud(email);
            }
          }}
          onRejectStudent={deletePendingStudentFromCloud}
          onDeleteStudent={(email) => {
            setExtraRegisteredStudents(prev => prev.filter(s => s.email.toLowerCase() !== email.toLowerCase()));
            deleteStudentFromCloud(email);
          }}
          onApproveInstructor={(email) => {
            const target = pendingInstructorRequests.find(p => p.email.toLowerCase() === email.toLowerCase());
            if (target) {
              saveInstructorToCloud(target);
              deletePendingInstructorFromCloud(email);
            }
          }}
          onRejectInstructor={deletePendingInstructorFromCloud}
          onDeleteInstructor={(email) => {
            setExtraRegisteredInstructors(prev => prev.filter(i => i.email.toLowerCase() !== email.toLowerCase()));
            deleteInstructorFromCloud(email);
          }}
          onAddCourse={handleAddCourse}
          onUpdateCourse={handleUpdateCourse}
          onDeleteCourse={(id) => {
            setCourses(prev => prev.filter(c => c.id !== id));
            deleteCourseFromCloud(id);
          }}
        />
      )}

      {/* النافذة الخاصة بتفاصيل الطالب والشهادات */}
      <StudentDetailsModal
        isOpen={isStudentDetailsOpen}
        onClose={() => setIsStudentDetailsOpen(false)}
        student={selectedStudentForDetails}
        courses={courses || []}
        userProgressMap={userProgressMap || {}}
        initialTab={studentDetailsTab}
        onOpenCertificate={(course) => {
          setIsStudentDetailsOpen(false);
          setCertificateCourse(course);
        }}
      />

      {activeQuizCourse && activeQuizCourse.quiz && (
        <QuizEngine
          quiz={activeQuizCourse.quiz}
          courseTitle={activeQuizCourse.title}
          onClose={() => setActiveQuizCourse(null)}
          onFinish={(score) => handleFinishQuiz(activeQuizCourse.id, score)}
        />
      )}

      {certificateCourse && (
        <CertificateModal
          isOpen={Boolean(certificateCourse)}
          onClose={() => setCertificateCourse(null)}
          studentName={selectedStudentForDetails?.fullName || studentProfile?.fullName || 'طالب'}
          courseTitle={certificateCourse.title}
          completionDate={userProgressMap[certificateCourse.id]?.certificateIssuedAt || new Date().toISOString()}
          instructorName={certificateCourse.instructor?.name || 'المحاضر'}
        />
      )}

      {isAiTutorOpen && (
        <AITutorDrawer
          isOpen={isAiTutorOpen}
          onClose={() => setIsAiTutorOpen(false)}
          courses={courses}
          studentProfile={studentProfile}
          onSelectCourse={(courseId: string) => {
            const course = courses.find((c) => c.id === courseId);
            if (course) {
              setSelectedCourse(course);
              setIsAiTutorOpen(false);
            }
          }}
        />
      )}

      {isAiGeneratorOpen && (
        <AICourseGeneratorModal
          isOpen={isAiGeneratorOpen}
          onClose={() => setIsAiGeneratorOpen(false)}
          onCourseGenerated={(newCourse) => {
            handleAddCourse(newCourse);
            setIsAiGeneratorOpen(false);
          }}
        />
      )}
    </div>
  );
}