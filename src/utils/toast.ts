import { toast } from "sonner";

export const notifySuccess = (msg: string) =>
    toast.success(msg, { duration: 3000 });

export const notifyError = (msg: string) =>
    toast.error(msg, { duration: 3000 });

export const notifyInfo = (msg: string) =>
    toast(msg, { duration: 3000 });

export const notifyWarning = (msg: string) =>
    toast.warning(msg, { duration: 4000 });
