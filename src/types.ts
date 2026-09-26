export type Role = 'student' | 'instructor' | 'admin';

export type CategoryType = 
  | 'الكل'
  | 'برمجة وتطوير'
  | 'الذكاء الاصطناعي'
  | 'تصميم واجهات UI/UX'
  | 'علوم البيانات'
  | 'إدارة الأعمال والقيادة'
  | 'اللغات والتواصل';

export type CourseLevel = 'مبتدئ' | 'متوسط' | 'عالمي' | 'جميع المستويات';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
  passingScorePercent?: number;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  contentType: 'video' | 'text' | 'interactive';
  videoUrl?: string;
  directVideoUrl?: string;
  downloadUrl?: string;
  videoFileSize?: string;
  contentMarkdown: string;
  keyTakeaways?: string[];
  resources?: { name: string; url: string; type: string }[];
  completed?: boolean;
  quiz?: Quiz;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  rating: number;
  studentsCount: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: CategoryType;
  level: CourseLevel;
  thumbnail: string;
  instructor: Instructor;
  rating: number;
  reviewsCount: number;
  studentsEnrolledCount: number;
  estimatedHours: number;
  isAiGenerated?: boolean;
  tags: string[];
  prerequisites?: string[];
  learningObjectives: string[];
  modules: Module[];
  quiz?: Quiz;
  price?: 'مجاني' | 'ممتاز';
  updatedAt?: string;
}

export interface CourseChangeRequest {
  id: string;
  type: 'create' | 'update' | 'delete';
  courseId: string;
  courseTitle: string;
  instructorName: string;
  instructorEmail?: string;
  requestedAt: string;
  courseData: Course;
  changeNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface StudentProfile {
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  jobTitleOrGoal?: string;
  registeredAt: string;
  status?: 'pending' | 'approved' | 'rejected';
  isApproved?: boolean;
}

export interface InstructorProfile {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  registeredAt: string;
  status?: 'pending' | 'approved' | 'rejected';
  isApproved?: boolean;
}

export interface UserProgress {
  courseId: string;
  completedLessonIds: string[];
  quizScores: Record<string, number>; // quizId/courseId -> percent score
  isCompleted: boolean;
  certificateIssuedAt?: string;
  lastStudiedAt: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  courseTitle: string;
  courseId: string;
  issueDate: string;
  instructorName: string;
  gradeScore: number;
  certificateCode: string;
}

export interface StudentNote {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentName: string;
  studentEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  lessonId?: string;
  lessonTitle?: string;
  createdAt: string; // ISO format string
}
