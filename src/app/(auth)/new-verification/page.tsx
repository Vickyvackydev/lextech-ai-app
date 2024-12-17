import { NewVerificationForm } from "@/components/Auth/new-verification-form";
import { Suspense } from "react";

export default function NewVerification() {
    return (
        <div>
             <Suspense fallback={<div>Loading...</div>}>
           <NewVerificationForm />
           </Suspense>
        </div>
    )}