/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import React, { Fragment } from "react";
import { FaTimes } from "react-icons/fa";

type ModalProps = {
  // state modal params types
  isOpen: boolean;
  isClose: () => void;

  children: React.ReactNode;
  maxWidth: string;
  isBTnTrue?: boolean;
  edges: string;
};

// Modal component reusable in all component
const Modal = ({
  isOpen,
  isClose,
  children,
  edges,
  maxWidth,
  isBTnTrue,
}: ModalProps) => (
  <Transition appear as={Fragment} show={isOpen}>
    <Dialog as="div" className="relative z-50" onClose={isClose}>
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full justify-center items-center p-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="transition-transform ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition-transform ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel
              className={` ${maxWidth} transform overflow-hidden flex flex-col items-end gap-3 ${edges} text-center bg-white dark:bg-bg_black lg:p-6 p-3 align-middle shadow-xl transition-all h-full`}
            >
              {isBTnTrue === true ? (
                <button
                  className={`flex items-center justify-center  bg-darkblue text-white w-7 h-7 rounded-full hover:scale-90 transition-all `}
                  onClick={isClose}
                  type="button"
                >
                  <FaTimes />
                </button>
              ) : null}
              <div className="mt-2 max-h-[500px] overflow-y-scroll w-full lg:overflow-x-auto overflow-x-hidden">
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default Modal;

// end..
