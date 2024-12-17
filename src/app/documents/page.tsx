"use client";
import { useAppSelector } from "@/hooks";
import ButtonV2 from "@/shared/components/buttonV2";
import DashboardLayout from "@/shared/Layouts/DashboardLayout";
import { selectDarkmode } from "@/states/slices/globalReducer";
import {
  PDF_ICON,
  RED_ARROW,
  SMALL_SEARCH,
  SMALL_SEARCH_WHITE,
} from "@/utils-func/image_exports";
import Image from "next/image";
import React from "react";

function Document() {
  const darkmode = useAppSelector(selectDarkmode);
  return (
    <DashboardLayout>
      <div className="lg:p-10 p-5">
        <div
          className={`flex flex-col gap-y-1 ${
            darkmode ? "border-[#343839]" : ""
          } border-b pb-3 lg:pt-0 pt-8`}
        >
          <span
            className={`lg:text-[40px] text-[20px] font-semibold  ${
              darkmode ? "text-white/80" : "text-black"
            }`}
          >
            Legal Documents
          </span>
          <span className="text-[24px] font-normal text-[#6C7275]">
            List of legal proceedings{" "}
          </span>
        </div>
        <div
          className={`flex items-center lg:w-[360px] w-full my-5 gap-x-2 p-3 border  ${
            darkmode ? "border-[#343839]" : "border-[#E8ECEF]"
          } rounded-3xl`}
        >
          <Image
            src={darkmode ? SMALL_SEARCH_WHITE : SMALL_SEARCH}
            className="w-[24px] h-[24px]"
            alt=""
          />
          <input
            type="text"
            placeholder="Search ..."
            className={`text-[17px] placeholder:text-[17px] placeholder:text-[#8A8A8A] font-normal w-full bg-transparent outline-none ${
              darkmode ? "text-white/50" : "text-black"
            }`}
          />
        </div>
        <div className="w-full grid lg:grid-cols-3 grid-cols-1 gap-5">
          <div
            className={`flex flex-col gap-y-5 w-full items-start border ${
              darkmode ? "border-[#343839]" : "border-[#E8ECEF]"
            } rounded-lg p-3`}
          >
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span
                className={`font-medium text-sm ${
                  darkmode ? "text-white/90" : "text-black"
                }`}
              >
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div
            className={`flex flex-col gap-y-5 w-full items-start border ${
              darkmode ? "border-[#343839]" : "border-[#E8ECEF]"
            } rounded-lg p-3`}
          >
            <div className="flex items-start gap-x-3">
              <Image src={PDF_ICON} className="w-[40px] h-[40px]" alt="" />
              <span
                className={`font-medium text-sm ${
                  darkmode ? "text-white/90" : "text-black"
                }`}
              >
                ABUBAKAR TAFAWA BALEWA UNIVERSITY, BAUCHI ACT, 1988.html
              </span>
            </div>
            <ButtonV2
              title={"View Legal Document"}
              image={RED_ARROW}
              imageSize="w-[14px] h-[14px]"
              btnStyle={"flex items-center gap-x-2 flex-row-reverse"}
              textStyle={"text-[#D84C10] text-xs font-medium"}
              handleClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Document;
