'use client'
import { CardWrapper } from "./card-wrapper"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { NewPasswordSchema } from "@/lib/schemas"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
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
import { newPassword } from "@/lib/actions/new-password"
import { useRouter, useSearchParams } from "next/navigation"

export const NewPasswordForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false) // For toggling confirm password visibility
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const router = useRouter()
    
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "", // Add confirmPassword here
        }
    });

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            newPassword(data, token)
            .then((data) => {
                if (data?.error) {
                    setError(data.error)
                    return
                }
                setSuccess(data?.success)
                form.reset()
                router.push("/sign-in")
            })
        })
    }

    return (
        <CardWrapper 
        headerLabel="Enter your new password"
        backButtonLabel="Back to login"
        backButtonHref="/sign-in">
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6">
                    <div className="space-y-4">
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
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        {/* Confirm Password Field */}
                        <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="******"
                                        {...field}
                                        disabled={isPending}
                                        />
                                        <button 
                                            type="button"
                                            onClick={toggleConfirmPassword}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                    </div>
                    {error && <FormError message={error} />}
                    {success && <FormSuccess message={success} />}
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Submitting..." : "Reset Password"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
