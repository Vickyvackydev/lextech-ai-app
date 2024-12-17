/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import { useEffect, useState } from "react";

import { useAppSelector, useMediaQuery } from "@/hooks";

import Sidebar from "@/shared/components/Sidebar";

import SidebarV2 from "../components/Sidebar/sidebarV2";
import { FaBars, FaEllipsisV } from "react-icons/fa";
import { selectDarkmode } from "@/states/slices/globalReducer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkmode = useAppSelector(selectDarkmode);
  const isMobileView = useMediaQuery("(max-width: 640px)");
  const isTabletView = useMediaQuery("(max-width: 840px)");
  const [isSideNavVisible, setSideNavVisible] = useState(false);

  useEffect(() => {
    if (isMobileView) {
      setSideNavVisible(false);
    } else {
      setSideNavVisible(false);
    }
  }, [isMobileView]);
  return (
    <div className="h-screen w-full overflow-hidden lg:flex">
      {isMobileView || isTabletView ? (
        <div
          className={`fixed bottom-0 left-0 top-0 z-20 w-full bg-gray-800/60 ${
            isSideNavVisible ? "" : "hidden"
          }`}
          onClick={() => setSideNavVisible(false)}
        />
      ) : null}

      {isMobileView && (
        <div className="w-full bg-white shadow-md flex items-center justify-between p-5 absolute z-30">
          <div className="flex items-center gap-x-2">
            <div
              className="flex items-center justify-center rounded-full w-[40px] h-[40px] bg-[#fbfcfe]"
              onClick={() => setSideNavVisible(true)}
            >
              <FaBars />
            </div>
            <span>LexTech Ai.0</span>
          </div>
          <FaEllipsisV />
        </div>
      )}
      <Sidebar
        {...{
          open: isSideNavVisible,
          setOpen: setSideNavVisible,
          onClose: () => setSideNavVisible(false),
        }}
      />

      <div
        className={`[@media(max-width:767px)]:scrollbar-hide h-screen overflow-auto ${
          darkmode ? "bg-[#141718]" : "bg-[#fbfcfe] "
        } lg:pb-20 lg:w-[2100px] md:w-full sm:w-full lg:mt-0 mt-10`}
      >
        {children}
      </div>

      <SidebarV2
        open={false}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        setOpen={undefined}
      />
    </div>
  );
}
