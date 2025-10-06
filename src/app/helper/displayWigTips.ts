import { wigTips } from "@/app/lib/tips";

export const displayWigTips = () => {
    const tipIndex = Math.floor(Math.random() * wigTips.length);
    return wigTips[tipIndex];
} 