"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export function LoginForm() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email) {
            setError("Please enter your email.")
            return
        }

        if (!emailRegex.test(email)) {
            setError("Enter a valid email address.")
            return
        }

        setLoading(true)
        const res = await signIn("email", { email })
        setLoading(false)

        if (res?.error) {
            setError("Something went wrong. Try again later.")
        } else {
            setSent(true)
        }
    }

    return <form onSubmit={handleSubmit} className="rounded-lg h-64 flex w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 flex-col items-center justify-between py-2 border border-white">
        <div className="w-full flex flex-col justify-center items-center gap-1">
            <h1 className="text-3xl font-bold">Login with Email</h1>
            <p>You will be sent a login link in your inbox</p>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-1">
            <label className="w-10/12 text-left" htmlFor="email-address">Your Email Address</label>
            <div className='w-11/12 rounded-full h-14 px-4 flex items-center border-white border gap-2'>
                <EnvelopeIcon className="size-6 text-white-500" />
                <input
                    required
                    name="email-address"
                    type='email'
                    placeholder='example@mail.com'
                    className='outline-none grow flex'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {sent && <p className="text-green-400 text-sm">Check your inbox!</p>}

        <button type="submit" disabled={loading || sent} className="rounded-full bg-blue-950 hover:cursor-pointer transition-all hover:bg-blue-800 hover:opacity-100 opacity-85 disabled:opacity-65 disabled:cursor-not-allowed px-4 py-3 tracking-wide">
            {loading ? "Sending..." : sent ? "Check your inbox!" : "Send Link"}</button>
    </form>
}