'use server'

import { redirect } from 'next/navigation'
import { auth } from "~/server/auth";
import HomeContent from '~/app/_components/home/home_content';

export default async function Index() {

  const session = await auth();

  if (session?.user) {
    redirect('/home')
  }

  return <HomeContent />;
}
