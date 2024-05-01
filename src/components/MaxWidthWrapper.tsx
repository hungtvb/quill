import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({className, children} : {
    className?: string,
    children: ReactNode
}) => {

    return (
        <div className={cn("mx-auto w-full max-w-screen-xl px-2.6 md:px-20", className)}>
            {children}
        </div>
    )
}

export default MaxWidthWrapper;