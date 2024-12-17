///home/josephhenry/Downloads/project/legal assitant/src/components/custom/multimodal-input.tsx

"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import { toast } from "sonner";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import useWindowSize from "./use-window-size";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
// import { useSidebar } from '@/components/ui/sidebar';

const suggestedActions = [
  {
    title: "Case Law Analysis",
    label: "Analyze precedents and case outcomes",
    action:
      "Help me analyze the precedents set by the Supreme Court of Nigeria in Amaechi v. INEC (2008) regarding pre-election matters and the rights of political parties in candidate selection.",
  },
  {
    title: "Document Review",
    label: "Review and summarize legal documents",
    action:
      "Can you review this contract agreement and assess its validity under Nigerian Contract Law, particularly focusing on the elements of offer, acceptance, consideration and capacity?",
  },
  {
    title: "Legal Research",
    label: "Research specific legal topics",
    action:
      "Research the legal implications of cybercrime under the Nigerian Cybercrime Act 2015, specifically focusing on electronic fraud and the prescribed penalties.",
  },
  {
    title: "Draft Summary",
    label: "Create legal document summaries",
    action:
      "Create a summary of this case involving a land dispute in Lagos State, analyzing it under the Land Use Act and relevant property laws in Nigeria.",
  },
];

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  append,
  handleSubmit,
  currentChatId,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  currentChatId: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  // const { isMobile } = useSidebar();
  const [maxHeight, setMaxHeight] = useState<number>(400);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [input]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      const clientHeight = textareaRef.current.clientHeight;

      if (scrollHeight > clientHeight) {
        setMaxHeight(Math.min(scrollHeight, 400));
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflow = "auto";
      } else {
        setMaxHeight(200);
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.overflow = "hidden";
      }
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflow = "hidden";
    }

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, setInput, width]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
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
        throw new Error(`Upload failed: ${error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
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
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments]
  );
  const isMobile = true;
  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {suggestedActions
              .slice(0, isMobile ? 2 : 4)
              .map((suggestedAction, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.05 * index }}
                  key={index}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      append({
                        role: "user",
                        content: suggestedAction.action,
                      });
                    }}
                    className="text-left border rounded-xl px-4 py-3.5 text-sm w-full h-auto flex flex-col items-start gap-1.5 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-base">
                      {suggestedAction.title}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {suggestedAction.label}
                    </span>
                  </Button>
                </motion.div>
              ))}
          </div>
        )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
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

      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className="min-h-[24px] max-h-[400px] overflow-auto resize-none rounded-xl p-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-muted border-none"
        style={{
          height: "auto",
          maxHeight: `${maxHeight}px`,
        }}
        rows={3}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error("Please wait for the model to finish its response!");
            } else {
              submitForm();
            }
          }
        }}
      />

      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5"
          onClick={(event) => {
            event.preventDefault();
            stop();
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={input.length === 0 || uploadQueue.length > 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}

      <Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 right-10 m-0.5 dark:border-zinc-700"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        variant="outline"
        disabled={isLoading}
      >
        <PaperclipIcon size={14} />
      </Button>
    </div>
  );
}
