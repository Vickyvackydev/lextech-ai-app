/* eslint-disable react/no-unused-prop-types */
import Image from "next/image";
import React, { MouseEventHandler } from "react";
import { PulseLoader } from "react-spinners";

interface Props {
  title: string;
  btnStyle: string;
  disabled?: any;
  icon?: any;
  iconStyle?: string;
  textStyle: string;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  image?: any;
  imageSize?: string;
  loading?: boolean;
  type?: "submit" | "button";
}
const ButtonV2 = ({
  title,
  disabled,
  btnStyle,
  icon,
  iconStyle,
  textStyle,
  handleClick,
  image,
  imageSize,
  loading,
  type,
}: Props) => (
  <button
    className={`${btnStyle} hover:scale-105 transition-all duration-300 ${
      disabled && "bg-opacity-75"
    }`}
    disabled={disabled}
    onClick={handleClick}
    type={type}
  >
    {loading ? (
      // <svg
      //   className="w-5 h-5  text-black animate-spin"
      //   fill="none"
      //   viewBox="0 0 24 24"
      //   xmlns="http://www.w3.org/2000/svg"
      // >
      //   <circle
      //     className="opacity-25"
      //     cx={12}
      //     cy={12}
      //     r={10}
      //     stroke="#fff"
      //     strokeWidth={4}
      //   />
      //   <path
      //     className="opacity-75"
      //     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      //     fill="#fff"
      //   />
      // </svg>
      <PulseLoader color="#ffffff" size={14} />
    ) : (
      <span className={textStyle}>{title}</span>
    )}

    {image ? (
      <Image alt="" src={image} className={imageSize} />
    ) : (
      <span className={iconStyle}>{icon}</span>
    )}
  </button>
);

export default ButtonV2;
