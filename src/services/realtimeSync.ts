import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import { db } from '../firebase';
import { Course, CourseChangeRequest, StudentProfile, InstructorProfile, CourseReview } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  console.warn(`[Firestore Realtime ${operationType} at ${path}]:`, errMessage);
}

// Test initial connection as required by Firebase skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'platformMeta', 'connectionTest'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using optimistic cache.');
    }
    return false;
  }
}

/**
 * Real-time subscription to published courses across all devices
 */
export function subscribeToCourses(onUpdate: (courses: Course[]) => void) {
  const coursesCol = collection(db, 'courses');
  return onSnapshot(
    coursesCol,
    (snapshot) => {
      const courses: Course[] = [];
      snapshot.forEach((docSnap) => {
        courses.push(docSnap.data() as Course);
      });
      if (courses.length > 0) {
        onUpdate(courses);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'courses');
    }
  );
}

/**
 * Seed initial courses into Firestore if the collection is currently empty
 */
export async function seedInitialCoursesIfEmpty(initialCourses: Course[]) {
  try {
    const coursesCol = collection(db, 'courses');
    const existing = await getDocs(coursesCol);
    if (existing.empty) {
      console.log('Seeding initial courses to Firebase Firestore...');
      for (const course of initialCourses) {
        await setDoc(doc(db, 'courses', course.id), course);
      }
    } else {
      // Sync any updated or expanded quizzes and lesson video data to Firestore
      for (const initialCourse of initialCourses) {
        if (initialCourse.quiz && initialCourse.quiz.questions.length >= 10) {
          const docRef = doc(db, 'courses', initialCourse.id);
          const docSnap = await getDocFromServer(docRef).catch(() => null);
          if (docSnap && docSnap.exists()) {
            const data = docSnap.data() as Course;
            const needsQuizUpdate = !data.quiz || data.quiz.questions.length < initialCourse.quiz.questions.length;
            const needsModulesUpdate = !data.modules || data.modules.some(m => m.lessons.some(l => !l.downloadUrl));
            if (needsQuizUpdate || needsModulesUpdate) {
              await setDoc(docRef, { ...data, quiz: initialCourse.quiz, modules: initialCourse.modules });
            }
          }
        }
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'courses');
  }
}

/**
 * Save or update a course in real-time
 */
export async function saveCourseToCloud(course: Course): Promise<void> {
  try {
    await setDoc(doc(db, 'courses', course.id), course);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `courses/${course.id}`);
    throw error;
  }
}

/**
 * Delete a course in real-time
 */
export async function deleteCourseFromCloud(courseId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courses', courseId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}`);
    throw error;
  }
}

/**
 * Real-time subscription to Course Requests awaiting Admin approval
 */
export function subscribeToCourseRequests(onUpdate: (requests: CourseChangeRequest[]) => void) {
  const reqCol = collection(db, 'courseRequests');
  return onSnapshot(
    reqCol,
    (snapshot) => {
      const requests: CourseChangeRequest[] = [];
      snapshot.forEach((docSnap) => {
        requests.push(docSnap.data() as CourseChangeRequest);
      });
      onUpdate(requests);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'courseRequests');
    }
  );
}

/**
 * Submit or update a course change request in real-time
 */
export async function submitCourseRequestToCloud(request: CourseChangeRequest): Promise<void> {
  try {
    await setDoc(doc(db, 'courseRequests', request.id), request);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `courseRequests/${request.id}`);
    throw error;
  }
}

/**
 * Delete a course change request in real-time
 */
export async function deleteCourseRequestFromCloud(requestId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courseRequests', requestId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courseRequests/${requestId}`);
    throw error;
  }
}

/**
 * Real-time subscription to registered students
 */
export function subscribeToStudents(onUpdate: (students: StudentProfile[]) => void) {
  const col = collection(db, 'students');
  return onSnapshot(
    col,
    (snapshot) => {
      const students: StudentProfile[] = [];
      snapshot.forEach((docSnap) => {
        students.push(docSnap.data() as StudentProfile);
      });
      onUpdate(students);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'students');
    }
  );
}

/**
 * Save a registered student to Firestore
 */
