"use client";
import * as z from "zod";
import { register as Register } from "@/lib/actions/register";
import { RegisterSchema } from "@/lib/schemas";
import ButtonV2 from "@/shared/components/buttonV2";
import { LOGO_V2 } from "@/utils-func/image_exports";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState, useTransition } from "react";
import { Bounce, Fade } from "react-awesome-reveal";
import toast from "react-hot-toast";
import { FaEye, FaCheck, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "@/app/api/auth/[...nextauth]/auth";
import { RegisterForm } from "@/components/Auth/register-form";
import { Session } from "next-auth";
import { RegisterApi } from "@/services/auth/auth.service";
import { RegisTerTypes } from "@/services/auth/type";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

function Signup() {
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, watch } = useForm<
    z.infer<typeof RegisterSchema>
  >({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setValue(name as keyof RegisterFormValues, value, { shouldValidate: true });
  };

  // const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
  //   startTransition(() => {
  //     Register(data).then((data) => {
  //       if (data.error) {
  //         toast.error(data.error);
  //         setLoading(false);
  //         return;
  //       }
  //       toast.success(data.success!);
  //       setFormData({
  //         firstName: "",
  //         lastName: "",
  //         email: "",
  //         password: "",
  //         confirmPassword: "",
  //       });
  //       setIsChecked(false);

  //       router.push("/sign-in");
  //     });
  //   });
  // };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const payload: RegisTerTypes = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    };
    try {
      const response = await RegisterApi(payload);
      if (response) {
        toast.success(response?.data?.message, {
          duration: 10000,
        });

        router.replace("/sign-in");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsChecked(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-start w-full">
      <div className="w-full flex flex-col items-center justify-center p-10 h-[700px] max-h-[700px] overflow-y-scroll">
        <Fade direction="down" className="w-full mt-10">
          <Image src={LOGO_V2} className="w-[221px] h-[41px]" alt="" />
        </Fade>
        <Bounce className="w-full">
          <div className="w-full lg:px-16 px-0 mt-10">
            <span className="text-black text-[32px] font-medium">
              Get Started Now
            </span>
            <form
              onSubmit={handleRegister}
              className="flex flex-col gap-y-3 mt-2"
            >
              <div className="flex items-start gap-y-1 flex-col">
                <span>First Name</span>
                <input
                  type="text"
                  {...register("firstName")}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="text-sm placeholder:text-sm placeholder:font-medium font-medium placeholder:text-[#D9D9D9] w-full rounded-lg border border-[#D9D9D9] p-3 outline-none"
                />
              </div>
              <div className="flex items-start gap-y-1 flex-col">
                <span>Last Name</span>
                <input
                  type="text"
                  {...register("lastName")}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="text-sm placeholder:text-sm placeholder:font-medium font-medium placeholder:text-[#D9D9D9] w-full rounded-lg border border-[#D9D9D9] p-3 outline-none"
                />
              </div>
              <div className="flex items-start gap-y-1 flex-col">
                <span>Email address</span>
                <input
                  type="email"
                  {...register("email")}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="text-sm placeholder:text-sm placeholder:font-medium font-medium placeholder:text-[#D9D9D9] w-full rounded-lg border border-[#D9D9D9] p-3 outline-none"
                />
              </div>
              <div className="flex items-start gap-y-1 flex-col">
                <span>Password</span>
                <div className="flex justify-between items-center w-full rounded-lg border  border-[#D9D9D9] p-3">
                  <input
                    type={showPassword1 ? "text" : "password"}
                    {...register("password")}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="........."
                    className="text-sm placeholder:text-sm placeholder:font-medium font-medium placeholder:text-[#D9D9D9] w-full outline-none"
                  />
                  {showPassword1 ? (
                    <FaEyeSlash
                      size={15}
                      className="text-gray-300 cursor-pointer"
                      onClick={() => setShowPassword1(false)}
                    />
                  ) : (
                    <FaEye
                      size={15}
                      className="text-gray-300 cursor-pointer"
                      onClick={() => setShowPassword1(true)}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-start gap-y-1 flex-col">
                <span>Confirm Password</span>
                <div className="flex justify-between items-center w-full rounded-lg border  border-[#D9D9D9] p-3">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    {...register("confirmPassword")}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="........."
                    className="text-sm placeholder:text-sm placeholder:font-medium font-medium placeholder:text-[#D9D9D9] w-full outline-none"
                  />
                  {showPassword2 ? (
                    <FaEyeSlash
                      size={15}
                      className="text-gray-300 cursor-pointer"
                      onClick={() => setShowPassword2(false)}
                    />
                  ) : (
                    <FaEye
                      size={15}
                      className="text-gray-300 cursor-pointer"
                      onClick={() => setShowPassword2(true)}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-2 mt-4">
                <div
                  className="flex items-center border border-black justify-center w-[12px] h-[12px] rounded cursor-pointer"
                  onClick={() => setIsChecked((prev) => !prev)}
                >
                  {isChecked && <FaCheck size={7} color="#000000" />}
                </div>
                <span className="text-xs font-medium text-black">
                  I agree to the terms & policy
                </span>
              </div>

              <div className="flex items-center mt-4 flex-col gap-y-3 w-full">
                <ButtonV2
                  type="submit"
                  title="Signup"
                  disabled={loading || !isChecked}
                  btnStyle="bg-[#141718] w-full rounded-lg py-3"
                  textStyle="text-white font-medium text-sm"
                  handleClick={() => {}}
                  loading={loading}
                />
                <span className="text-sm font-medium">
                  Have an account?{" "}
                  <span
                    className="text-[#0F3DDE] cursor-pointer"
                    onClick={() => router.push("/login")}
                  >
                    Sign in
                  </span>
                </span>
              </div>
            </form>
          </div>
        </Bounce>
      </div>
      <Fade direction="right" className="w-full lg:flex hidden">
        <div className="bg-[#E4F4FF] bg-court w-full h-screen bg-contain bg-no-repeat bg-center rounded-tl-3xl rounded-bl-3xl"></div>
      </Fade>
    </div>
  );
}

export default Signup;
