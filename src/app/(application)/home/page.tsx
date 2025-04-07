import { redirect } from "next/navigation";

import { auth } from '~/server/auth'
import HomeContent from "~/app/_components/home_content";

export default async function Home() {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    return <HomeContent />
}
