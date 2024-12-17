/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-useless-fragment */

"use client";

import { Transition } from "@headlessui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { useState, useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector, useMediaQuery } from "@/hooks";

import { getBackgroundColor } from "@/utils-func/functions/userDynamicColor";
import { selectUser } from "@/states/slices/authReducer";

import {
  ADD_ICON,
  ARROW_ICON,
  BELL,
  BELL_DARK,
  BIO_ICON,
  BLUE_ICON,
  BUTTON,
  CHAT_ICON,
  CHROME_ICON,
  CLOCK,
  DARK_PASSWORD_ICON,
  DARK_STATUS,
  DARK_THEME,
  DISABLED,
  DISABLED_ORANGE,
  DOCUMENT_ICON,
  GRAY_ICON,
  IMAGE_TOGGLER,
  LARGE_SEARCH,
  LEXTECH_AI_LOGO,
  LIGHT_THEME,
  LOCATION_ICON,
  MAN,
  ORANGE_ICON,
  PAD_LOCK,
  PASSWORD_ICON,
  PROFILE,
  PROFILE_,
  PROFILE_GRAY_ICON,
  SEARCH_ICON,
  SESSION_ICON,
  SESSION_ICON_DARK,
  SETTINGS_ICON,
  SMALL_SEARCH,
  SUN_ICON,
  SUN_ICON_DARK,
  UPDATE_ICON,
} from "@/utils-func/image_exports";
import {
  openModal,
  selectDarkmode,
  SelectOpenState,
  setChatId,
  setChats,
  setChatStarted,
  setDarkMode,
  setOpen,
  setSearcModal,
  setSettings,
  showSettings,
} from "@/states/slices/globalReducer";
import { Fade } from "react-awesome-reveal";
import ButtonV2 from "../buttonV2";
import ModalV2 from "../modalV2";
import Switch from "react-switch";
import { Checkbox } from "@mui/material";
import { ARROW_DOWN } from "@/utils-func/Exports";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import {
  formatTimeElapsed,
  groupMessagesByDate,
  formatHeaderDate,
} from "@/utils-func/functions";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import dayjs, { Dayjs } from "dayjs";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  setOpen: any;
}
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const Sidebar = (props: SidebarProps) => {
  const { onClose } = props;
  const user = useAppSelector(selectUser);
  const [tab, setTab] = useState("edit-profile");
  // const [settings, setSettings] = useState(false);
  const dispatch = useAppDispatch();
  const settings = useAppSelector(showSettings);
  const open = useAppSelector(SelectOpenState);
  const modalIsOpen = useAppSelector(openModal);
  const [lists, setLists] = useState(false);
  const [session, setSession] = useState<any>(null);

  const switchTabs = () => {
    switch (tab) {
      case "edit-profile":
        return <EditProfile />;
        break;
      case "update-password":
        return <UpdatePassword />;
      case "notification":
        return <Notification />;
      case "session":
        return <Session />;
      case "appearance":
        return <Appearance />;
      case "delete-account":
        return <DeleteAccount />;
      default:
        return <EditProfile />;
        break;
    }
  };

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const {
    data: chatHistory,
    isLoading,
    mutate,
  } = useSWR(`/api/history`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: [],
    onSuccess: (newData) => {
      if (!newData || newData.length === 0) {
        setHasMore(false);
        setIsLoadingMore(false);
      }
      setIsLoadingMore(false);
    },
  });
  useEffect(() => {
    if (isLoadingMore) {
      mutate();
    }
  }, [isLoadingMore, mutate]);

  // const groupMessages = groupMessagesByDate(chatHistory);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const filteredMessages = chatHistory.filter(
    (message: { title: string; summary: string; createdAt: string }) => {
      const matchesSearch =
        message.title.toLowerCase().includes(search.toLowerCase()) ||
        message.summary.toLowerCase().includes(search.toLowerCase());

      const messageDate = dayjs(message.createdAt);
      const matchesDate =
        !startDate || messageDate.isSame(startDate.startOf("day"), "day");

      return matchesSearch && matchesDate;
    }
  );

  const groupMessages = filteredMessages.reduce(
    (groups: any, message: { createdAt: string }) => {
      const date = message.createdAt.split("T")[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, typeof chatHistory>
  );

  const isMobileView = useMediaQuery("(max-width: 640px)");
  const isTabletView = useMediaQuery("(max-width: 840px)");
  const currentUser = useAppSelector(selectUser);
  const colors = getBackgroundColor("Abraham");
  const darkmode = useAppSelector(selectDarkmode);
  const pathname = usePathname();
  const router = useRouter();

  const theme = createTheme({
    palette: {
      mode: darkmode ? "dark" : "light",
      primary: {
        main: darkmode ? "#90caf9" : "#1976d2", // Adjust primary color
      },
      background: {
        default: darkmode ? "#121212" : "#ffffff",
        paper: darkmode ? "#1d1d1d" : "#ffffff",
      },
      text: {
        primary: darkmode ? "#ffffff" : "#000000",
      },
    },
  });

  return (
    <>
      {isMobileView || isTabletView ? (
        <Transition
          as="div"
          className="fixed z-50 h-full w-80 flex-none bg-brand-light lg:static"
          enter="transition-all ease-in duration-300"
          enterFrom="transform -translate-x-full"
          enterTo="transform -translate-x-0"
          leave="transition-all ease-out duration-300"
          leaveFrom="transform -translate-x-0"
          leaveTo="transform -translate-x-full"
          show={props.open}
        >
          {/* mobile screen section */}

          <div
            className={` bg-[#141718] h-screen pt-8  duration-300 transition-all`}
          >
            <div className="flex gap-x-4 px-7 pt-2">
              {/* <Image
                  alt=""
                  className={`cursor-pointer duration-500 ${
                    open && "rotate-[360deg]"
                  } ${open && "scale-0 hidden"}`}
                  onClick={() => dispatch(props.setOpen(f))}
                  src={IMAGE_TOGGLER}
                /> */}
              <Image
                alt=""
                onClick={() => {
                  dispatch(setChatStarted(false));
                  dispatch(setOpen(false));
                }}
                className={`cursor-pointer duration-500 transition-all `}
                src={LEXTECH_AI_LOGO}
              />
              <Image
                alt=""
                className={`cursor-pointer duration-500`}
                onClick={() => props.setOpen(false)}
                src={IMAGE_TOGGLER}
              />
            </div>
            <ul className={`pt-6 w-full flex flex-col gap-y-4 px-6`}>
              <li
                onClick={() => {
                  router.push("/");
                  dispatch(setChatStarted(false));
                  dispatch(setOpen(false));
                }}
                className={`flex items-center rounded-lg  p-3 cursor-pointer  justify-start gap-x-5 hover:bg-gradient-to-r ${
                  pathname === "/" &&
                  "bg-gradient-to-r from-[#323337] via-[#323337] to-[rgba(70,_79,_111,_0.3)]"
                } hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <Image src={CHAT_ICON} className="w-[24px] h-[24px]" alt="" />

                <span className="text-[#E8ECEFBF] text-sm font-semibold">
                  Chats
                </span>
              </li>
              <li
                onClick={() => {
                  dispatch(setSearcModal(true));
                  props.setOpen(false);
                }}
                className={`flex items-center cursor-pointer rounded-lg p-3    justify-between hover:bg-gradient-to-r hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <div className={`flex items-center  gap-x-5`}>
                  <Image
                    src={SEARCH_ICON}
                    className={`  w-[24px] h-[24px] `}
                    alt=""
                  />

                  <span className="text-[#E8ECEFBF] text-sm font-semibold">
                    Search
                  </span>
                </div>

                <Image src={BUTTON} className="w-[38px] h-[20px]" alt="" />
              </li>

              <li
                onClick={() => {
                  router.push("/documents");
                  dispatch(setOpen(false));
                }}
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  pathname === "/documents" &&
                  "bg-gradient-to-r from-[#323337] via-[#323337] to-[rgba(70,_79,_111,_0.3)]"
                } justify-start gap-x-5 hover:bg-gradient-to-r hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <Image
                  src={DOCUMENT_ICON}
                  className="w-[24px] h-[24px]"
                  alt=""
                />

                <span className="text-[#E8ECEFBF] text-sm font-semibold">
                  Documents
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/updates");
                  dispatch(setOpen(false));
                }}
                className={`flex items-center p-3 cursor-pointer rounded-lg  ${
                  pathname === "/updates" &&
                  "bg-gradient-to-r from-[#323337] via-[#323337] to-[rgba(70,_79,_111,_0.3)]"
                } justify-start gap-x-5 hover:bg-gradient-to-r hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <Image src={UPDATE_ICON} className="w-[24px] h-[24px]" alt="" />

                <span className="text-[#E8ECEFBF] text-sm font-semibold">
                  Updates and FAQs
                </span>
              </li>
              <li
                onClick={() => dispatch(setSettings)}
                className={`flex items-center cursor-pointer rounded-lg p-3  justify-start gap-x-5 hover:bg-gradient-to-r hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <Image
                  src={SETTINGS_ICON}
                  className="w-[24px] h-[24px]"
                  alt=""
                />

                <span className="text-[#E8ECEFBF] text-sm font-semibold">
                  Settings
                </span>
              </li>
            </ul>
            <div className="border-t relative cursor-pointer py-5 border-[#232627] px-7 mt-7 h-[220px] max-h-[500px] overflow-y-scroll">
              <div
                className={`flex items-center  gap-x-5`}
                onClick={() => setLists((prev) => !prev)}
              >
                <Image
                  src={ARROW_ICON}
                  className={`w-[24px] h-[24px]  transition-all duration-200`}
                  alt=""
                />

                <span className="text-[#E8ECEFBF] text-sm font-semibold">
                  Chat list
                </span>
              </div>

              <Fade direction="down" duration={900}>
                <ul className={`pt-6  flex flex-col gap-y-6 overflow-auto`}>
                  <li className="flex pl-2 items-center justify-between gap-x-5">
                    <div
                      className={`flex  items-center ${
                        open && "justify-center"
                      } justify-start gap-x-5`}
                    >
                      <>
                        <Image
                          src={GRAY_ICON}
                          className="w-[14px] h-[14px]"
                          alt=""
                        />

                        <span className="text-[#E8ECEFBF] text-sm font-semibold">
                          Welcome
                        </span>
                      </>
                    </div>

                    <div className="w-[35px] h-[24px] rounded-md flex items-center justify-center bg-[#232627]">
                      <span className="text-[#6C7275]">48</span>
                    </div>
                  </li>
                  <li className="flex pl-2 items-center justify-between gap-x-5">
                    <div
                      className={`flex  items-center $ justify-start gap-x-5`}
                    >
                      <>
                        <Image
                          src={BLUE_ICON}
                          className="w-[14px] h-[14px]"
                          alt=""
                        />

                        <span className="text-[#E8ECEFBF] text-sm font-semibold">
                          Favorites
                        </span>
                      </>
                    </div>

                    <div className="w-[35px] h-[24px] rounded-md flex items-center justify-center bg-[#232627]">
                      <span className="text-[#6C7275]">18</span>
                    </div>
                  </li>
                  <li className="flex pl-2 items-center justify-between gap-x-5">
                    <div className={`flex  items-centerjustify-start gap-x-5`}>
                      <>
                        <Image
                          src={ORANGE_ICON}
                          className="w-[14px] h-[14px]"
                          alt=""
                        />

                        <span className="text-[#E8ECEFBF] text-sm font-semibold">
                          Archived
                        </span>
                      </>
                    </div>

                    <div className="w-[35px] h-[24px] rounded-md flex items-center justify-center bg-[#232627]">
                      <span className="text-[#6C7275]">128</span>
                    </div>
                  </li>
                  <li className={`flex items-center justify-start gap-x-5`}>
                    <Image
                      src={ADD_ICON}
                      className="w-[24px] h-[24px]"
                      alt=""
                    />

                    <span className="text-[#E8ECEFBF] text-sm font-semibold">
                      New list
                    </span>
                  </li>
                </ul>
              </Fade>

              <div className="w-full h-[148px] p-5 gap-y-6 shadow-dropShadow mt-6 flex flex-col items-center justify-center rounded-xl bg-[#FFFFFF01]">
                <div className="flex items-center justify-between  w-full">
                  <div className="relative">
                    <Image
                      src={MAN}
                      className="w-[40px] h-[40px] rounded-full"
                      alt="image"
                    />
                    <Image
                      src={DARK_STATUS}
                      className="w-[18px] h-[18px] rounded-full absolute -right-1 top-7"
                      alt="image"
                    />
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-[#FEFEFE]">
                      {user?.username}
                    </span>
                    <span className="text-[#E8ECEF80] font-semibold text-xs">
                      {user?.email?.length! > 15
                        ? `${user?.email?.slice(0, 15)}...`
                        : user?.email}
                    </span>
                  </div>
                  <span className="bg-[#3FDD78] text-[#141718] font-bold text-xs flex items-center justify-center rounded-lg px-2 py-1">
                    Free
                  </span>
                </div>
                <ButtonV2
                  title="Upgrade to pro"
                  btnStyle="border-2 border-[#343839] rounded-xl w-full py-3"
                  handleClick={() => {}}
                  textStyle="text-[#FEFEFE] font-semibold text-sm"
                />
              </div>
            </div>
          </div>
        </Transition>
      ) : (
        <div className="flex h-screen">
          <div
            className={`${open ? "w-[320px]" : "w-[85px]"} ${
              darkmode && "shadow-[3px_0_5px_rgba(0,0,0,0.5)]"
            } bg-[#141718] h-screen pt-8 relative duration-300 transition-all `}
          >
            <div className="flex gap-x-4 px-7 pt-2">
              <Image
                alt=""
                className={`cursor-pointer duration-500 ${
                  open && "rotate-[360deg]"
                } ${open && "scale-0 hidden"}`}
                onClick={() => dispatch(setOpen(true))}
                src={IMAGE_TOGGLER}
              />
              <Image
                alt=""
                onClick={() => {
                  dispatch(setChatStarted(false));
                  dispatch(setOpen(false));
                }}
                className={`cursor-pointer duration-500 transition-all ${
                  open ? "scale-100" : "scale-0"
                } `}
                src={LEXTECH_AI_LOGO}
              />
              <Image
                alt=""
                className={`cursor-pointer duration-500 ${
                  open && "rotate-[360deg]"
                } ${open || (!open && "scale-0 hidden")}`}
                onClick={() => dispatch(setOpen(false))}
                src={IMAGE_TOGGLER}
              />
            </div>
            <ul
              className={`pt-6 w-full ${
                open ? "px-7 mt-7" : ""
              } flex flex-col gap-y-4`}
            >
              <li
                onClick={() => {
                  router.push("/");

                  dispatch(setChats([]));
                  dispatch(setChatId(""));
                  dispatch(setOpen(false));
                }}
                className={`flex items-center rounded-lg p-3 cursor-pointer ${
                  !open && "justify-center"
                } justify-start gap-x-5 hover:bg-gradient-to-r ${
                  pathname === "/" &&
                  "bg-gradient-to-r from-[#323337] via-[#323337] to-[rgba(70,_79,_111,_0.3)]"
                } hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <Image src={CHAT_ICON} className="w-[24px] h-[24px]" alt="" />
                {open && (
                  <span className="text-[#E8ECEFBF] text-sm font-semibold">
                    Chats
                  </span>
                )}
              </li>
              <li
                onClick={() => {
                  dispatch(setSearcModal(true));
                  dispatch(setOpen(false));
                }}
                className={`flex items-center cursor-pointer rounded-lg p-3  ${
                  !open && "justify-center"
                }   justify-between hover:bg-gradient-to-r hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <div
                  className={`flex items-center ${
                    !open && "justify-center"
                  } gap-x-5`}
                >
                  <Image
                    src={SEARCH_ICON}
                    className={`  w-[24px] h-[24px]  ${
                      !open && "flex items-center justify-center ml-5"
                    }`}
                    alt=""
                  />
                  {open && (
                    <span className="text-[#E8ECEFBF] text-sm font-semibold">
                      Search
                    </span>
                  )}
                </div>
                {open && (
                  <Image src={BUTTON} className="w-[38px] h-[20px]" alt="" />
                )}
              </li>

              <li
                onClick={() => {
                  router.push("/documents");
                  dispatch(setOpen(false));
                }}
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  !open && "justify-center"
                } ${
                  pathname === "/documents" &&
                  "bg-gradient-to-r from-[#323337] via-[#323337] to-[rgba(70,_79,_111,_0.3)]"
                } justify-start gap-x-5 hover:bg-gradient-to-r hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <Image
                  src={DOCUMENT_ICON}
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                {open && (
                  <span className="text-[#E8ECEFBF] text-sm font-semibold">
                    Documents
                  </span>
                )}
              </li>
              <li
                onClick={() => {
                  router.push("/updates");
                  dispatch(setOpen(false));
                }}
                className={`flex items-center p-3 cursor-pointer rounded-lg ${
                  !open && "justify-center"
                } ${
                  pathname === "/updates" &&
                  "bg-gradient-to-r from-[#323337] via-[#323337] to-[rgba(70,_79,_111,_0.3)]"
                } justify-start gap-x-5 hover:bg-gradient-to-r hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <Image src={UPDATE_ICON} className="w-[24px] h-[24px]" alt="" />
                {open && (
                  <span className="text-[#E8ECEFBF] text-sm font-semibold">
                    Updates and FAQs
                  </span>
                )}
              </li>
              <li
                onClick={() => dispatch(setSettings(true))}
                className={`flex items-center cursor-pointer rounded-lg p-3 ${
                  !open && "justify-center"
                }  justify-start gap-x-5 hover:bg-gradient-to-r hover:from-[#323337] hover:via-[#323337] hover:to-[rgba(70,_79,_111,_0.3)]`}
              >
                <Image
                  src={SETTINGS_ICON}
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                {open && (
                  <span className="text-[#E8ECEFBF] text-sm font-semibold">
                    Settings
                  </span>
                )}
              </li>
            </ul>
            <div className="border-t relative cursor-pointer py-5 border-[#232627] px-7 mt-7 h-[220px] max-h-[400px] overflow-y-scroll">
              <div
                className={`flex items-center ${
                  !open && "justify-center"
                } gap-x-5`}
                onClick={() => setLists((prev) => !prev)}
              >
                <Image
                  src={ARROW_ICON}
                  className={`w-[24px] h-[24px] ${
                    !lists ? "rotate-180" : ""
                  } transition-all duration-200`}
                  alt=""
                />

                {open && (
                  <span className="text-[#E8ECEFBF] text-sm font-semibold">
                    Chat list
                  </span>
                )}
              </div>
              {lists && (
                <Fade direction="down" duration={900}>
                  <ul
                    className={`pt-6 ${
                      open ? "px-0" : ""
                    } flex flex-col gap-y-6 overflow-auto`}
                  >
                    {/* <li className="flex pl-2 items-center justify-between gap-x-5">
                      <div
                        className={`flex  items-center ${
                          open && "justify-center"
                        } justify-start gap-x-5`}
                      >
                        {open ? (
                          <>
                            <Image
                              src={GRAY_ICON}
                              className="w-[14px] h-[14px]"
                              alt=""
                            />

                            <span className="text-[#E8ECEFBF] text-sm font-semibold">
                              Welcome
                            </span>
                          </>
                        ) : (
                          <Image
                            src={GRAY_ICON}
                            className="w-[14px] h-[14px]"
                            alt=""
                          />
                        )}
                      </div>
                      {open && (
                        <div className="w-[35px] h-[24px] rounded-md flex items-center justify-center bg-[#232627]">
                          <span className="text-[#6C7275]">48</span>
                        </div>
                      )}
                    </li> */}
                    <li className="flex pl-2 items-center justify-between gap-x-5">
                      <div
                        className={`flex  items-center ${
                          open && "justify-center"
                        } justify-start gap-x-5`}
                      >
                        {open ? (
                          <>
                            <Image
                              src={BLUE_ICON}
                              className="w-[14px] h-[14px]"
                              alt=""
                            />

                            <span className="text-[#E8ECEFBF] text-sm font-semibold">
                              Favorites
                            </span>
                          </>
                        ) : (
                          <Image
                            src={BLUE_ICON}
                            className="w-[14px] h-[14px]"
                            alt=""
                          />
                        )}
                      </div>
                      {open && (
                        <div className="w-[35px] h-[24px] rounded-md flex items-center justify-center bg-[#232627]">
                          <span className="text-[#6C7275]">18</span>
                        </div>
                      )}
                    </li>
                    <li className="flex pl-2 items-center justify-between gap-x-5">
                      <div
                        className={`flex  items-center ${
                          open && "justify-center"
                        } justify-start gap-x-5`}
                      >
                        {open ? (
                          <>
                            <Image
                              src={ORANGE_ICON}
                              className="w-[14px] h-[14px]"
                              alt=""
                            />

                            <span className="text-[#E8ECEFBF] text-sm font-semibold">
                              Archived
                            </span>
                          </>
                        ) : (
                          <Image
                            src={ORANGE_ICON}
                            className="w-[14px] h-[14px]"
                            alt=""
                          />
                        )}
                      </div>
                      {open && (
                        <div className="w-[35px] h-[24px] rounded-md flex items-center justify-center bg-[#232627]">
                          <span className="text-[#6C7275]">128</span>
                        </div>
                      )}
                    </li>
                    <li
                      className={`flex items-center ${
                        !open && "justify-center"
                      } justify-start gap-x-5`}
                    >
                      <Image
                        src={ADD_ICON}
                        className="w-[24px] h-[24px]"
                        alt=""
                      />
                      {open && (
                        <span className="text-[#E8ECEFBF] text-sm font-semibold">
                          New list
                        </span>
                      )}
                    </li>
                  </ul>
                </Fade>
              )}
              {!open && (
                <div className=" w-[63px] -ml-1 mt-8 h-full bg-[#FFFFFF01] rounded-xl ">
                  <div className="relative ">
                    <Image
                      src={MAN}
                      className="w-[40px] h-[40px] rounded-full"
                      alt="image"
                    />
                    <Image
                      src={DARK_STATUS}
                      className="w-[18px] h-[18px] rounded-full absolute right-5 top-7"
                      alt="image"
                    />
                  </div>
                </div>
              )}

              {open && (
                <div className="w-full h-[148px] p-5 gap-y-6 shadow-dropShadow mt-6 flex flex-col items-center justify-center rounded-xl bg-[#232627]">
                  <div className="flex items-center justify-between  w-full">
                    <div className="relative">
                      <Image
                        src={MAN}
                        className="w-[40px] h-[40px] rounded-full"
                        alt="image"
                      />
                      <Image
                        src={DARK_STATUS}
                        className="w-[18px] h-[18px] rounded-full absolute -right-1 top-7"
                        alt="image"
                      />
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-[#FEFEFE]">
                        {user?.username}
                      </span>
                      <span className="text-[#E8ECEF80] font-semibold text-xs">
                        {user?.email?.length! > 15
                          ? `${user?.email?.slice(0, 15)}...`
                          : user?.email}
                      </span>
                    </div>
                    <span className="bg-[#3FDD78] text-[#141718] font-bold text-xs flex items-center justify-center rounded-lg px-2 py-1">
                      Free
                    </span>
                  </div>
                  <ButtonV2
                    title="Upgrade to pro"
                    btnStyle="border-2 border-[#343839] rounded-xl w-full py-3"
                    handleClick={() => {}}
                    textStyle="text-[#FEFEFE] font-semibold text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ModalV2
        isOpen={modalIsOpen}
        isClose={() => dispatch(setSearcModal(false))}
        maxWidth="w-[723px]"
        edges="rounded-2xl"
      >
        <div
          className={`w-full border-b ${
            darkmode ? "border-[#343839]" : ""
          } py-3 flex items-center justify-start lg:px-7 px-5 gap-x-3`}
        >
          <Image
            src={LARGE_SEARCH}
            className="lg:w-[48px] lg:h-[48px] w-[26px] h-[26px]"
            alt=""
          />
          <input
            type="text"
            className={`bg-transparent outline-none lg:pt-3 pt-0 lg:text-2xl text-xl w-full placeholder:text-[#A1A1A1]  lg:placeholder:text-3xl placeholder:text-xl placeholder:font-normal font-normal ${
              darkmode ? "text-white/50" : "text-black"
            }`}
            placeholder="Search ..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
          {/* <span className="text-[#A1A1A1] font-normal text-3xl">
            Search ...
          </span> */}
        </div>

        <div className=" py-3 px-7">
          <div className="flex items-start lg:flex-row flex-col lg:items-center  justify-start gap-x-4 gap-y-4">
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Filter date"
                    value={startDate}
                    onChange={(date) => {
                      date
                        ? setStartDate(date.startOf("day"))
                        : setStartDate(null);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </ThemeProvider>
          </div>
          {Object.keys(groupMessages).length > 0 ? (
            Object.keys(groupMessages).map((date) => (
              <div
                className={`w-full border-b pb-5 ${
                  darkmode ? "border-[#343839]" : ""
                }`}
              >
                <div className="flex items-end gap-x-3 my-5">
                  <span
                    className={`text-2xl font-semibold ${
                      darkmode ? "text-white/80" : "text-black"
                    }`}
                  >
                    {formatHeaderDate(date)}
                  </span>
                  <span className="text-[#A5A5A5] font-medium text-sm">
                    {format(new Date(date), "MMMM EEEE dd")}
                  </span>
                </div>
                <div className="w-full flex flex-col items-start gap-y-7 mt-3">
                  {groupMessages[date].map(
                    (item: {
                      title: string;
                      summary: string;
                      createdAt: string;
                    }) => (
                      <div className="w-full flex lg:items-center items-end lg:justify-between justify-end lg:flex-row flex-col gap-y-3">
                        <div className="flex flex-col items-start">
                          <span
                            className={`lg:text-[18px] text-sm font-semibold ${
                              darkmode ? "text-white/80" : "text-[#141718]"
                            } `}
                          >
                            {item?.title}
                          </span>
                          <span className="text-[#8E8E93] font-medium text-xs">
                            {item?.summary?.length > 45
                              ? `${item?.summary.slice(0, 45)}...`
                              : item?.summary}
                          </span>
                        </div>
                        <span className="text-[#8E8E93] font-medium text-xs">
                          {formatTimeElapsed(item?.createdAt)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-y-2">
              <Image
                src={"/svg/empty-filter.png"}
                width={isMobileView ? 200 : 300}
                height={isMobileView ? 200 : 300}
                alt="filter image"
              />
              <span className="text-2xl font-medium text-gray-400">
                Oops!! Empty Result
              </span>
            </div>
          )}
        </div>
      </ModalV2>
      <ModalV2
        isBTnTrue
        padding
        isOpen={settings!}
        isClose={() => dispatch(setSettings(false))}
        edges="rounded-2xl"
        maxWidth="w-[1003px]"
      >
        <div className="p-7 w-full flex items-start gap-x-[5rem]">
          <div className="flex flex-col gap-y-4">
            <div className="w-full flex flex-col cursor-pointer">
              <div
                className={`flex items-center justify-start pl-4 gap-x-3 ${
                  tab === "edit-profile" && "border-2 border-[#007AFF]"
                }  rounded-3xl w-[237px] h-[42px]  `}
                onClick={() => setTab("edit-profile")}
              >
                <Image
                  src={tab === "edit-profile" ? PROFILE : PROFILE_}
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                <span
                  className={` ${
                    tab === "edit-profile" ? "text-[#4C4C4C]" : "text-[#464646]"
                  } ${
                    darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
                  }  font-semibold text-[18px]`}
                >
                  Edit profile
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-3 cursor-pointer">
              <div
                className={`flex items-center justify-start pl-4 gap-x-3 ${
                  tab === "update-password" && "border-2 border-[#007AFF]"
                }  rounded-3xl w-[237px] h-[42px]  `}
                onClick={() => setTab("update-password")}
              >
                <Image
                  src={
                    tab === "update-password"
                      ? DARK_PASSWORD_ICON
                      : PASSWORD_ICON
                  }
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                <span
                  className={` ${
                    tab === "update-password"
                      ? "text-[#4C4C4C]"
                      : "text-[#464646]"
                  } ${
                    darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
                  }  font-semibold text-[18px]`}
                >
                  Password
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-3 cursor-pointer">
              <div
                className={`flex items-center justify-start pl-4 gap-x-3 ${
                  tab === "notification" && "border-2 border-[#007AFF]"
                } rounded-3xl w-[237px] h-[42px]  `}
                onClick={() => setTab("notification")}
              >
                <Image
                  src={tab === "notification" ? BELL_DARK : BELL}
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                <span
                  className={` ${
                    darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
                  } font-semibold text-[18px]`}
                >
                  Notification
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-3 cursor-pointer">
              <div
                onClick={() => setTab("session")}
                className={`flex items-center justify-start pl-4 gap-x-3 ${
                  tab === "session" && "border-2 border-[#007AFF]"
                } ${
                  darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
                }  rounded-3xl w-[237px] h-[42px]  `}
              >
                <Image
                  src={tab === "session" ? SESSION_ICON_DARK : SESSION_ICON}
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                <span
                  className={` ${
                    darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
                  } font-semibold text-[18px]`}
                >
                  Sessions
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-3 cursor-pointer">
              <div
                onClick={() => setTab("appearance")}
                className={`flex items-center justify-start pl-4 gap-x-3 ${
                  tab === "appearance" && "border-2 border-[#007AFF]"
                } ${
                  darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
                }  rounded-3xl w-[237px] h-[42px]  `}
              >
                <Image
                  src={tab === "appearance" ? SUN_ICON_DARK : SUN_ICON}
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                <span
                  className={` ${
                    darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
                  } font-semibold text-[18px]`}
                >
                  Appearance
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-3 mt-11 cursor-pointer">
              <div
                onClick={() => setTab("delete-account")}
                className={`flex items-center justify-start pl-4 gap-x-3 ${
                  tab === "delete-account" && "border-2 border-[#D84210] "
                }  rounded-3xl w-[237px] h-[42px]  `}
              >
                <Image
                  src={tab === "delete-account" ? DISABLED_ORANGE : DISABLED}
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                <span
                  className={` ${
                    tab === "delete-account"
                      ? "text-[#D84C10]  "
                      : "text-[#464646] "
                  } ${
                    darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
                  }  font-semibold text-[18px]`}
                >
                  Delete account
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-[500px] max-h-[500px] overflow-y-scroll">
            {switchTabs()}
          </div>
        </div>
      </ModalV2>
    </>
  );
};

export default Sidebar;

export const EditProfile = () => {
  const darkmode = useAppSelector(selectDarkmode);
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <div className="flex flex-col gap-y-3 items-start justify-start">
        <span
          className={`font-bold text-2xl ${
            darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
          } `}
        >
          Edit Profile
        </span>

        <div className="flex items-start gap-x-7">
          <div className="flex flex-col gap-y-2 items-start">
            <span
              className={`font-semibold text-[18px] ${
                darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
              } `}
            >
              Avatar
            </span>
            <div>
              <Image
                src={MAN}
                className="w-[109.71px] h-[109.71px] object-contain rounded-full"
                alt=""
              />
            </div>
          </div>
          <div className="flex items-start flex-col gap-y-3">
            <ButtonV2
              title="Upload new image"
              btnStyle={`border ${
                darkmode ? "border-gray-700" : "border-[#EAEAEA]"
              }   rounded-lg w-[203px] h-[52px] flex items-center justify-center`}
              handleClick={() => {}}
              textStyle={`font-semibold ${
                darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
              } `}
            />
            <span className="text-[#AEAEAE] font-semibold text-[16px] text-start">
              At least 800 x 800 px recommended. <br /> JPG or PNG and GIF is
              allowed
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-y-8 w-full mt-4">
        <div className="w-full flex items-start flex-col gap-y-1">
          <span
            className={`text-[16px] font-semibold ${
              darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
            }`}
          >
            Name
          </span>
          <div
            className={` ${
              darkmode ? "bg-[#4C4C4C]" : " bg-[#F3F5F7]"
            } w-full flex items-start gap-x-3 px-3 py-4 rounded-lg`}
          >
            <Image
              src={PROFILE_GRAY_ICON}
              className="w-[24px] h-[24px]"
              alt=""
            />
            <input
              type="text"
              placeholder="Username"
              className={`w-full ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              } bg-transparent outline-none placeholder:text-[#A3A3A3] placeholder:text-[16px]`}
            />
          </div>
        </div>
        <div className="w-full flex items-start flex-col gap-y-1">
          <span
            className={`text-[16px] font-semibold ${
              darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
            }`}
          >
            Location
          </span>
          <div
            className={`${
              darkmode ? "bg-[#4C4C4C]" : " bg-[#F3F5F7]"
            } w-full flex items-start gap-x-3 px-3 py-4 rounded-lg`}
          >
            <Image src={LOCATION_ICON} className="w-[24px] h-[24px]" alt="" />
            <input
              type="text"
              placeholder="Location"
              className={`w-full ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              } bg-transparent outline-none placeholder:text-[#A3A3A3] placeholder:text-[16px]`}
            />
          </div>
        </div>
        <div className={`w-full flex items-start flex-col gap-y-1`}>
          <span
            className={`text-[16px] font-semibold ${
              darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
            }`}
          >
            Bio
          </span>
          <div
            className={`${
              darkmode ? "bg-[#4C4C4C]" : " bg-[#F3F5F7]"
            } w-full flex items-start gap-x-3 p-3 rounded-lg`}
          >
            <Image src={BIO_ICON} className="w-[24px] h-[24px]" alt="" />
            <textarea
              rows={5}
              placeholder="Short bio"
              className={`w-full resize-none bg-transparent outline-none  ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              } placeholder:text-[#A3A3A3] placeholder:text-[16px]`}
            />
          </div>
        </div>
        <ButtonV2
          title="Save changes"
          btnStyle=" rounded-lg w-full h-[62px] flex items-center justify-center bg-[#1787FC]"
          handleClick={() => {}}
          textStyle="text-white font-semibold"
        />
      </div>
    </div>
  );
};

export const UpdatePassword = () => {
  const darkmode = useAppSelector(selectDarkmode);
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <span
        className={`font-bold text-2xl ${
          darkmode ? "text-[#FEFEFE]" : "text-[#4C4C4C]"
        } `}
      >
        Password
      </span>

      <div className="mt-6 flex flex-col gap-y-5 w-full">
        <div className="w-full flex items-start flex-col gap-y-1">
          <span
            className={`text-[16px] font-semibold ${
              darkmode ? "text-[#FEFEFE]" : "text-black"
            }`}
          >
            Password
          </span>
          <div
            className={`${
              darkmode ? "bg-[#4C4C4C]" : " bg-[#F3F5F7]"
            } w-full flex items-start gap-x-3 px-3 py-3 rounded-lg`}
          >
            <Image src={PAD_LOCK} className="w-[24px] h-[24px]" alt="" />
            <input
              type="password"
              placeholder="Password"
              className={`w-full ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              } bg-transparent outline-none placeholder:text-[#A3A3A3] placeholder:text-[16px]`}
            />
          </div>
        </div>
        <div className="w-full flex items-start flex-col gap-y-1">
          <span
            className={`text-[16px] font-semibold ${
              darkmode ? "text-[#FEFEFE]" : "text-black"
            }`}
          >
            New password
          </span>
          <div
            className={`${
              darkmode ? "bg-[#4C4C4C]" : " bg-[#F3F5F7]"
            } w-full flex items-start gap-x-3 px-3 py-3 rounded-lg`}
          >
            <Image src={PAD_LOCK} className="w-[24px] h-[24px]" alt="" />
            <input
              type="password"
              placeholder="New password"
              className={`w-full ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              } bg-transparent outline-none placeholder:text-[#A3A3A3] placeholder:text-[16px]`}
            />
          </div>
          <span className="text-[#A3A3A3] text-[16px] font-semibold">
            Minimum of 8 characters
          </span>
        </div>
        <div className="w-full flex items-start flex-col gap-y-1">
          <span
            className={`text-[16px] font-semibold ${
              darkmode ? "text-[#FEFEFE]" : "text-black"
            }`}
          >
            Confirm new password
          </span>
          <div
            className={`${
              darkmode ? "bg-[#4C4C4C]" : " bg-[#F3F5F7]"
            } w-full flex items-start gap-x-3 px-3 py-3 rounded-lg`}
          >
            <Image src={PAD_LOCK} className="w-[24px] h-[24px]" alt="" />
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              } bg-transparent outline-none placeholder:text-[#A3A3A3] placeholder:text-[16px]`}
            />
          </div>
          <span className="text-[#A3A3A3] text-[16px] font-semibold">
            Minimum of 8 characters
          </span>
        </div>
        <ButtonV2
          title="Change password"
          btnStyle=" rounded-lg w-full h-[62px] flex items-center justify-center bg-[#1787FC]"
          handleClick={() => {}}
          textStyle="text-white font-semibold"
        />
      </div>
    </div>
  );
};
export const Notification = () => {
  const [checked, setChecked] = useState(false);
  const darkmode = useAppSelector(selectDarkmode);
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <div
        className={`flex items-center justify-between w-full border-b pb-5 ${
          darkmode && "border-gray-700"
        }`}
      >
        <span
          className={`font-bold text-2xl  ${
            darkmode ? "text-[#A3A3A3] " : "text-black"
          }`}
        >
          Notifications
        </span>
        <Switch
          onChange={(checked: boolean) => setChecked(checked)}
          checked={checked}
          offColor="#ccc"
          onColor="#007bff"
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </div>
      <div className="mt-7 flex flex-col gap-y-7 items-start w-full">
        <span
          className={`font-semibold text-xl  ${
            darkmode ? "text-[#A3A3A3]" : "text-black"
          }`}
        >
          LexTech Assitance
        </span>
        <div className="w-full flex flex-col items-start">
          <div className="w-full flex items-center justify-between">
            <span
              className={`text-[16px] font-semibold ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              }`}
            >
              Updates to existing answers
            </span>
            <Checkbox {...label} />
          </div>
          <div className="w-full flex items-center justify-between">
            <span
              className={`text-[16px] font-semibold ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              }`}
            >
              New relevant case law or statutes
            </span>
            <Checkbox {...label} />
          </div>
          <div className="w-full flex items-center justify-between">
            <span
              className={`text-[16px] font-semibold ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              }`}
            >
              Notifications when new research is available
            </span>
            <Checkbox {...label} />
          </div>
        </div>
      </div>
      <div className="mt-7 flex flex-col gap-y-7 items-start w-full">
        <span className="font-semibold text-xl">General</span>
        <div className="w-full flex flex-col items-start">
          <div className="w-full flex items-center justify-between">
            <span
              className={`text-[16px] font-semibold ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              }`}
            >
              System updates and maintenance notifications
            </span>
            <Checkbox {...label} />
          </div>
          <div className="w-full flex items-center justify-between">
            <span
              className={`text-[16px] font-semibold ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              }`}
            >
              New feature announcements
            </span>
            <Checkbox {...label} />
          </div>
          <div className="w-full flex items-center justify-between">
            <span
              className={`text-[16px] font-semibold ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              }`}
            >
              Security alerts and notifications
            </span>
            <Checkbox {...label} />
          </div>
        </div>
      </div>
    </div>
  );
};
export const Session = () => {
  const darkmode = useAppSelector(selectDarkmode);
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <div className="flex flex-col items-start gap-y-3 w-full ">
        <span
          className={`font-bold text-2xl ${
            darkmode ? "text-[#A3A3A3]" : "text-black"
          }`}
        >
          Sessions
        </span>
        <span className="text-[17px] font-normal text-[#6C7275] text-start">
          {" "}
          This is a list of devices that have logged into your account. Revoke
          any sessions that you do not recognize.
        </span>
      </div>
      <div className="mt-5 w-full flex flex-col items-start">
        <span
          className={`text-[24px] font-normal border-b pb-4 w-full text-start ${
            darkmode ? "text-[#A3A3A3] border-gray-700" : "text-black"
          }`}
        >
          Devices
        </span>
        <div className="flex flex-col gap-y-4 w-full mt-4">
          <div
            className={`flex items-center justify-between w-full border-b pb-3 ${
              darkmode && "border-gray-700"
            }`}
          >
            <div className="flex items-start justify-start gap-x-4">
              <Image src={CHROME_ICON} className="w-[35px] h-[35px]" alt="" />
              <div className="flex flex-col items-start">
                <span
                  className={`text-[18px] font-semibold  ${
                    darkmode ? "text-[#A3A3A3]" : "text-black"
                  }`}
                >
                  Chrome on iPhone
                </span>
                <span className="text-[#676767] font-semibold text-sm">
                  222.225.225.222
                </span>
                <span className="text-[#676767] font-semibold text-sm">
                  Signed in Nov 17, 2023
                </span>
              </div>
            </div>
            <ButtonV2
              title="Revoke"
              btnStyle={`border ${
                darkmode ? "border-gray-700" : "border-[#CECECE]"
              }  rounded-xl py-2 px-5`}
              textStyle={darkmode ? "text-[#A3A3A3]" : "text-black"}
              handleClick={() => {}}
            />
          </div>
          <div
            className={`flex items-center justify-between w-full border-b pb-3 ${
              darkmode && "border-gray-700"
            }`}
          >
            <div className="flex items-start justify-start gap-x-4">
              <Image src={CHROME_ICON} className="w-[35px] h-[35px]" alt="" />
              <div className="flex flex-col items-start">
                <span
                  className={`text-[18px] font-semibold  ${
                    darkmode ? "text-[#A3A3A3]" : "text-black"
                  }`}
                >
                  Chrome on iPhone
                </span>
                <span className="text-[#676767] font-semibold text-sm">
                  222.225.225.222
                </span>
                <span className="text-[#676767] font-semibold text-sm">
                  Signed in Nov 17, 2023
                </span>
              </div>
            </div>
            <ButtonV2
              title="Revoke"
              btnStyle={`border ${
                darkmode ? "border-gray-700" : "border-[#CECECE]"
              }  rounded-xl py-2 px-5`}
              textStyle={darkmode ? "text-[#A3A3A3]" : "text-black"}
              handleClick={() => {}}
            />
          </div>
          <div
            className={`flex items-center justify-between w-full border-b pb-3 ${
              darkmode && "border-gray-700"
            }`}
          >
            <div className="flex items-start justify-start gap-x-4">
              <Image src={CHROME_ICON} className="w-[35px] h-[35px]" alt="" />
              <div className="flex flex-col items-start">
                <span
                  className={`text-[18px] font-semibold  ${
                    darkmode ? "text-[#A3A3A3]" : "text-black"
                  }`}
                >
                  Chrome on iPhone
                </span>
                <span className="text-[#676767] font-semibold text-sm">
                  222.225.225.222
                </span>
                <span className="text-[#676767] font-semibold text-sm">
                  Signed in Nov 17, 2023
                </span>
              </div>
            </div>
            <ButtonV2
              title="Revoke"
              btnStyle={`border ${
                darkmode ? "border-gray-700" : "border-[#CECECE]"
              }  rounded-xl py-2 px-5`}
              textStyle={darkmode ? "text-[#A3A3A3]" : "text-black"}
              handleClick={() => {}}
            />
          </div>
        </div>
      </div>
      <ButtonV2
        title="Sign out of all devices"
        btnStyle=" rounded-lg w-full my-6 h-[62px] flex items-center justify-center bg-[#1787FC]"
        handleClick={() => {}}
        textStyle="text-white font-semibold"
      />
    </div>
  );
};
export const Appearance = () => {
  const dispatch = useAppDispatch();
  const darkmode = useAppSelector(selectDarkmode);
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <div className="flex flex-col items-start gap-y-7">
        <span
          className={`font-bold text-2xl ${
            darkmode ? "text-[#A3A3A3]" : "text-black"
          }`}
        >
          Appearance
        </span>
        <div className="flex flex-col items-start w-full mt-4 gap-y-5">
          <span className="text-[#4B4B4B] font-semibold text-xl">
            Appearance
          </span>
          <div className="flex items-start gap-x-14">
            <div
              className="flex items-start flex-col gap-y-1 cursor-pointer"
              onClick={() => dispatch(setDarkMode(true))}
            >
              <Image src={DARK_THEME} className="w-[183px] h-[116px]" alt="" />
              <span className="text-[#606060] font-medium text-[15px]">
                Dark mode
              </span>
            </div>

            <div
              className="flex items-start flex-col gap-y-1 cursor-pointer"
              onClick={() => dispatch(setDarkMode(false))}
            >
              <Image src={LIGHT_THEME} className="w-[183px] h-[116px]" alt="" />
              <span className="text-[#606060] font-medium text-[15px]">
                Light mode
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full mt-14">
        <span className="text-[#4B4B4B] font-semibold text-xl">
          Primary language
        </span>
        <div
          className={`w-[325px] px-3 py-4 rounded-lg  flex items-center justify-between ${
            darkmode ? "bg-[#6C7275]" : "bg-[#F0F0F0]"
          }`}
        >
          <span
            className={`text-[#4B4B4B] font-semibold text-xl ${
              darkmode ? "text-[#A3A3A3]" : "text-black"
            } `}
          >
            English (United state )
          </span>
          <Image src={ARROW_DOWN} className="w-[20px] h-[20px]" alt="" />
        </div>
      </div>
    </div>
  );
};
export const DeleteAccount = () => {
  const darkmode = useAppSelector(selectDarkmode);
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <div className="flex flex-col items-start gap-y-3 w-full ">
        <span
          className={`font-bold text-2xl ${
            darkmode ? "text-[#A3A3A3]" : "text-black"
          }`}
        >
          We’re sorry to see you go
        </span>
        <span className="text-[15px] font-normal text-[#6C7275] text-start">
          {" "}
          Warning: Deleting your account will permanently remove all of your
          data and cannot be undone. This includes your profile, chats,
          comments, and any other information associated with your account. Are
          you sure you want to proceed with deleting your account?
        </span>
      </div>
      <div className="mt-10 w-full flex flex-col gap-y-6">
        <div className="w-full flex items-start flex-col gap-y-1">
          <span className="text-[16px] font-semibold">Password</span>
          <div
            className={` ${
              darkmode ? "bg-[#4C4C4C]" : "bg-[#F3F5F7]"
            } w-full flex items-start gap-x-3 px-3 py-4 rounded-lg `}
          >
            <Image src={PAD_LOCK} className="w-[24px] h-[24px]" alt="" />
            <input
              type="password"
              placeholder="Password"
              className={`w-full bg-transparent outline-none  ${
                darkmode ? "text-[#A3A3A3]" : "text-black"
              } placeholder:text-[#A3A3A3] placeholder:text-[16px]`}
            />
          </div>
        </div>
        <ButtonV2
          disabled
          title="Delete account"
          btnStyle=" bg-opacity-50 bg-[#D84210] rounded-lg w-full h-[62px] flex items-center justify-center bg-[#1787FC]"
          handleClick={() => {}}
          textStyle="text-white font-semibold"
        />
      </div>
    </div>
  );
};
