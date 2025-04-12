import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      {/* CTA Section */}
      <section className="card-cta flex flex-col lg:flex-row items-center justify-between gap-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
        {/* One to one interview */}
        <div>
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
              Master Technical interview skills with <span className="animate-pulse">Susap</span>
            </h2>
            <p className="text-white/80 text-lg">
              Practice real interview questions & get instant feedback.
            </p>

            <div className="flex gap-4 max-sm:flex-col max-sm:w-full mt-2">
              <Button asChild className="btn-primary">
                <Link href="/interview">Start an Interview</Link>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 hover:bg-white/20">
                <Link href="/chat">Chat with AI</Link>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 hover:bg-white/20">
                <Link href="/courses">Interview Courses</Link>
              </Button>
            </div>
          </div>

          {/* Group discussion */}
          <div className="flex flex-col gap-4 max-w-lg mt-4">
            <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
              Master Group Discussions with agentic <span className="animate-pulse">Susap</span>
            </h2>
            <p className="text-white/80 text-lg">
              Practice real Group Discussions & get instant feedback.
            </p>

            <div className="flex gap-4 max-sm:flex-col max-sm:w-full mt-2">
              <Button asChild className="btn-primary">
                <Link href="/interview">Start a Group Discussion</Link>
              </Button>
            </div>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="AI Robot"
          width={400}
          height={400}
          className="hidden lg:block drop-shadow-xl"
        />
      </section>

      {/* Past Interviews */}
      <section className="flex flex-col gap-6 mt-12">
        <h2 className="text-white text-xl font-semibold">Your Interviews</h2>

        <div className="interviews-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p className="text-white/60">You haven&apos;t taken any interviews yet.</p>
          )}
        </div>
      </section>

      {/* Available Interviews */}
      <section className="flex flex-col gap-6 mt-12">
        <h2 className="text-white text-xl font-semibold">Take Interviews</h2>

        <div className="interviews-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p className="text-white/60">There are no interviews available.</p>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mt-16 overflow-hidden">
        <h2 className="text-white text-xl font-semibold mb-8">Success Stories</h2>
        <div className="testimonials-container relative">
          <div className="testimonials-track flex gap-6 animate-scroll">
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer at Google",
                image: "/testimonials/sarah.jpg",
                text: "This platform helped me crack my Google interview. The AI feedback was incredibly detailed!"
              },
              {
                name: "Michael Rodriguez",
                role: "Full Stack Developer at Meta",
                image: "/testimonials/michael.jpg",
                text: "The practice interviews were spot-on. Landed my dream job thanks to this platform."
              },
              {
                name: "Priya Patel",
                role: "Frontend Developer at Amazon",
                image: "/testimonials/priya.jpg",
                text: "The AI chat feature helped me understand complex concepts easily. Highly recommended!"
              },
              {
                name: "James Wilson",
                role: "Backend Engineer at Microsoft",
                image: "/testimonials/james.jpg",
                text: "The course content is excellent. It covers everything you need for technical interviews."
              },
              {
                name: "Emma Thompson",
                role: "DevOps Engineer at Netflix",
                image: "/testimonials/emma.jpg",
                text: "Real-world scenarios and instant feedback made all the difference in my preparation."
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card flex-shrink-0 w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{testimonial.name}</h3>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
