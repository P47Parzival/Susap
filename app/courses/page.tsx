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
      <h1 className="text-3xl font-semibold text-white mb-8">
        Interview Preparation Courses
      </h1>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl text-white shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
            <p className="text-sm text-white/70 mb-4">{course.description}</p>
  
            <div className="flex justify-between items-center text-white/50 text-xs mb-6">
              <span>Duration: {course.duration}</span>
              <span>Level: {course.level}</span>
            </div>
  
            <Button className="btn-primary w-full">Enroll Now</Button>
          </Card>
        ))}
      </div>
    </div>
  );
  
} 