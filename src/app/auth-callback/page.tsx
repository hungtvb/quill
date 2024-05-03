'use client'


import { redirect, useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

const Page = () => {

  return (
    <Suspense>
      <AuthCallback/>
    </Suspense>
  )
}

const AuthCallback = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const origin = searchParam.get('origin');

  const{data, isLoading} = trpc.authCallback.useQuery();

  if(!isLoading) {
    if(data?.success) {
      router.push(origin ? `/${origin}` : '/dashboard')
    } else {
        redirect("/api/auth/login")
    }
  }
  
  return (
      <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>
          Setting up your account...
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  )
}

export default Page;