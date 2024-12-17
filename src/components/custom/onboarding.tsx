import { useState } from "react";
import {
  MAP_CONNECTION,
  WAVE,
  DOC_ICON,
  CASE,
  LEGAL,
  DRAFT,
  MAP_COLORED,
} from "@/utils-func/image_exports";
import Image from "next/image";
import React from "react";
import { Bounce, Fade } from "react-awesome-reveal";
import { motion } from "framer-motion";
import ButtonV2 from "@/shared/components/buttonV2";
import { useAppSelector, useAppDispatch, useMediaQuery } from "@/hooks";
import {
  selectDarkmode,
  SelectOpenState,
  setSelectedInput,
} from "@/states/slices/globalReducer";
import Typewriter from "typewriter-effect";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";

interface CustomResponse extends Response {
  headers: Headers & {
    get(name: "X-Chat-Id"): string | null;
  };
}

function Onboarding({
  username,
  append,
}: {
  username: string | null | undefined;
  append: any;
}) {
  const router = useRouter();
  const open = useAppSelector(SelectOpenState);
  const dispatch = useAppDispatch();
  const darkmode = useAppSelector(selectDarkmode);
  const text = "Can I help you with anything?";
  const isMobile = useMediaQuery("(max-width: 640px)");
  // const [chatId, setChatId] = useState("")

  const letters = text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="overflow-y-auto w-full pt-8  pb-[150px]">
      <Bounce>
        <div className="flex items-center justify-center flex-col gap-y-2">
          <Image src={WAVE} className="w-[53px] h-[53px] " alt="Wave Icon" />
          <span
            className={` font-semibold text-[36px] ${
              darkmode ? "text-gray-300" : "text-[#767676]"
            }`}
          >
            Hi {username?.split(" ")[0]}
          </span>
          <span
            className={`text-[13px] font-medium  text-center ${
              darkmode ? "text-gray-300" : "text-[#3F454D]"
            }`}
          >
            Ready to assist you with anything you need, from answering questions{" "}
            <br />
            to providing recommendations. Let’s get started!
          </span>
        </div>
      </Bounce>
      <Bounce duration={1000}>
        <div
          className={`w-full  ${
            darkmode ? "bg-none" : "bg-[#E4F4FF]"
          }  rounded-xl lg:h-[199px] h-full mt-10 lg:p-10 p-5 flex flex-col items-start lg:gap-y-7 gap-y-3`}
        >
          {/* <motion.div
            className="overflow-hidden inline-block md:text-[36px] text-sm font-bold text-gray-900"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.div> */}
          <div
            className={`lg:text-[36px] text-[17px] font-semibold ${
              darkmode ? "text-white" : "text-black"
            }`}
          >
            <Typewriter
              options={{
                strings: ["Hi Am LexTech AI."],
                autoStart: true,
                loop: false,
                cursor: "|",
                delay: 75,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString("Can I help you with anything?")
                  .callFunction(() => {
                    const cursor: any = document.querySelector(
                      ".Typewriter__cursor"
                    );
                    if (cursor) cursor.style.display = "none";
                  })
                  .start();
              }}
            />
          </div>
          <ButtonV2
            title={"Take a tour"}
            btnStyle={`
              ${
                darkmode
                  ? "border border-[#343839] bg-none"
                  : "bg-[#007AFF] border-0"
              }
               rounded-3xl lg:w-[180px] w-30 lg:h-[51px] h-full flex items-center justify-center lg:gap-x-3 gap-x-1 lg:p-3 p-2 flex-row-reverse`}
            textStyle={` ${
              darkmode ? "text-gray-300" : "text-[#FEFEFE] "
            } lg:text-lg text-sm`}
            image={darkmode ? MAP_COLORED : MAP_CONNECTION}
            imageSize="w-[24px] h-[24px]"
            handleClick={function (
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
      </Bounce>
      <Fade direction="down" duration={1000}>
        <div
          className={`w-full grid md:grid-cols-4 lg:grid-cols-4 sm:grid-cols-1 gap-y-3 items-center lg:mb-0 mb-[100px] ${
            open && !isMobile ? "  grid-cols-3 gap-y-2" : ""
          }   gap-x-2 mt-8 `}
        >
          <div
            className={`${
              darkmode
                ? "border-[#343839] hover:bg-white/10"
                : "border-[#E8ECEF]"
            } cursor-pointer px-4 pt-8 border gap-y-3 flex flex-col rounded-xl h-[195px] w-full`}
            onClick={async () => {
              append({
                role: "user",
                content: "Analyze precedents and case outcomes",
              });
            }}
          >
            <Image src={CASE} className="w-[53px] h-[53px]" alt="" />
            <div className="flex flex-col">
              <span
                className={`text-[18px] font-semibold  ${
                  darkmode ? "text-gray-300 " : "text-black"
                }`}
              >
                Case Law Analysis
              </span>
              <span className="text-[#6E6E6E] leading-tight font-normal text-[15px]">
                Analyze precedents and case outcomes
              </span>
            </div>
          </div>
          <div
            className={`${
              darkmode
                ? "border-[#343839] hover:bg-white/10"
                : "border-[#E8ECEF]"
            } cursor-pointer px-4 pt-8 border gap-y-3 flex flex-col rounded-xl h-[195px] w-full`}
            onClick={async () => {
              append({
                role: "user",
                content: "Review and summarize legal documents",
              });
            }}
          >
            <Image src={DOC_ICON} className="w-[53px] h-[53px]" alt="" />
            <div className="flex flex-col">
              <span
                className={`text-[18px] font-semibold  ${
                  darkmode ? "text-gray-300" : "text-black"
                }`}
              >
                Document Review
              </span>
              <span className="text-[#6E6E6E] leading-tight font-normal text-[15px]">
                Review and summarize legal documents
              </span>
            </div>
          </div>
          <div
            className={`${
              darkmode
                ? "border-[#343839] hover:bg-white/10"
                : "border-[#E8ECEF]"
            } cursor-pointer px-4 pt-8 border gap-y-3 flex flex-col rounded-xl h-[195px] w-full`}
            onClick={async () => {
              append({
                role: "user",
                content: "Research specific legal topics",
              });
            }}
          >
            <Image src={LEGAL} className="w-[53px] h-[53px]" alt="" />
            <div className="flex flex-col">
              <span
                className={`text-[18px] font-semibold  ${
                  darkmode ? "text-gray-300" : "text-black"
                }`}
              >
                Legal research
              </span>
              <span className="text-[#6E6E6E] font-normal text-[15px] leading-tight">
                Research specific legal topics
              </span>
            </div>
          </div>
          <div
            className={`${
              darkmode
                ? "border-[#343839] hover:bg-white/10"
                : "border-[#E8ECEF]"
            } cursor-pointer px-4 pt-8 border gap-y-3 flex flex-col rounded-xl h-[195px] w-full`}
            onClick={async () => {
              append({
                role: "user",
                content: "Create legal document summaries",
              });
            }}
          >
            <Image src={DRAFT} className="w-[53px] h-[53px]" alt="" />
            <div className="flex flex-col">
              <span
                className={`text-[18px] font-semibold  ${
                  darkmode ? "text-gray-300" : "text-black"
                }`}
              >
                Draft Summary
              </span>
              <span className="text-[#6E6E6E] font-normal text-[15px]">
                Create legal document summaries
              </span>
            </div>
          </div>
        </div>
      </Fade>
    </div>
  );
}

export default Onboarding;
