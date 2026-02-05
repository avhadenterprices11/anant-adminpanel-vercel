import { Toaster } from "sonner";
import type { FC, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const ToastProvider: FC<Props> = ({ children }) => {
    return (
        <>
            {children}
            <Toaster
                position="bottom-right"
                richColors
                closeButton
                theme="light"
            />
        </>
    );
};

export { ToastProvider };
