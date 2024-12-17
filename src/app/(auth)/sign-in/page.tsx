"use client";
import * as z from "zod";
import { login } from "@/lib/actions/login";
import ButtonV2 from "@/shared/components/buttonV2";
import { LOGO_V2 } from "@/utils-func/image_exports";
import Image from "next/image";
import { LoginSchema } from "@/lib/schemas";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useTransition, useState, FormEvent } from "react";
import { Bounce, Fade } from "react-awesome-reveal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "@/app/api/auth/[...nextauth]/auth";
import { LoginForm } from "@/components/Auth/login-form";
import { Session } from "next-auth";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginTypes } from "@/services/auth/type";
import { LoginApi } from "@/services/auth/auth.service";
import { setToken, setUser } from "@/states/slices/authReducer";
import { useAppDispatch } from "@/hooks";

// export default function SignIn() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//    <LoginForm />
//    </Suspense>

// //   )
// // }
type LoginFormValues = z.infer<typeof LoginSchema>;
function SignIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const SearchParams = useSearchParams();
  const urlError =
    SearchParams?.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, watch } = useForm<
    z.infer<typeof LoginSchema>
  >({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setValue(name as keyof LoginFormValues, value, { shouldValidate: true });
  };
  // const onSubmit = (data: z.infer<typeof LoginSchema>) => {
  //   startTransition(() => {
  //     login(data).then((data) => {
  //       if (data?.error) {
  //         toast.error(data?.error || urlError);

  //         return;
  //       }
  //       toast.success(data?.success! || "Successfully logged in");
  //       setFormData({
  //         email: "",
  //         password: "",
  //       });

  //       // router.push("/sign-in")
  //     });
  //   });
  // };
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const payload: LoginTypes = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await LoginApi(payload);
      if (response) {
        toast.success(response?.data?.message, {
          duration: 10000,
        });
        console.log(response);
        dispatch(setUser(response?.data));
        dispatch(setToken(response?.data?.token));

        router.replace("/");
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start w-full">
      <div className="w-full flex flex-col items-center justify-center p-10 h-[700px] max-h-[700px] overflow-y-scroll">
        <Bounce className="w-full lg:px-16 px-0 mt-10">
          <div className="flex flex-col gap-y-3">
            <span className="text-black text-[32px] font-medium">
              Welcome back!
            </span>
            <span className="text-black text-[16px] font-medium">
              Enter your Credentials to access your account
            </span>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-y-5 mt-16">
            <div className="flex items-start gap-y-1 flex-col">
              <span>Email address</span>
              <input
                type="email"
                {...register("email")}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="text-sm placeholder:text-sm placeholder:font-medium font-medium placeholder:text-[#D9D9D9] w-full rounded-lg border border-[#D9D9D9] p-3 outline-none"
              />
            </div>
            <div className="flex items-start gap-y-1 flex-col">
              <span>Password</span>
              <div className="flex justify-between items-center w-full rounded-lg border  border-[#D9D9D9] p-3">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  onChange={handleInputChange}
                  placeholder="........."
                  className="text-sm placeholder:text-sm placeholder:font-medium font-medium placeholder:text-[#D9D9D9] w-full outline-none"
                />
                {showPassword ? (
                  <FaEyeSlash
                    size={15}
                    className="text-gray-300 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    size={15}
                    className="text-gray-300 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center mt-4 flex-col gap-y-6 w-full">
              <ButtonV2
                title="Login"
                type="submit"
                disabled={loading}
                loading={loading}
                btnStyle="bg-[#141718] w-full rounded-lg py-3"
                textStyle="text-white font-medium text-sm"
                handleClick={() => {}}
              />
              <span className="text-sm font-medium">
                Don't an account?{" "}
                <span
                  className="text-[#0F3DDE] cursor-pointer"
                  onClick={() => router.push("/sign-up")}
                >
                  Sign up
                </span>
              </span>
            </div>
          </form>
        </Bounce>
      </div>
      <Fade direction="right" className="w-full lg:flex hidden">
        <div className="bg-[#E4F4FF] bg-court w-full h-screen bg-contain bg-no-repeat bg-center rounded-tl-3xl rounded-bl-3xl"></div>
      </Fade>
    </div>
  );
}

export default SignIn;

//update login.tsx and auth.ts by removing the commented part of emailverified code so that it can only accept verified users. Also update the social.tsx component to only show google by turning the show state to true.
