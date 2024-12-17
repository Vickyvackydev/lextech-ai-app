import React from "react";

import ButtonV2 from "@/shared/components/buttonV2";
import ModalV2 from "@/shared/components/modalV2";

interface Props {
  open: boolean;
  close: () => void;
  title: string;
  text: string;
  buttontext: string;
}
const SuccessModal = ({ open, close, title, text, buttontext }: Props) => (
  <ModalV2
    edges="rounded-md"
    isBTnTrue={false}
    isClose={close}
    isOpen={open}
    maxWidth="w-[330px]"
  >
    <div className="flex flex-col gap-5">
      <span className="text-xl text-darkblue  ">{title}</span>
      <hr />
      <div className="w-full px-7 text-center">
        <span className="text-sm text-[#4C596F]">{text}</span>
      </div>

      <div className="">
        <ButtonV2
          btnStyle="w-full bg-darkblue h-[7vh]"
          handleClick={close}
          textStyle="text-white font-medium"
          title={buttontext}
        />
      </div>
    </div>
  </ModalV2>
);

export default SuccessModal;