export async function saveStudentToCloud(student: StudentProfile): Promise<void> {
  try {
    const safeDocId = encodeURIComponent(student.email.toLowerCase());
    await setDoc(doc(db, 'students', safeDocId), student);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'students');
    throw error;
  }
}

/**
 * Delete a student from Firestore
 */
export async function deleteStudentFromCloud(email: string): Promise<void> {
  try {
    const safeDocId = encodeURIComponent(email.toLowerCase());
    await deleteDoc(doc(db, 'students', safeDocId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `students/${email}`);
    throw error;
  }
}

/**
 * Real-time subscription to pending student approval requests
 */
export function subscribeToPendingStudents(onUpdate: (students: StudentProfile[]) => void) {
  const col = collection(db, 'pendingStudents');
  return onSnapshot(
    col,
    (snapshot) => {
      const students: StudentProfile[] = [];
      snapshot.forEach((docSnap) => {
        students.push(docSnap.data() as StudentProfile);
      });
      onUpdate(students);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'pendingStudents');
    }
  );
}

/**
 * Save a pending student registration to Firestore awaiting admin approval
 */
export async function savePendingStudentToCloud(student: StudentProfile): Promise<void> {
  try {
    const safeDocId = encodeURIComponent(student.email.toLowerCase());
    await setDoc(doc(db, 'pendingStudents', safeDocId), { ...student, status: 'pending', isApproved: false });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `pendingStudents/${student.email}`);
    throw error;
  }
}

/**
 * Delete or remove a pending student request from Firestore
 */
export async function deletePendingStudentFromCloud(email: string): Promise<void> {
  try {
    const safeDocId = encodeURIComponent(email.toLowerCase());
    await deleteDoc(doc(db, 'pendingStudents', safeDocId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `pendingStudents/${email}`);
    throw error;
  }
}

/**
 * Real-time subscription to registered instructors
 */
export function subscribeToInstructors(onUpdate: (instructors: InstructorProfile[]) => void) {
  const col = collection(db, 'instructors');
  return onSnapshot(
    col,
    (snapshot) => {
      const instructors: InstructorProfile[] = [];
      snapshot.forEach((docSnap) => {
        instructors.push(docSnap.data() as InstructorProfile);
      });
      onUpdate(instructors);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'instructors');
    }
  );
}

/**
 * Real-time subscription to pending instructor approval requests
 */
export function subscribeToPendingInstructors(onUpdate: (instructors: InstructorProfile[]) => void) {
  const col = collection(db, 'pendingInstructors');
  return onSnapshot(
    col,
    (snapshot) => {
      const instructors: InstructorProfile[] = [];
      snapshot.forEach((docSnap) => {
        instructors.push(docSnap.data() as InstructorProfile);
      });
      onUpdate(instructors);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'pendingInstructors');
    }
  );
}

/**
 * Save a pending instructor registration to Firestore awaiting admin approval
 */
export async function savePendingInstructorToCloud(instructor: InstructorProfile): Promise<void> {
  try {
    const safeDocId = encodeURIComponent(instructor.email.toLowerCase());
    await setDoc(doc(db, 'pendingInstructors', safeDocId), { ...instructor, status: 'pending', isApproved: false });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `pendingInstructors/${instructor.email}`);
    throw error;
  }
}

/**
 * Delete or remove a pending instructor request from Firestore
 */
export async function deletePendingInstructorFromCloud(email: string): Promise<void> {
  try {
    const safeDocId = encodeURIComponent(email.toLowerCase());
    await deleteDoc(doc(db, 'pendingInstructors', safeDocId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `pendingInstructors/${email}`);
    throw error;
  }
}

/**
 * Save a registered instructor to Firestore
 */
export async function saveInstructorToCloud(instructor: InstructorProfile): Promise<void> {
  try {
    const safeDocId = encodeURIComponent(instructor.email.toLowerCase());
    await setDoc(doc(db, 'instructors', safeDocId), { ...instructor, isApproved: true, status: 'approved' });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'instructors');
    throw error;
  }
}

/**
 * Delete an instructor from Firestore
 */
