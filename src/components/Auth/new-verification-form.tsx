"use client"

import { CardWrapper } from "./card-wrapper"
import { BeatLoader } from 'react-spinners'
import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/lib/actions/new-verification"
import { FormError } from "../Toast/form-error"
import { FormSuccess } from "../Toast/form-success"

export const NewVerificationForm = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [errors, setErrors] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [countdown, setCountdown] = useState(5)

    const token = searchParams?.get("token")

    useEffect(() => {
        if (success) {
            setIsRedirecting(true)
            
            // Countdown timer
            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval)
                    }
                    return prev - 1
                })
            }, 1000)

            // Redirect after 5 seconds
            const redirectTimeout = setTimeout(() => {
                router.push("/sign-in")
            }, 5000)

            // Cleanup
            return () => {
                clearTimeout(redirectTimeout)
                clearInterval(countdownInterval)
            }
        }
    }, [success, router])

    const onSubmit = useCallback(() => {
        if (success || errors) return

        if (!token) {
            setErrors("Missing token")
            return
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success)
                setErrors(data.error)
            })
            .catch(() => {
                setErrors("Something went wrong")
            })
    }, [token, success, errors])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to login"
            backButtonHref="/sign-in"
        >
            <div className="flex flex-col items-center justify-center w-full gap-2">
                {!success && !errors && (
                    <div className="transition-all duration-500 ease-in-out">
                        <BeatLoader color="#10A37F" />
                    </div>
                )}
                {success && (
                    <div className="space-y-2 transition-all duration-500 ease-in-out">
                        <FormSuccess message={success} />
                        {isRedirecting && (
                            <p className="text-sm text-muted-foreground animate-pulse">
                                Redirecting to signIn in {countdown} seconds...
                            </p>
                        )}
                    </div>
                )}
                {errors && !success && (
                    <div className="transition-all duration-500 ease-in-out">
                        <FormError message={errors} />
                    </div>
                )}
            </div>
        </CardWrapper>
    )
}