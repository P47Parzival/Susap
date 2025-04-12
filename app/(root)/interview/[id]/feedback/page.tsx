import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <section className="section-feedback container mx-auto p-6 max-w-4xl text-white">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize text-blue-400">{interview.role}</span> Interview
        </h1>
      </div>
  
      {/* Summary Info */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {/* Overall Score */}
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm">
          <Image src="/star.svg" width={22} height={22} alt="star" />
          <p className="text-sm">
            Overall Impression:{" "}
            <span className="text-blue-400 font-bold">{feedback?.totalScore}</span>/100
          </p>
        </div>
  
        {/* Date */}
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm">
          <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
          <p className="text-sm text-white/70">
            {feedback?.createdAt
              ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
              : "N/A"}
          </p>
        </div>
      </div>
  
      <hr className="border-white/20 mb-6" />
  
      {/* Final Assessment */}
      <p className="text-white/80 mb-8">{feedback?.finalAssessment}</p>
  
      {/* Interview Breakdown */}
      <div className="flex flex-col gap-6 mb-8">
        <h2 className="text-xl font-semibold">Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div
            key={index}
            className="bg-white/5 p-4 rounded-xl backdrop-blur-md border border-white/10"
          >
            <p className="font-bold mb-1">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p className="text-white/70">{category.comment}</p>
          </div>
        ))}
      </div>
  
      {/* Strengths */}
      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-lg font-semibold text-green-400">Strengths</h3>
        <ul className="list-disc list-inside text-white/80">
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>
  
      {/* Areas for Improvement */}
      <div className="flex flex-col gap-3 mb-10">
        <h3 className="text-lg font-semibold text-red-400">Areas for Improvement</h3>
        <ul className="list-disc list-inside text-white/80">
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>
  
      {/* Action Buttons */}
      <div className="container mx-auto max-w-4xl p-4 overflow-hidden">
        <Button className="btn-secondary w-full">
          <Link href="/" className="w-full text-center">
            <p className="text-sm font-semibold text-primary-200">Back to dashboard</p>
          </Link>
        </Button>
  
        <Button className="btn-primary w-full">
          <Link href={`/interview/${id}`} className="w-full text-center">
            <p className="text-sm font-semibold text-black">Retake Interview</p>
          </Link>
        </Button>
      </div>
    </section>
  );
  
};

export default Feedback;
