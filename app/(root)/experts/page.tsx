import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const experts = [
  {
    id: 1,
    name: "Smit Pathak",
    role: "Senior Software Engineer at Google",
    experience: "10+ years in Full Stack Development",
    expertise: ["System Design", "Cloud Architecture", "Technical Leadership"],
    image: "/experts/sarah.jpg",
    rate: "$150/hour"
  },
  {
    id: 2,
    name: "James joseph",
    role: "Technical Lead at Microsoft",
    experience: "12+ years in Software Development",
    expertise: ["Backend Development", "Database Design", "API Architecture"],
    image: "/experts/michael.jpg",
    rate: "$140/hour"
  },
  {
    id: 3,
    name: "Jeet Patel",
    role: "Senior Frontend Developer at Meta",
    experience: "8+ years in Frontend Development",
    expertise: ["React", "TypeScript", "UI/UX Design"],
    image: "/experts/priya.jpg",
    rate: "$130/hour"
  },
  {
    id: 4,
    name: "James Williamson",
    role: "DevOps Engineer at Amazon",
    experience: "9+ years in DevOps",
    expertise: ["AWS", "Kubernetes", "CI/CD"],
    image: "/experts/james.jpg",
    rate: "$145/hour"
  },
  {
    id: 5,
    name: "Swayam Kalburgi",
    role: "Data Science Lead at Netflix",
    experience: "11+ years in Data Science",
    expertise: ["Machine Learning", "Big Data", "Python"],
    image: "/experts/emma.jpg",
    rate: "$160/hour"
  }
];

export default function ExpertsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-white">Connect with Industry Experts</h1>
        <p className="text-white/80 text-lg">
          Book 1-on-1 sessions with experienced professionals to get personalized guidance for your career.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {experts.map((expert) => (
            <div
              key={expert.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {expert.name[0]}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{expert.name}</h3>
                  <p className="text-white/60 text-sm">{expert.role}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-white/80 text-sm">{expert.experience}</p>
                <div className="flex flex-wrap gap-2">
                  {expert.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-white font-semibold">{expert.rate}</p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Book an Interview
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 