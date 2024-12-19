"use client";
import { Attachment } from "ai";
import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  selectChat,
  selectChatId,
  selectDarkmode,
  SelectOpenState,
  setChatId,
  setChats,
  setLiveCaption,
  setLiveCaptionPopUp,
  showCaption,
  showCaptionPopUp,
} from "@/states/slices/globalReducer";
import { motion } from "framer-motion";
import { shareChat } from "@/lib/actions/chat";
import { useAppDispatch, useAppSelector, useMediaQuery } from "@/hooks";
import toast from "react-hot-toast";
import { selectInput, setSearcModal } from "@/states/slices/globalReducer";
import Image from "next/image";
import { MenuButton, Menu, MenuItem, MenuItems } from "@headlessui/react";
import { SHARE_ICON } from "@/utils-func/Exports";
import {
  ADD_ICON,
  AI_PHOTO,
  DOTS,
  SENDER,
  STAR_ICON,
  STAR_ICON_,
  DELETE_ICON,
  EXPO_SHARE,
  DUPLICATE_ICON,
  STAR_ICON_GRAY,
  STAR_ICON_WHITE,
  DELETE_ICON_RED,
  DUPLICATE_ICON_WHITE,
  EXPO_SHARE_WHITE,
  SPEAKER,
  SPEAKING,
} from "@/utils-func/image_exports";
import { Bounce, Fade } from "react-awesome-reveal";
import Onboarding from "./onboarding";
import { useSession } from "next-auth/react";
import { PulseLoader } from "react-spinners";
import { formatChatTime, useClipboard } from "@/utils-func/functions";
import { StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import { FaEllipsisH, FaFilePdf, FaImage, FaVolumeUp } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import { selectUser } from "@/states/slices/authReducer";
import { getChats, SendMessage } from "@/services/chat/chat.service";
import { useQuery } from "react-query";
import { Tooltip } from "@mui/material";

export function Chat({ isNewChat = false }: { isNewChat?: boolean }) {
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const user = useAppSelector(selectUser);
  const [listening, setListening] = useState(false);
  const [userStartedSpeaking, setUserStartedSpeaking] = useState(false);
  const [placeHolder, setPlaceHolder] = useState("Type a message...");
  const [transcription, setTranscription] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const open = useAppSelector(SelectOpenState);
  const selectedText = useAppSelector(selectInput);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [captions, setCaptions] = useState("");
  const [fileSelector, setFileSelector] = useState(false);
  const pathname = usePathname();
  const chat_id = pathname.split("/").pop();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chats = useAppSelector(selectChat);
  const isFirstNewChat = chats?.length < 1;
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = useAppSelector(selectChatId);
  const [loading, setLoading] = useState(false);
  const { data: chatMessages } = useQuery("chats", getChats);
  const darkmode = useAppSelector(selectDarkmode);
  const liveCaption = useAppSelector(showCaption);
  const liveCaptionPopUp = useAppSelector(showCaptionPopUp);
  const { copyToClipboard } = useClipboard();

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  if (liveCaption) {
    recognition.continuous = false;
    recognition.interimResults = true;
  } else {
    recognition.continuous = false;
    recognition.interimResults = false;
  }
  recognition.lang = "en-US";

  const startListening = () => {
    setListening(true);
    // if (!liveCaption || listening) return;

    setPlaceHolder("Speak now...");
    setTranscription("");
    recognition.start();

    recognition.onresult = (event: any) => {
      let liveCaption = "";
      for (let i = 0; i < event.results.length; i++) {
        liveCaption += event.results[i][0].transcript; // Build the live caption
      }
      setCaptions(liveCaption);
      const text = event.results[0][0].transcript;

      setMessage(text);
      setUserStartedSpeaking(false);
      setPlaceHolder("Type a message...");
      setListening(false);
    };

    recognition.onspeechstart = () => {
      setUserStartedSpeaking(true);
      setPlaceHolder("Listening...");
    };
    recognition.onspeechend = () => {
      setListening(false);

      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);

      setUserStartedSpeaking(false);
      setPlaceHolder("Type a message...");
      recognition.stop();
    };

    recognition.onend = () => {
      setListening(false);
      setUserStartedSpeaking(false);

      setPlaceHolder("Type a message...");
      recognition.stop();
    };
  };

  const stopListening = () => {
    setListening(false);
    recognition.stop();
  };
  const handleStartChat = async () => {
    const formData = new FormData();
    formData.append("message", message);
    try {
      const response = await SendMessage(formData);
      if (response) {
        toast.success("Message sent wait for response");
        window.history.replaceState({}, "", `/chat/${response?.data?.id}`);
        dispatch(setChatId(response?.data?.id));
        setMessage("");
      }
      dispatch(setChats(response?.data?.messages));
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
      setListening(false);

      setMessage("");
      setCaptions("");
    }
  };
  const handleContinueChat = async () => {
    const formData = new FormData();
    formData.append("message", message);
    if (chatId) {
      formData.append("chat_id", chatId);
    }
    try {
      const response = await SendMessage(formData);
      if (response) {
        toast.success("Message sent wait for response");
        setMessage("");
      }
      dispatch(setChats(response?.data?.messages));
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
      setListening(false);

      setMessage("");
      setCaptions("");
    }
  };

  const handleSendMessage = async (e?: ChangeEvent) => {
    setLoading(true);
    e?.preventDefault();
    if (chatId) {
      await handleContinueChat();
    } else {
      await handleStartChat();
    }
  };

  const readTextAloud = (text: string) => {
    if (!text.trim()) {
      toast.error("no text to be read aloud");
      return;
    }

    const textuttereance = new SpeechSynthesisUtterance(text);
    textuttereance.lang = "en-US";
    textuttereance.pitch = 1;
    textuttereance.rate = 1;
    textuttereance.volume = 1;

    window.speechSynthesis.speak(textuttereance);
  };
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // @ts-ignore
    formData.append("chatId", currentChatId);

    try {
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: file.type,
        };
      } else {
        const { error } = await response.json();
        toast.error(error.error || "Upload failed");
        throw new Error(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Network error or upload failed");
      throw error;
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Comprehensive upload error:", error);
        toast.error("Failed to upload files");
      } finally {
        setUploadQueue([]);
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [setAttachments]
  );
  const handleControlKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "f") {
      event.preventDefault();
      dispatch(setSearcModal(true));
    }
  };

  const isLoading = false;

  const handleEnterMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleCopy = async (str: string) => {
    const success = await copyToClipboard(str);
    if (success) {
      toast.success("text copied to clipboard");
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);
  useEffect(() => {
    window.addEventListener("keydown", handleControlKeyDown);

    return () => window.removeEventListener("keydown", handleControlKeyDown);
  }, []);

  console.log(uploadQueue);

  const handleShareChat = async (chatId: string) => {
    const shareUrl = await shareChat(chatId, "whatsapp");
    window.open(shareUrl, "_blank");
  };

  const removeAttachment = (attachmentToRemove: Attachment) => {
    setAttachments((currentAttachments) =>
      currentAttachments.filter(
        (attachment) => attachment.url !== attachmentToRemove.url
      )
    );
  };

  const semanticColors = (isDarkMode: boolean) => ({
    title: isDarkMode
      ? "text-blue-400 font-semibold text-xl"
      : "text-blue-700 font-semibold text-xl",
    subtitle: isDarkMode
      ? "text-purple-400 font-medium text-lg"
      : "text-purple-700 font-medium text-lg",
    caseTitle: isDarkMode
      ? "text-blue-400 font-semibold"
      : "text-blue-700 font-semibold",
    legalPrinciple: isDarkMode ? "text-emerald-400" : "text-emerald-700",
    citation: isDarkMode ? "text-purple-400 italic" : "text-purple-700 italic",
    conclusion: isDarkMode
      ? "text-rose-400 font-medium"
      : "text-rose-700 font-medium",
    warning: isDarkMode ? "text-amber-400" : "text-amber-700",
    emphasis: isDarkMode ? "text-indigo-400" : "text-indigo-700",
    procedural: isDarkMode ? "text-cyan-400" : "text-cyan-700",
    evidence: isDarkMode ? "text-teal-400" : "text-teal-700",
    statute: isDarkMode ? "text-violet-400" : "text-violet-700",
    default: isDarkMode ? "text-gray-100" : "text-gray-900",
  });

  const colors = semanticColors(darkmode);

  const legalPatterns = [
    {
      regex: /^#\s+(.+?)$/gm,
      className: colors.title,
      removeMarker: true,
    },
    {
      regex: /^#{2,}\s+(.+?)$/gm,
      className: colors.subtitle,
      removeMarker: true,
    },
    {
      regex:
        /(?:^|\n)(?:CASE:|IN THE MATTER OF:|SUIT NO:|APPEAL NO:)(.+?)(?:\n|$)/gi,
      className: colors.caseTitle,
    },
    {
      regex:
        /(?:^|\n)(?:PRINCIPLE:|LEGAL PRINCIPLE:|RATIO:|RATIO DECIDENDI:)(.+?)(?:\n|$)/gi,
      className: colors.legalPrinciple,
    },
    {
      regex: /\[([^\]]+)\]|\(([^\)]+)\)/g,
      className: colors.citation,
    },
    {
      regex:
        /(?:^|\n)(?:CONCLUSION:|JUDGMENT:|HOLDING:|ORDER:|DECISION:)(.+?)(?:\n|$)/gi,
      className: colors.conclusion,
    },
    {
      regex:
        /(?:^|\n)(?:WARNING:|IMPORTANT:|NOTE:|CAVEAT:|DISCLAIMER:)(.+?)(?:\n|$)/gi,
      className: colors.warning,
    },
    {
      regex: /(?:^|\n)(?:PROCEDURE:|PROCEEDINGS:|TIMELINE:)(.+?)(?:\n|$)/gi,
      className: colors.procedural,
    },
    {
      regex: /(?:^|\n)(?:EVIDENCE:|EXHIBITS:|PROOF:)(.+?)(?:\n|$)/gi,
      className: colors.evidence,
    },
    {
      regex: /(?:^|\n)(?:STATUTE:|SECTION:|LAW:|ACT:)(.+?)(?:\n|$)/gi,
      className: colors.statute,
    },
    {
      regex: /\*\*(.+?)\*\*/g,
      className: colors.emphasis,
    },
  ];

  const colorizeText = (text: string) => {
    if (!text) return null;

    const lines = text.split(/\n/);
    const processedLines = lines.map((line, index) => {
      if (!line.trim()) {
        return <div key={index} className="h-4" />;
      }

      let processedLine = line;
      let hasMatch = false;
      let className = colors.default;

      for (const {
        regex,
        className: patternClass,
        removeMarker,
      } of legalPatterns) {
        const matches = Array.from(line.matchAll(new RegExp(regex)));
        if (matches.length > 0) {
          hasMatch = true;
          matches.forEach((match) => {
            const content = match[1] || match[0];
            // Remove the markdown markers if removeMarker is true
            processedLine = removeMarker
              ? content
              : processedLine.replace(
                  match[0],
                  `<span class="${patternClass}">${content}</span>`
                );
          });
          className = patternClass;
        }
      }

      // Handle markdown-style formatting within colored text
      processedLine = processedLine
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/~~(.*?)~~/g, "<del>$1</del>");

      return (
        <div
          key={index}
          className={`${hasMatch ? "" : className} leading-relaxed py-1`}
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    });

    return <div className="space-y-1">{processedLines}</div>;
  };

  return (
    <div className="w-full pt-8 lg:px-16 px-7">
      {isFirstNewChat ? (
        <Onboarding username={user?.username} append={() => {}} />
      ) : (
        <div
          ref={chatContainerRef}
          className={`border-t ${
            darkmode ? "border-[#232627]" : ""
          } lg:pt-7 pt-16 lg:h-[500px] lg:max-h-[500px] h-[600px] max-h-[600px] pb-16 overflow-y-auto`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[18px] font-semibold  ${
                darkmode ? "text-gray-300" : "text-black"
              }`}
            >
              {"LexTech AI.0"}
            </span>
            <div className="flex items-center gap-x-4">
              <Tooltip title="Mark favorite">
                <div className="flex items-center justify-center hover:bg-white/10 w-[30px] h-[30px] rounded-md">
                  <Image
                    src={darkmode ? STAR_ICON_GRAY : STAR_ICON}
                    className="w-[26px] h-[26px] cursor-pointer"
                    alt=""
                  />
                </div>
              </Tooltip>
              <Tooltip title="Share">
                <div className="flex items-center justify-center hover:bg-white/10 w-[30px] h-[30px] rounded-md">
                  <Image
                    src={EXPO_SHARE}
                    className="w-[26px] h-[26px] cursor-pointer"
                    onClick={() => handleShareChat(chat_id!)}
                    alt=""
                  />
                </div>
              </Tooltip>

              <Menu>
                <Tooltip title="Options">
                  <MenuButton className="inline-flex items-center justify-center hover:bg-white/10 gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none   data-[focus]:outline-1 data-[focus]:outline-white">
                    {darkmode ? (
                      <FaEllipsisH
                        size={25}
                        color="#8B8B8B"
                        className="font-normal"
                      />
                    ) : (
                      <Image
                        src={DOTS}
                        className="w-[28px] h-[28px] cursor-pointer"
                        alt=""
                      />
                    )}
                  </MenuButton>
                </Tooltip>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className={`w-52 origin-top-right rounded-xl border border-white/5 ${
                    darkmode ? "bg-[#232627]" : "bg-white"
                  }  shadow-lg p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0`}
                >
                  <MenuItem>
                    <button
                      className={`group flex w-full text-[#6C7275] font-normal text-[15px] items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-white"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <Image
                        src={darkmode ? STAR_ICON_WHITE : STAR_ICON_}
                        className="w-[26px] h-[26px] cursor-pointer"
                        alt=""
                      />
                      Mark favorite
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className={`group flex w-full text-[#6C7275] font-normal text-[15px] items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-white"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <Image
                        src={darkmode ? DUPLICATE_ICON_WHITE : DUPLICATE_ICON}
                        className="w-[22px] h-[22px] cursor-pointer"
                        alt=""
                      />
                      Duplicate
                    </button>
                  </MenuItem>
                  <div className="my-1 h-px bg-white/5" />
                  <MenuItem>
                    <button
                      className={`group flex w-full text-[#6C7275] font-normal text-[15px] items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-white"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <Image
                        src={darkmode ? EXPO_SHARE_WHITE : EXPO_SHARE}
                        className="w-[22px] h-[22px] cursor-pointer"
                        alt=""
                      />
                      Share
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className={`group flex w-full text-[#6C7275] font-medium text-[15px] items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-red-500"
                          : "data-[focus]:bg-[#F3F5F7] text-red-500"
                      } `}
                    >
                      <Image
                        src={darkmode ? DELETE_ICON_RED : DELETE_ICON}
                        className="w-[26px] h-[26px] cursor-pointer"
                        alt=""
                      />
                      Delete
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
          {chats?.map(
            (mess: {
              sender: string;
              content: string;
              chat_id: string;
              id: string;
              created_at: string;
            }) => (
              <div className="flex flex-col gap-y-10 mt-8">
                {mess.sender === "user" ? (
                  <Fade
                    direction="up"
                    duration={500}
                    className="w-full flex flex-col items-end justify-end gap-y-2"
                  >
                    {/* <div className="flex items-center gap-x-1">
                    {mess.experimental_attachments !== undefined &&
                      mess.experimental_attachments.length > 0 &&
                      mess.experimental_attachments.map((file: any) => {
                        return (
                          <>
                            {file.contentType.startsWith("image") ? (
                              <Image
                                src={file.url}
                                width={100}
                                height={100}
                                className=" object-contain rounded-lg"
                                alt=""
                              />
                            ) : (
                              <div className="">
                                <FaFilePdf size={100} color="red" />
                              </div>
                            )}
                          </>
                        );
                      })}
                  </div> */}

                    <div
                      className={`px-4  py-3 ${
                        darkmode
                          ? "border-0 bg-[#232627]"
                          : "border border-[#E8ECEF] bg-none"
                      }  rounded-full h-full w-fit text-wrap`}
                    >
                      <span
                        className={`lg:text-[16px] text-sm font-semibold ${
                          darkmode ? "text-white/80" : "text-[#6E6E6E] "
                        } leading-relaxed`}
                      >
                        {mess.content}
                      </span>
                    </div>
                    <span className="lg:text-sm text-xs font-normal text-[#C9C9C9]">
                      {formatChatTime(mess?.created_at)}
                    </span>
                  </Fade>
                ) : (
                  <div className="w-full gap-y-2 flex items-start gap-x-2">
                    <Image
                      src={AI_PHOTO}
                      className="lg:w-[30px] lg:h-[30px] w-[25px] h-[25px] "
                      alt=""
                    />
                    <div
                      className="flex flex-col items-start gap-y-1"
                      onMouseEnter={() => setHoveredMessage(mess?.id)}
                      onMouseLeave={() => setHoveredMessage(null)}
                    >
                      <div className="px-4 rounded-xl h-full">
                        <span className="lg:text-[16px] text-sm font-normal text-[#6E6E6E]">
                          {colorizeText(mess.content)}
                        </span>
                      </div>

                      <div
                        className={`flex items-center gap-x-2 ml-3 ${
                          hoveredMessage === mess.id
                            ? "opacity-100"
                            : "opacity-0"
                        } text-white/30`}
                      >
                        <Tooltip title="Read aloud">
                          <span
                            className="flex items-center justify-center hover:bg-white/10 w-[30px] h-[30px] rounded-md"
                            onClick={() => readTextAloud(mess.content)}
                          >
                            <FaVolumeUp className="cursor-pointer " />
                          </span>
                        </Tooltip>
                        <Tooltip title="Copy">
                          <span
                            className="flex items-center justify-center hover:bg-white/10 w-[30px] h-[30px] rounded-md"
                            onClick={() => handleCopy(mess.content)}
                          >
                            <FaCopy className="cursor-pointer " />
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
          {/* {isThinking && (
            <div className="w-full flex items-start gap-x-3 relative gap-y-2 mt-5">
              <Image src={AI_PHOTO} className="w-[30px] h-[30px] " alt="" />
              <div className="px-4  rounded-xl h-full">
                <span className="text-[18px] font-semibold text-[#6E6E6E]">
                  <PulseLoader size={isMobile ? 8 : 11} color="#5E5E5E" />
                </span>
              </div>
            </div>
          )} */}
          <div ref={messagesEndRef} />
        </div>
      )}

      {isMobile ? (
        <div className="fixed bottom-0 px-6 pb-10 bg-white w-full h-[150px] left-0">
          <div className="w-full relative border-2 py-2 overflow-hidden border-[#E8ECEF] rounded-2xl flex flex-col items-center h-auto mt-9 px-3">
            <textarea
              name=""
              placeholder="Type a message..."
              rows={1}
              // onKeyDown={handleEnterMessage}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(e.target.value)
              }
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="w-full resize-none outline-none bg-transparent px-3 py-1"
            />

            <div className="w-full flex items-center justify-between">
              <button
                // @ts-ignore
                onClick={() => document.querySelector(".file_upload")?.click()}
              >
                <Image
                  src={ADD_ICON}
                  className="lg:w-[28px] lg:h-[28px] w-[25px] h-[25px]"
                  alt="Add Icon"
                />
              </button>
              <input
                type="file"
                accept=""
                multiple
                onChange={handleFileChange}
                className="file_upload sr-only"
              />

              {loading ? (
                <div
                  onClick={() => stop()}
                  className="border cursor-pointer border-gray-300 rounded-md flex items-center justify-center"
                >
                  <PulseLoader size={14} />
                </div>
              ) : (
                <button type="button">
                  <Image
                    src={SENDER}
                    className={`lg:w-[35px] lg:h-[35px] w-[25px] h-[25px] ${
                      !message.trim() && "opacity-50"
                    }`}
                    alt="Sender Icon"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Fade
          direction="up"
          duration={2000}
          className={`fixed bottom-0 h-fit ${
            darkmode ? "bg-[#141718]" : "bg-[#fbfcfe]"
          } `}
        >
          <div
            className={`${
              open ? "w-[690px]" : "w-[850px]"
            } mb-7 relative border-2 py-2 overflow-hidden ${
              darkmode ? "border-[#343839]" : "border-[#E8ECEF]"
            }   rounded-2xl flex flex-col items-center h-auto mt-16 px-3`}
          >
            <>
              {(attachments.length > 0 || uploadQueue.length > 0) && (
                <div className="flex flex-row gap-2">
                  {attachments.map((attachment) => (
                    <PreviewAttachment
                      key={attachment.url}
                      attachment={attachment}
                      onRemove={() => removeAttachment(attachment)}
                    />
                  ))}

                  {uploadQueue.map((filename) => (
                    <PreviewAttachment
                      key={filename}
                      attachment={{
                        url: "",
                        name: filename,
                        contentType: "",
                      }}
                      isUploading={true}
                    />
                  ))}
                </div>
              )}
            </>
            <textarea
              name=""
              placeholder={placeHolder}
              rows={1}
              onKeyDown={handleEnterMessage}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(e.target.value)
              }
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className={`w-full resize-none outline-none bg-transparent px-3 py-1 ${
                darkmode ? "text-gray-300" : "text-black"
              }`}
            />

            <div className="w-full flex items-center justify-between">
              <Menu>
                <MenuButton className="inline-flex -ml-4 items-start  gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none   data-[focus]:outline-1 data-[focus]:outline-white">
                  <Tooltip title="Attach files">
                    <Image
                      src={ADD_ICON}
                      onClick={() => {}}
                      className="w-[28px] h-[28px] "
                      alt="Add Icon"
                    />
                  </Tooltip>
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom start"
                  className={`w-52 origin-top-right rounded-xl border border-white/5 ${
                    darkmode ? "bg-[#232627]" : "bg-white"
                  }  shadow-lg p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0`}
                >
                  <MenuItem>
                    <button
                      onClick={() => imageInputRef?.current?.click()}
                      className={`group flex w-full text-[#6C7275] font-normal text-sm items-center gap-2 rounded-lg py-2 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-white"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <FaImage size={16} color={"#007AFF"} />
                      Upload image
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => fileInputRef?.current?.click()}
                      className={`group flex w-full text-[#6C7275] font-normal text-sm items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-white"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <FaFilePdf size={16} color={"red"} />
                      Upload document
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
              <input
                type="file"
                accept="/image*"
                ref={imageInputRef}
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />
              {isLoading ? (
                <div
                  onClick={() => stop()}
                  className="border cursor-pointer border-gray-300 rounded-md flex items-center justify-center"
                >
                  <StopIcon size={17} />
                </div>
              ) : (
                <>
                  {!message.trim() ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        listening ? stopListening() : startListening();
                      }}
                    >
                      {listening ? (
                        <div className="flex space-x-1">
                          <span className="w-1 h-4 bg-blue-500 animate-bounce rounded-full"></span>
                          <span className="w-1 h-6 bg-blue-500 animate-bounce delay-75 rounded-full"></span>
                          <span className="w-1 h-8 bg-blue-500 animate-bounce delay-150 rounded-full"></span>
                          <span className="w-1 h-6 bg-blue-500 animate-bounce delay-75 rounded-full"></span>
                          <span className="w-1 h-4 bg-blue-500 animate-bounce delay-150 rounded-full"></span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center hover:bg-white/10 rounded-full w-[45px] h-[45px]">
                          <Image
                            src={SPEAKER}
                            className={`w-[35px] h-[35px] `}
                            alt="Sender Icon"
                          />
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                    >
                      <Image
                        src={SENDER}
                        className={`w-[35px] h-[35px] `}
                        alt="Sender Icon"
                      />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </Fade>
      )}

      {liveCaption && (
        <motion.div
          initial={{ opacity: 0, translateY: 50, translateX: 50 }}
          animate={{ opacity: 1, translateY: 0, translateX: 0 }}
          exit={{ opacity: 0, translateY: 50, translateX: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-xs w-full flex justify-between items-center"
        >
          <p className="text-sm">
            Live caption:{" "}
            <span className="font-semibold">
              {captions || "Captions would display here..."}
            </span>
          </p>
          <button
            onClick={() => {
              dispatch(setLiveCaption(false));
              setCaptions("");
            }}
            className="text-gray-400 hover:text-white ml-4"
            aria-label="Close"
          >
            ✖
          </button>
        </motion.div>
      )}
    </div>
  );
}
