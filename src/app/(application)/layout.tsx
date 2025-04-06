import { BottomNav } from "../_components/nav";

export default function AppLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <main className="flex flex-col grow w-full justify-between items-center pt-2 pb-4">
        {children}
        <BottomNav />
    </main>
}