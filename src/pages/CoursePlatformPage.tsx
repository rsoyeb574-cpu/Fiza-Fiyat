import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  PlayCircle,
  FileText,
  HelpCircle,
  Award,
  CheckCircle,
  Clock,
  BookOpen,
  PlusCircle,
  X,
  Sparkles,
  Lock
} from 'lucide-react';
import { Course, CourseLesson, StudentCourseProgress } from '../types/marketplace';
import {
  getCourses,
  saveCourse,
  getStudentCourseProgress,
  saveStudentCourseProgress
} from '../services/marketplaceDb';

export const CoursePlatformPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentCourseProgress | null>(null);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [qIndex: number]: number }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Creator Modal
  const [showPublisherModal, setShowPublisherModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Architecture & BIM');
  const [newCoursePrice, setNewCoursePrice] = useState(99);
  const [newCourseDescription, setNewCourseDescription] = useState('');

  useEffect(() => {
    loadCoursesData();
  }, []);

  const loadCoursesData = async () => {
    setLoading(true);
    const list = await getCourses();
    setCourses(list);
    setLoading(false);
  };

  const handleSelectCourse = async (course: Course) => {
    setActiveCourse(course);
    setActiveLesson(course.lessons[0] || null);

    const prog = await getStudentCourseProgress('user-current', course.id);
    if (prog) {
      setStudentProgress(prog);
    } else {
      const initialProg: StudentCourseProgress = {
        id: `prog-${Date.now()}`,
        studentUserId: 'user-current',
        courseId: course.id,
        courseTitle: course.title,
        completedLessonIds: [],
        quizScores: {},
        isCompleted: false,
        updatedAt: new Date().toISOString()
      };
      setStudentProgress(initialProg);
      saveStudentCourseProgress(initialProg);
    }
  };

  const handleMarkLessonComplete = async (lessonId: string) => {
    if (!studentProgress || !activeCourse) return;
    if (!studentProgress.completedLessonIds.includes(lessonId)) {
      const updatedIds = [...studentProgress.completedLessonIds, lessonId];
      const isAllDone = updatedIds.length === activeCourse.lessons.length;
      const newProg: StudentCourseProgress = {
        ...studentProgress,
        completedLessonIds: updatedIds,
        isCompleted: isAllDone,
        certificateUrl: isAllDone ? `#certificate-${activeCourse.id}` : undefined,
        completedAt: isAllDone ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString()
      };
      setStudentProgress(newProg);
      await saveStudentCourseProgress(newProg);
    }
  };

  const handleQuizSubmit = () => {
    if (!activeLesson || !activeLesson.quizQuestions) return;
    let correctCount = 0;
    activeLesson.quizQuestions.forEach((q, idx) => {
      if (selectedQuizAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });
    const scorePct = Math.round((correctCount / activeLesson.quizQuestions.length) * 100);
    setQuizScore(scorePct);
    handleMarkLessonComplete(activeLesson.id);
  };

  const handlePublishNewCourse = async () => {
    if (!newCourseTitle.trim()) return;

    await saveCourse({
      title: newCourseTitle,
      category: newCourseCategory,
      price: newCoursePrice,
      description: newCourseDescription,
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      creatorId: 'user-archviz',
      creatorName: 'ArchStudio Pro',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      lessons: [
        {
          id: 'les-demo-1',
          title: 'Module 1: Introduction & Project Setup',
          duration: '15 mins',
          type: 'video',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        {
          id: 'les-demo-2',
          title: 'Module 2: Practical Design & Calculations',
          duration: '30 mins',
          type: 'video',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        {
          id: 'les-demo-3',
          title: 'Final Knowledge Assessment',
          duration: '10 mins',
          type: 'quiz',
          quizQuestions: [
            {
              question: 'Which software is primary for BIM working drawing outputs?',
              options: ['Autodesk Revit', 'Photoshop', 'Notepad', 'Paint'],
              correctIndex: 0
            }
          ]
        }
      ]
    });

    setShowPublisherModal(false);
    setNewCourseTitle('');
    await loadCoursesData();
    alert('Course published to the academy marketplace!');
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-neutral-900 to-indigo-950/80 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Professional Academy & Certification Platform
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">BIM, Revit & Construction Masterclasses</h1>
            <p className="text-xs text-neutral-400 mt-1">Enroll in verified courses, view PDF lecture notes, complete quizzes, and claim completion certificates.</p>
          </div>

          <button
            onClick={() => setShowPublisherModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            Publish a Course (Creator Studio)
          </button>
        </div>

        {/* Active Course Classroom View */}
        {activeCourse ? (
          <div className="space-y-6">
            <button
              onClick={() => setActiveCourse(null)}
              className="text-xs text-blue-400 font-bold hover:underline mb-2"
            >
              ← Back to Course Catalog
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Player / Content Area */}
              <div className="lg:col-span-2 bg-neutral-900 border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-400">{activeCourse.category}</span>
                    <h2 className="text-xl font-bold text-white">{activeLesson?.title}</h2>
                  </div>
                  {activeLesson && studentProgress?.completedLessonIds.includes(activeLesson.id) && (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-full text-xs">
                      Completed ✓
                    </span>
                  )}
                </div>

                {/* Lesson Video */}
                {activeLesson?.type === 'video' && (
                  <div className="rounded-2xl overflow-hidden bg-black border border-white/10">
                    <video src={activeLesson.videoUrl} controls className="w-full max-h-[420px] object-cover" />
                  </div>
                )}

                {/* PDF Notes */}
                {activeLesson?.type === 'pdf_notes' && (
                  <div className="bg-neutral-950 p-8 rounded-2xl border border-white/10 text-center space-y-4">
                    <FileText className="w-12 h-12 text-blue-400 mx-auto" />
                    <h3 className="text-base font-bold text-white">Lecture PDF Handbook & Notes</h3>
                    <p className="text-xs text-neutral-400">Download lecture slides, structural code standards, and BIM workflow guide.</p>
                    <button
                      onClick={() => activeLesson && handleMarkLessonComplete(activeLesson.id)}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Mark Handbook Read & Complete
                    </button>
                  </div>
                )}

                {/* Quiz Module */}
                {activeLesson?.type === 'quiz' && activeLesson.quizQuestions && (
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-white/10 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-400" /> Knowledge Check Quiz
                    </h3>

                    {(activeLesson.quizQuestions || []).map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2 border-t border-white/5 pt-3">
                        <p className="text-xs font-bold text-neutral-200">{qIdx + 1}. {q.question}</p>
                        <div className="space-y-1 pl-2">
                          {(q.options || []).map((opt, optIdx) => (
                            <label key={optIdx} className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                              <input
                                type="radio"
                                name={`q_${qIdx}`}
                                checked={selectedQuizAnswers[qIdx] === optIdx}
                                onChange={() => setSelectedQuizAnswers({ ...selectedQuizAnswers, [qIdx]: optIdx })}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleQuizSubmit}
                      className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer"
                    >
                      Submit Quiz
                    </button>

                    {quizScore !== null && (
                      <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-bold">
                        Quiz Score: {quizScore}% — Lesson marked completed!
                      </div>
                    )}
                  </div>
                )}

                {/* Completion Certificate Section */}
                {studentProgress?.isCompleted && (
                  <div className="p-6 bg-gradient-to-r from-amber-500/20 via-neutral-900 to-amber-500/20 border border-amber-500/40 rounded-2xl text-center space-y-3">
                    <Award className="w-12 h-12 text-amber-400 mx-auto" />
                    <h3 className="text-lg font-bold text-white">Course Completion Certificate Awarded!</h3>
                    <p className="text-xs text-amber-200">Congratulations! You have finished all lessons in "{activeCourse.title}".</p>
                    <button
                      onClick={() => alert(`Official Verified Certificate issued to Alex Mercer for ${activeCourse.title}`)}
                      className="px-6 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/30 cursor-pointer"
                    >
                      Download Completion Certificate (PDF)
                    </button>
                  </div>
                )}
              </div>

              {/* Course Syllabus / Modules Sidebar */}
              <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Course Syllabus</h3>
                
                <div className="space-y-2">
                  {(activeCourse?.lessons || []).map((les, idx) => {
                    const isDone = (studentProgress?.completedLessonIds || []).includes(les.id);
                    const isSelected = activeLesson?.id === les.id;

                    return (
                      <div
                        key={les.id}
                        onClick={() => setActiveLesson(les)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                            : 'bg-neutral-950 border-white/5 text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold block">{idx + 1}. {les.title}</span>
                          <span className="text-[10px] text-neutral-400">{les.duration} • {les.type.toUpperCase()}</span>
                        </div>
                        {isDone && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Course Catalog Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((crs) => (
              <div
                key={crs.id}
                onClick={() => handleSelectCourse(crs)}
                className="group bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <img src={crs.coverImage} alt={crs.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-6 space-y-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                      {crs.category}
                    </span>
                    <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-2">{crs.title}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">{crs.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between text-xs mt-4">
                  <span className="text-neutral-400">{crs.lessons.length} Modules</span>
                  <span className="text-base font-extrabold text-emerald-400">${crs.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publisher Modal */}
      {showPublisherModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setShowPublisherModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Publish Academy Course</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Masterclass: Parametric Revit Structural BIM"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Price ($)</label>
                <input
                  type="number"
                  value={newCoursePrice}
                  onChange={(e) => setNewCoursePrice(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Course Overview</label>
                <textarea
                  rows={3}
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <button
                onClick={handlePublishNewCourse}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl cursor-pointer"
              >
                Publish Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
