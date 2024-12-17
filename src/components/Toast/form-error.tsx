import {ExclamationTriangleIcon} from "@radix-ui/react-icons"



interface FormErrorProps {
    message: string
}



export const FormError = ({message}: FormErrorProps) => {
    return (
        <div className="flex items-center gap-x-2 bg-destructive/15 p-3 rounded-md text-sm text-destructive">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <p >{message}</p>
        </div>
    )
}   