export async function deleteInstructorFromCloud(email: string): Promise<void> {
  try {
    const safeDocId = encodeURIComponent(email.toLowerCase());
    await deleteDoc(doc(db, 'instructors', safeDocId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `instructors/${email}`);
    throw error;
  }
}

/**
 * Real-time subscription to student learning progress (cross-device sync)
 */
export function subscribeToStudentProgress(
  email: string,
  onUpdate: (progressMap: Record<string, any>) => void
) {
  if (!email) return () => {};
  const safeDocId = encodeURIComponent(email.toLowerCase().trim());
  const progressDoc = doc(db, 'studentProgress', safeDocId);
  return onSnapshot(
    progressDoc,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.progressMap) {
          onUpdate(data.progressMap);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `studentProgress/${email}`);
    }
  );
}

/**
 * Save student learning progress to Firestore for instant mobile <-> laptop sync
 */
export async function saveStudentProgressToCloud(
  email: string,
  progressMap: Record<string, any>
): Promise<void> {
  if (!email) return;
  try {
    const safeDocId = encodeURIComponent(email.toLowerCase().trim());
    await setDoc(
      doc(db, 'studentProgress', safeDocId),
      {
        email: email.toLowerCase().trim(),
        progressMap,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `studentProgress/${email}`);
  }
}

/**
 * Real-time subscription to Admin configuration (passcode and recovery email)
 */
export function subscribeToAdminConfig(
  onUpdate: (config: { passcode: string; recoveryEmail: string }) => void
) {
  const metaDoc = doc(db, 'platformMeta', 'adminConfig');
  return onSnapshot(
    metaDoc,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as { passcode?: string; recoveryEmail?: string };
        onUpdate({
          passcode: data.passcode || '1234',
          recoveryEmail: data.recoveryEmail || 'admin.platform@gmail.com',
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'platformMeta/adminConfig');
    }
  );
}

/**
 * Update Admin configuration in Firestore
 */
export async function updateAdminConfigInCloud(config: {
  passcode?: string;
  recoveryEmail?: string;
}): Promise<void> {
  try {
    const metaDoc = doc(db, 'platformMeta', 'adminConfig');
    await setDoc(metaDoc, { ...config, lastUpdated: new Date().toISOString() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'platformMeta/adminConfig');
  }
}

/**
 * Real-time subscription to course reviews
 */
export function subscribeToReviews(onUpdate: (reviews: CourseReview[]) => void) {
  const reviewsCol = collection(db, 'courseReviews');
  return onSnapshot(
    reviewsCol,
    (snapshot) => {
      const reviews: CourseReview[] = [];
      snapshot.forEach((docSnap) => {
        reviews.push(docSnap.data() as CourseReview);
      });
      // Sort newest first
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(reviews);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'courseReviews');
    }
  );
}

/**
 * Seed initial reviews into Firestore if the collection is empty
 */
export async function seedInitialReviewsIfEmpty(initialReviews: CourseReview[]) {
  try {
    const reviewsCol = collection(db, 'courseReviews');
    const existing = await getDocs(reviewsCol);
    if (existing.empty) {
      console.log('Seeding initial reviews to Firebase Firestore...');
      for (const review of initialReviews) {
        await setDoc(doc(db, 'courseReviews', review.id), review);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'courseReviews');
  }
}

/**
 * Save a new course review to cloud and recalculate course average rating
 */
export async function saveReviewToCloud(
  review: CourseReview,
  courseToUpdate?: Course,
  allCourseReviews?: CourseReview[]
): Promise<void> {
  try {
    await setDoc(doc(db, 'courseReviews', review.id), review);

    // If course and reviews list provided, recalculate and update course in cloud
    if (courseToUpdate) {
      const existingReviews = (allCourseReviews || []).filter(r => r.courseId === review.courseId && r.id !== review.id);
      const updatedReviews = [review, ...existingReviews];
      const totalScore = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const newAverage = Math.round((totalScore / updatedReviews.length) * 10) / 10;

      const updatedCourse: Course = {
        ...courseToUpdate,
        rating: newAverage,
        reviewsCount: updatedReviews.length,
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'courses', updatedCourse.id), updatedCourse);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `courseReviews/${review.id}`);
    throw error;
  }
}

/**
 * Delete a review from cloud
 */
export async function deleteReviewFromCloud(reviewId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courseReviews', reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courseReviews/${reviewId}`);
    throw error;
  }
}
