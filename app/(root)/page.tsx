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
        <div className="flex flex-col gap-4 max-w-lg">
          <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
            Master Technical interview skills with <span className="animate-pulse">Susap</span>
          </h2>
          <p className="text-white/80 text-lg">
            Practice real interview questions & get instant feedback.
          </p>

          <Button asChild className="btn-primary max-sm:w-full mt-2">
            <Link href="/interview">Start an Interview</Link>
          </Button>
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
    </>
  );

}

export default Home;
