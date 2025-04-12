import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const courses = [
  {
    id: 1,
    title: "Data Structures & Algorithms Mastery",
    description: "Master fundamental DSA concepts and problem-solving techniques",
    duration: "8 weeks",
    level: "Intermediate"
  },
  {
    id: 2,
    title: "System Design Fundamentals",
    description: "Learn to design scalable systems and architecture patterns",
    duration: "6 weeks",
    level: "Advanced"
  },
  {
    id: 3,
    title: "Behavioral Interview Preparation",
    description: "Prepare for common behavioral questions and STAR method",
    duration: "4 weeks",
    level: "Beginner"
  },
  {
    id: 4,
    title: "Frontend Development Interview",
    description: "Master React, JavaScript, and frontend concepts",
    duration: "6 weeks",
    level: "Intermediate"
  }
];

export default function CoursesPage() {
  return (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold text-white mb-2">Interview Preparation Courses</h1>
    <p className="text-white/70 mb-6">Master your interview skills with our specialized training programs</p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-4px]"
        >
          {/* Course Badge */}
          <div className="h-2 bg-blue-600"></div>
          
          <div className="p-6">
            {/* Course Header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">{course.title}</h2>
              <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full">{course.level}</span>
            </div>
            
            {/* Course Description */}
            <p className="text-white/70 text-sm mb-6">{course.description}</p>
            
            {/* Course Details */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-white/60 text-xs">
                <div className="w-4 h-4 mr-1 rounded-full bg-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span>Duration: {course.duration}</span>
              </div>
              
              <div className="flex items-center text-white/60 text-xs">
                <div className="w-4 h-4 mr-1 rounded-full bg-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span>{course.modules || "6"} Modules</span>
              </div>
            </div>
            
            {/* Action Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors">
              {course.enrolled ? "Continue Learning" : "Enroll Now"}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
  
} 