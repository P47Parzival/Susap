import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="relative w-[360px] max-sm:w-full min-h-96 bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_#00f2ff1a] hover:shadow-[0_0_40px_#00f2ff3d] transition-all duration-300">
      <div className="p-5 flex flex-col justify-between h-full text-white">
        {/* Type Badge */}
        <div
          className={cn(
            "absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-xs font-bold text-white backdrop-blur-md",
            badgeColor || "bg-gradient-to-r from-cyan-500 to-teal-400"
          )}
        >
          {normalizedType}
        </div>
  
        {/* Cover Image */}
        <div className="flex justify-center mt-2">
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-full border-4 border-cyan-500/20 object-cover shadow-lg"
          />
        </div>
  
        {/* Interview Role */}
        <h3 className="mt-4 text-lg font-semibold text-center text-cyan-300 capitalize tracking-wide">
          {role} Interview
        </h3>
  
        {/* Date & Score */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Image src="/calendar.svg" width={20} height={20} alt="calendar" />
            <p>{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/star.svg" width={20} height={20} alt="star" />
            <p>{feedback?.totalScore || "---"}/100</p>
          </div>
        </div>
  
        {/* Feedback */}
        <p className="text-center text-sm text-gray-400 mt-4 line-clamp-2">
          {feedback?.finalAssessment ||
            "Interview is yet to be taken. Take it to generate feedback."}
        </p>
  
        {/* Footer Row */}
        <div className="mt-6 flex flex-row justify-between items-center">
          <DisplayTechIcons techStack={techstack} />
  
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl text-sm shadow-md transition-all">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
  
  
};

export default InterviewCard;