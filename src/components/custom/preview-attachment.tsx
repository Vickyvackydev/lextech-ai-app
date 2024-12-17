import { Attachment } from "ai";
import { LoaderIcon } from "./icons";
import { MdClose } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  onRemove?: () => void;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div className="flex flex-col gap-2 max-w-16">
      <div className="w-20 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {contentType ? (
          contentType.startsWith("image") ? (
            // NOTE: it is recommended to use next/image for images
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={name ?? "An image attachment"}
              className="rounded-md size-full object-cover"
            />
          ) : (
            <div className="">
              <FaFilePdf size={30} color="red" />
            </div>
          )
        ) : (
          <div className=""></div>
        )}

        {isUploading && (
          <div className="animate-spin absolute text-zinc-500">
            <LoaderIcon />
          </div>
        )}

        {/* X Icon for removing the attachment */}
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          aria-label="Remove attachment"
        >
          <MdClose size={16} className="text-black" />
        </button>
      </div>
      <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
    </div>
  );
};
