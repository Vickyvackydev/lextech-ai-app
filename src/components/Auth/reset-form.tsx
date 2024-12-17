'use client'
import { CardWrapper } from "./card-wrapper"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetSchema } from "@/lib/schemas"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
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
import { reset } from "@/lib/actions/reset"

export const ResetForm = () => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    });

    const handleSubmit = (data: z.infer<typeof ResetSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            reset(data)
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

    return (
        <CardWrapper 
        headerLabel="Forgot your password"
        backButtonLabel="Back to login"
        backButtonHref="/sign-in">
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
                    </div>
                    {error && <FormError message={error} />}
                    {success && <FormSuccess message={success} />}
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Sending..." : "Send reset link"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
