import {CheckCircledIcon} from "@radix-ui/react-icons"



interface FormSuccessProps {
    message: string
}



export const FormSuccess = ({message}: FormSuccessProps) => {
    return (
        <div className="flex items-center gap-x-2 bg-emerald-500/15 p-3 rounded-md text-sm text-emerald-500">
            <CheckCircledIcon className="w-4 h-4" />
            <p >{message}</p>
        </div>
    )
}   