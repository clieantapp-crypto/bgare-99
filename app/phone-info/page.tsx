"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone } from "lucide-react"
import { OtpDialog } from "@/components/phone-otp-dialog"

export default function VerifyPhonePage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null)
  const [showOtpDialog, setShowOtpDialog] = useState(false)

  const carriers = [
    {
      id: "stc",
      name: "STC",
      logo: (
        <svg viewBox="0 0 100 40" className="h-10 w-auto">
          <text x="50" y="28" textAnchor="middle" className="fill-[#6b1b9a] font-bold text-2xl">
            stc
          </text>
        </svg>
      ),
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      selectedBorder: "border-purple-500",
    },
    {
      id: "mobily",
      name: "Mobily",
      logo: (
        <svg viewBox="0 0 100 40" className="h-10 w-auto">
          <text x="50" y="28" textAnchor="middle" className="fill-[#00a550] font-bold text-xl">
            Mobily
          </text>
        </svg>
      ),
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      selectedBorder: "border-green-500",
    },
    {
      id: "zain",
      name: "Zain",
      logo: (
        <svg viewBox="0 0 100 40" className="h-8 w-auto">
          <text x="50" y="24" textAnchor="middle" className="fill-gray-900 font-bold text-xl">
            ●ZAIN
          </text>
        </svg>
      ),
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      selectedBorder: "border-orange-500",
    },
  ]

  const handleSendOtp = () => {
    if (phoneNumber && selectedCarrier) {
      setShowOtpDialog(true)
    }
  }

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-b from-[#1a5c85] to-[#2d7ba8] flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="w-full max-w-lg space-y-6">
          {/* Header */}
          <div className="text-center text-white space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-balance">نظام التحقق الآمن</h1>
            <p className="text-lg text-white/90">تحقق من هويتك بأمان وسرعة</p>
          </div>

          {/* Main Card */}
          <Card className="p-6 space-y-6">
            {/* Icon and Title */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1a5c85]">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">التحقق عن رقم الجوال</h2>
                <p className="text-sm text-gray-600">الرجاء إدخال رقم الجوال واختيار شركة الاتصالات للمتابعة</p>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-right block text-gray-700">
                رقم الجوال *
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-right pr-20 text-lg h-12"
                  dir="ltr"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+966</div>
              </div>
            </div>

            {/* Carrier Selection */}
            <div className="space-y-3">
              <Label className="text-right block text-gray-700">شركة الاتصالات *</Label>
              <div className="space-y-3">
                {carriers.map((carrier) => (
                  <button
                    key={carrier.id}
                    onClick={() => setSelectedCarrier(carrier.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${carrier.bgColor} ${
                      selectedCarrier === carrier.id ? carrier.selectedBorder + " shadow-md" : carrier.borderColor
                    } hover:shadow-md`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {carrier.logo}
                      <span className="font-semibold text-gray-900">{carrier.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSendOtp}
              className="w-full h-14 text-lg bg-[#1a5c85] hover:bg-[#154a6d]"
              disabled={!phoneNumber || !selectedCarrier}
            >
              <Phone className="ml-2 h-5 w-5" />
              إرسال رمز التحقق
            </Button>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-900">🔒 معلوماتك محمية بأعلى معايير الأمان والخصوصية</p>
            </div>
          </Card>
        </div>
      </div>

      <OtpDialog open={showOtpDialog} onOpenChange={setShowOtpDialog} phoneNumber={phoneNumber} />
    </>
  )
}
