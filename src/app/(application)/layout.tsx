import { BottomNav } from "~/app/_components/bot_nav";
import { Toaster } from 'sonner'
import { HydrateClient, api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    if (session?.user) {
        void api.movie.getMyMostRecent4Recommendations.prefetch()
    } else {
        redirect('/api/auth/signin')
    }

    return <HydrateClient>
        {children}
        <BottomNav />
        <Toaster richColors closeButton />
    </HydrateClient>
}