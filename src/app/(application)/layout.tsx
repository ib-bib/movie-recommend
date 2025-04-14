import { BottomNav } from "~/app/_components/bot_nav";
import { Toaster } from 'sonner'

export default function AppLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>
        {children}
        <BottomNav />
        <Toaster />
    </>
}