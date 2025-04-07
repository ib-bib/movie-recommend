import { BottomNav } from "~/app/_components/bot_nav";

export default function AppLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>
        {children}
        <BottomNav />
    </>
}