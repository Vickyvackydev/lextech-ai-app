/* eslint-disable jsx-a11y/control-has-associated-label */
"use client";
import { useAppSelector } from "@/hooks";
import { selectDarkmode } from "@/states/slices/globalReducer";
import { CLOSE_BTN } from "@/utils-func/image_exports";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment } from "react";

type ModalProps = {
  // state modal params types
  isOpen: boolean;
  isClose: () => void;
  padding?: boolean;
  children: React.ReactNode;
  maxWidth: string;
  isBTnTrue?: boolean;
  edges: string;
};

// Modal component reusable in all component
const ModalV2 = ({
  isOpen,
  isClose,
  children,
  padding,
  maxWidth,
  isBTnTrue,
  edges,
}: ModalProps) => {
  const darkmode = useAppSelector(selectDarkmode);
  return (
    <Transition appear as={Fragment} show={isOpen}>
      <Dialog as="div" className="relative z-50" onClose={isClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full justify-center items-center  text-center">
            <Transition.Child
              as={Fragment}
              enter="transition-transform ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transition-transform ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel
                className={` ${maxWidth} transform overflow-hidden ${edges} flex items-end flex-col ${
                  padding && "p-3"
                } ${
                  darkmode ? "bg-[#141718]" : "bg-white"
                } justify-end text-center   align-middle shadow-xl transition-all h-full`}
              >
                {isBTnTrue === true ? (
                  <button
                    className={`  hover:scale-90 transition-all `}
                    onClick={isClose}
                    type="button"
                  >
                    <Image
                      src={CLOSE_BTN}
                      className="w-[44.24px] h-[44.24px]"
                      alt=""
                    />
                  </button>
                ) : null}
                <div className=" w-full mt-2 max-h-[500px] overflow-y-scroll overscroll-x-none ">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalV2;

// end..
