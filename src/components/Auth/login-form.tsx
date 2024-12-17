'use client'
import { CardWrapper } from "./card-wrapper"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema } from "@/lib/schemas"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react" // Import eye icons
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../Toast/form-error"
import { FormSuccess } from "../Toast/form-success"
import { login } from "@/lib/actions/login"
import { useState, useTransition } from "react"
import Link from "next/link"

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [showPassword, setShowPassword] = useState(false)
    const SearchParams = useSearchParams()
    const urlError = SearchParams?.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider" : ""

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const handleSubmit = (data: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            login(data)
            .then((data) => {
                if (data?.error) {
                    setError(data.error)
                    return
                }
                setSuccess(data?.success)
                form.reset()
            })
        })
    }

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <CardWrapper 
        headerLabel="Login to LexTech Assistant "
        backButtonLabel="Don't have an account?"
        backButtonHref="/sign-up"
        showSocial>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    autoComplete="email"
                                    {...field}
                                    disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="******"
                                        {...field}
                                        disabled={isPending}
                                        />
                                        <button 
                                            type="button"
                                            onClick={togglePassword}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <Button
                                size={"sm"}
                                variant="link"
                                asChild
                                className="px-0 font-normal">
                                    <Link href={"/forgot-password"}>
                                        Forgot Password
                                    </Link>
                                </Button>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    {error && <FormError message={error || urlError} />}
                    {success && <FormSuccess message={success} />}
                    <Button type="submit" className="w-full" disabled={isPending}>
                       
                        {isPending ? "Submitting..." : " Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}