import { CardWrapper } from "./card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";



export const ErrorCard = () => {
    return (
        <CardWrapper
        headerLabel="Oops! Something went wrong"
        backButtonHref="/login"
        backButtonLabel="Back to login"
        >
            <div className="flex items-center justify-center w-full">
                <ExclamationTriangleIcon className="w-6 h-6 text-destructive"/>
            </div>
        </CardWrapper>
    );
}