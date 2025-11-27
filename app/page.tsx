"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, RefreshCw, Check, X } from "lucide-react"

type BookingInfo = {
  customer: {
    name: string
    idNumber: string
    phone: string
    email: string
  }
  booking: {
    serviceName: string
    department: string
    branch: string
    appointmentDate: string
    appointmentTime: string
    queueNumber: number
    fee: number
    tax: number
    total: number
  }
  payment: {
    cardBrand: string
    cardLast4: string
    expiry: string
    cardHolder: string
  }
}

const insuranceOffers = [
  {
    id: 1,
    company: "ولاء للتأمين",
    logo: "/images/walaa.png",
    price: 902,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق", "سيارة بديلة"],
  },
  {
    id: 2,
    company: "التعاونية للتأمين",
    logo: "/images/tawuniya.png",
    price: 734,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق", "سيارة بديلة"],
  },
  {
    id: 3,
    company: "التأمين العربية",
    logo: "/images/arabia.png",
    price: 679,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق"],
  },
  {
    id: 4,
    company: "الراجحي تكافل",
    logo: "/images/alrajhi.png",
    price: 838,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق", "سيارة بديلة"],
  },
  {
    id: 5,
    company: "سلامة للتأمين",
    logo: "/images/salama.png",
    price: 977,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق", "سيارة بديلة", "تأمين ضد الكوارث"],
  },
  {
    id: 6,
    company: "ميدغلف للتأمين",
    logo: "/images/medgulf.png",
    price: 800,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق"],
  },
  {
    id: 7,
    company: "أكسا التعاوني",
    logo: "/images/axa.png",
    price: 1020,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق", "سيارة بديلة", "تأمين ضد الكوارث"],
  },
  {
    id: 8,
    company: "بوبا العربية",
    logo: "/images/bupa.png",
    price: 800,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق", "سيارة بديلة"],
  },
  {
    id: 9,
    company: "الأهلي تكافل",
    logo: "/images/alahli.png",
    price: 1000,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق", "سيارة بديلة"],
  },
  {
    id: 10,
    company: "تشب للتأمين",
    logo: "/images/chubb.png",
    price: 610,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق"],
  },
  {
    id: 11,
    company: "الدرع العربي",
    logo: "/images/shield.png",
    price: 520,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق"],
  },
  {
    id: 12,
    company: "الاتحاد التجاري",
    logo: "/images/union.png",
    price: 902,
    type: "شامل",
    features: ["تغطية شاملة", "مساعدة على الطريق", "سيارة بديلة"],
  },
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [activeTab, setActiveTab] = useState("مركبات")
  const [insuranceType, setInsuranceType] = useState("تأمين جديد")
  const [documentType, setDocumentType] = useState("استمارة")
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState("")
  const [captchaError, setCaptchaError] = useState(false)
  const [insuranceStartDate, setInsuranceStartDate] = useState("")
  const [selectedOffer, setSelectedOffer] = useState(insuranceOffers[11])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-discount")
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState("")
  const [otpAttempts, setOtpAttempts] = useState(5)
  const [cardNumber, setCardNumber] = useState("")
  const [formData, setFormData] = useState<BookingInfo|any>({
  })
  const [idNumberError, setIdNumberError] = useState("")
  const [phoneError, setPhoneError] = useState("")

  const [bookingData, setBookingData] = useState<BookingInfo | null>(null)

  function generateCaptcha() {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  const validateSaudiId = (id: string): boolean => {
    // Remove any spaces or special characters
    const cleanId = id.replace(/\s/g, "")

    // Check if it's exactly 10 digits
    if (!/^\d{10}$/.test(cleanId)) {
      setIdNumberError("رقم الهوية يجب أن يكون 10 أرقام")
      return false
    }

    // Check if it starts with 1 or 2 (Saudi national ID format)
    if (!/^[12]/.test(cleanId)) {
      setIdNumberError("رقم الهوية يجب أن يبدأ بـ 1 أو 2")
      return false
    }

    setIdNumberError("")
    return true
  }

  const validateSaudiPhone = (phone: string): boolean => {
    // Remove any spaces, dashes, or special characters except +
    const cleanPhone = phone.replace(/[\s\-()]/g, "")

    // Check for Saudi phone number formats:
    // 05XXXXXXXX (10 digits starting with 05)
    // +9665XXXXXXXX (international format)
    // 9665XXXXXXXX (without +)

    if (/^05\d{8}$/.test(cleanPhone)) {
      setPhoneError("")
      return true
    }

    if (/^\+9665\d{8}$/.test(cleanPhone) || /^9665\d{8}$/.test(cleanPhone)) {
      setPhoneError("")
      return true
    }

    setPhoneError("رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام")
    return false
  }

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha())
    setCaptchaInput("")
    setCaptchaError(false)
  }

  const handleFirstStepSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSaudiId(formData?.idNumber)) {
      return
    }

    if (!validateSaudiPhone(formData?.phone)) {
      return
    }

    if (captchaInput !== captchaCode) {
      setCaptchaError(true)
      return
    }

    setCaptchaError(false)
    setCurrentStep(2)
  }

  const handleSecondStepSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(3)
  }

  const handleSelectOffer = (offer: (typeof insuranceOffers)[0]) => {
    setSelectedOffer(offer)
    setCurrentStep(4)
  }

  // Rename to handlePaymentSubmit
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newBookingData: BookingInfo = {
      customer: {
        name: formData?.fullName,
        idNumber: formData?.idNumber,
        phone: formData?.phone,
        email: formData?.email,
      },
      booking: {
        serviceName: selectedOffer.company + " - " + selectedOffer.type,
        department: "التأمين",
        branch: "الرياض - طريق الملك فهد",
        appointmentDate: insuranceStartDate || new Date().toISOString().split("T")[0],
        appointmentTime: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
        queueNumber: Math.floor(Math.random() * 100) + 1,
        fee: selectedOffer.price,
        tax: selectedOffer.price * 0.15,
        total: selectedOffer.price * 1.15,
      },
      payment: {
        cardBrand: getCardBrand(cardNumber),
        cardLast4: cardNumber.slice(-4),
        expiry: formData?.cardExpiry,
        cardHolder: formData?.cardHolder,
      },
    }

    setBookingData(newBookingData)
    setShowOtpDialog(true)
  }

  const handleOtpSubmit = () => {
    if (otpValue === "123456") {
      setShowOtpDialog(false)
      setCurrentStep(5)
      setOtpError("")
    } else {
      setOtpAttempts((prev) => prev - 1)
      setOtpError(`رمز التحقق غير صحيح. المحاولات المتبقية: ${otpAttempts - 1}`)
      if (otpAttempts - 1 === 0) {
        setOtpError("تم استنفاد جميع المحاولات. يرجى المحاولة لاحقاً.")
        setTimeout(() => {
          setShowOtpDialog(false)
          setOtpAttempts(5)
          setOtpValue("")
        }, 3000)
      }
    }
  }

  const handleResendOtp = () => {
    setOtpError("")
    setOtpAttempts(5)
    alert("تم إرسال رمز جديد")
  }

  const getCardBrand = (cardNum: string) => {
    const firstDigit = cardNum.charAt(0)
    if (firstDigit === "4") return "Visa"
    if (firstDigit === "5") return "Mastercard"
    if (firstDigit === "3") return "American Express"
    return "Card"
  }

  return (
    <div className="min-h-screen bg-[#0a4a68]">
      {currentStep === 1 && (
        <>
          <div className="bg-[#0a4a68] px-3 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-white/10">
            <button className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-white/95 rounded-lg hover:bg-white transition-colors shadow-md">
              <Globe className="w-4 h-4 md:w-5 md:h-5 text-[#0a4a68]" />
              <span className="text-[#0a4a68] font-semibold text-sm md:text-base">EN</span>
            </button>

            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border-2 border-white flex items-center justify-center shadow-md">
              <span className="text-white text-xl md:text-2xl font-bold">B</span>
            </div>
          </div>

          <div className="bg-[#0a4a68] px-3 py-6 md:px-6 md:py-10 text-center border-b border-white/10">
            <h1 className="text-white text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 leading-tight" dir="rtl">
              اربح معنا .. سيارتين BMW 520i 2024
            </h1>
            <p className="text-yellow-300 text-base md:text-xl lg:text-2xl font-bold" dir="rtl">
              خصومات حتى 30% على التأمين
            </p>
          </div>

          <div className="max-w-3xl mx-auto -mt-4 md:-mt-6 px-3 md:px-4 pb-6 md:pb-8">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-4 text-center border-b" dir="rtl">
                {["مركبات", "طبي", "أخطاء طبية", "سفر"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 md:py-4 font-semibold text-xs md:text-sm lg:text-base transition-all ${
                      activeTab === tab
                        ? "text-[#0a4a68] border-b-3 bg-yellow-400/80"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form onSubmit={handleFirstStepSubmit} className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4" dir="rtl">
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={() => setInsuranceType("تأمين جديد")}
                    className={`py-2.5 md:py-3.5 rounded-lg md:rounded-xl font-semibold text-sm md:text-base shadow-sm transition-all hover:shadow-md ${
                      insuranceType === "تأمين جديد"
                        ? "bg-[#0a4a68] text-white hover:bg-[#083d57]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    تأمين جديد
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsuranceType("نقل ملكية")}
                    className={`py-2.5 md:py-3.5 rounded-lg md:rounded-xl font-semibold text-sm md:text-base shadow-sm transition-all hover:shadow-md ${
                      insuranceType === "نقل ملكية"
                        ? "bg-[#0a4a68] text-white hover:bg-[#083d57]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    نقل ملكية
                  </button>
                </div>

                <Input
                  placeholder="رقم الهوية / الإقامة"
                  value={formData?.idNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, idNumber: e.target.value })
                    setIdNumberError("")
                  }}
                  onBlur={() => {
                    if (formData?.idNumber) {
                      validateSaudiId(formData?.idNumber)
                    }
                  }}
                  className={`h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm ${
                    idNumberError ? "border-red-500 bg-red-50" : ""
                  }`}
                  dir="rtl"
                  required
                />
                {idNumberError && (
                  <p className="text-red-500 text-xs md:text-sm text-right font-semibold">{idNumberError}</p>
                )}

                <Input
                  placeholder="اسم مالك الوثيقة كاملاً"
                  value={formData?.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm"
                  dir="rtl"
                  required
                />

                <Input
                  type="tel"
                  placeholder="رقم الهاتف (05XXXXXXXX)"
                  value={formData?.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    setPhoneError("")
                  }}
                  onBlur={() => {
                    if (formData?.phone) {
                      validateSaudiPhone(formData?.phone)
                    }
                  }}
                  className={`h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm ${
                    phoneError ? "border-red-500 bg-red-50" : ""
                  }`}
                  dir="rtl"
                  required
                />
                {phoneError && <p className="text-red-500 text-xs md:text-sm text-right font-semibold">{phoneError}</p>}

                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={() => setDocumentType("استمارة")}
                    className={`py-2.5 md:py-3.5 rounded-lg md:rounded-xl font-semibold text-sm md:text-base shadow-sm transition-all hover:shadow-md ${
                      documentType === "استمارة"
                        ? "bg-[#0a4a68] text-white hover:bg-[#083d57]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    استمارة
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentType("بطاقة جمركية")}
                    className={`py-2.5 md:py-3.5 rounded-lg md:rounded-xl font-semibold text-sm md:text-base shadow-sm transition-all hover:shadow-md ${
                      documentType === "بطاقة جمركية"
                        ? "bg-[#0a4a68] text-white hover:bg-[#083d57]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    بطاقة جمركية
                  </button>
                </div>

                <Input
                  placeholder="الرقم التسلسلي"
                  value={formData?.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm"
                  dir="rtl"
                  required
                />

                <div className="border-2 rounded-lg md:rounded-xl p-3 md:p-4 bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between gap-2 md:gap-3">
                    <div
                      className="flex items-center gap-1.5 md:gap-2 bg-white px-2 md:px-3 py-2 rounded-lg shadow-sm"
                      dir="ltr"
                    >
                      {captchaCode.split("").map((digit, index) => (
                        <span
                          key={index}
                          className={`text-2xl md:text-3xl font-bold select-none ${
                            index === 0
                              ? "text-yellow-500"
                              : index === 1
                                ? "text-blue-600"
                                : index === 2
                                  ? "text-green-600"
                                  : "text-red-500"
                          }`}
                          style={{
                            transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 5}deg)`,
                            display: "inline-block",
                          }}
                        >
                          {digit}
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="w-8 h-8 md:w-9 md:h-9 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm ml-1 md:ml-2"
                      >
                        <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </button>
                    </div>
                    <Input
                      placeholder="رمز التحقق"
                      value={captchaInput}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        setCaptchaInput(value)
                        setCaptchaError(false)
                      }}
                      maxLength={4}
                      className={`h-10 md:h-11 text-right text-sm md:text-base flex-1 border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] ${
                        captchaError ? "border-red-500 bg-red-50" : ""
                      }`}
                      dir="ltr"
                      required
                    />
                  </div>
                  {captchaError && (
                    <p className="text-red-500 text-xs md:text-sm mt-2 text-right font-semibold">
                      رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 md:h-14 bg-yellow-500 hover:bg-yellow-600 text-[#0a4a68] font-bold text-base md:text-lg rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  إظهار العروض
                </Button>
              </form>
            </div>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <div className="p-3 md:p-6 lg:p-8" dir="rtl">
          <div className="max-w-3xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a4a68] mb-6 md:mb-8 text-center">بيانات التأمين</h2>

            <form onSubmit={handleSecondStepSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">نوع التأمين</label>
                <select
                  value={formData?.insuranceType}
                  onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
                  className="w-full h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl px-3 md:px-4 bg-white focus:border-[#0a4a68] focus:outline-none shadow-sm appearance-none cursor-pointer"
                >
                  <option>إختر</option>
                  <option>شامل</option>
                  <option>ضد الغير</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">تاريخ بدء التأمين</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={insuranceStartDate}
                    onChange={(e) => setInsuranceStartDate(e.target.value)}
                    className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm pr-3 md:pr-4 pl-10 md:pl-10 cursor-pointer"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">
                  الغرض من استخدام المركبة
                </label>
                <select className="w-full h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl px-3 md:px-4 bg-white focus:border-[#0a4a68] focus:outline-none shadow-sm appearance-none cursor-pointer">
                  <option>إختر</option>
                  <option>شخصي</option>
                  <option>تجاري</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">
                  القيمة التقديرية للمركبة
                </label>
                <Input
                  type="number"
                  placeholder="أدخل القيمة بالريال"
                  value={formData?.vehicleValue}
                  onChange={(e) => setFormData({ ...formData, vehicleValue: e.target.value })}
                  className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm"
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">سنة صنع المركبة</label>
                <select
                  value={formData?.vehicleYear}
                  onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                  className="w-full h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl px-3 md:px-4 bg-white focus:border-[#0a4a68] focus:outline-none shadow-sm appearance-none cursor-pointer"
                >
                  <option>إختر</option>
                  {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">ماركة وموديل السيارة</label>
                <Input
                  placeholder="مثال: تويوتا كامري 2023"
                  value={formData?.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm"
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">مكان اصلاح المركبة</label>
                <div className="space-y-2 md:space-y-3">
                  <label className="flex items-center gap-2 md:gap-3 p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="repairLocation"
                      value="agency"
                      checked={formData?.repairLocation === "agency"}
                      onChange={(e) => setFormData({ ...formData, repairLocation: e.target.value })}
                      className="w-4 h-4 md:w-5 md:h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm md:text-base font-medium">الوكالة</span>
                  </label>
                  <label className="flex items-center gap-2 md:gap-3 p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="repairLocation"
                      value="workshop"
                      checked={formData?.repairLocation === "workshop"}
                      onChange={(e) => setFormData({ ...formData, repairLocation: e.target.value })}
                      className="w-4 h-4 md:w-5 md:h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm md:text-base font-medium">الورشة</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 md:h-14 bg-yellow-500 hover:bg-yellow-600 text-[#0a4a68] font-bold text-base md:text-lg rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                إظهار العروض
              </Button>
            </form>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="min-h-screen bg-gray-50 py-4 md:py-6 lg:py-8 px-3 md:px-4">
          <div className="max-w-4xl mx-auto mb-4 md:mb-6">
            <div
              className="bg-blue-50 border-2 border-blue-200 rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm"
              dir="rtl"
            >
              <p className="text-blue-900 text-xs md:text-sm leading-relaxed">
                بموجب تعليمات البنك المركزي السعودي، يحق لحامل الوثيقة إلغاء الوثيقة واسترداد كامل المبلغ المدفوع خلال
                15 يوماً من تاريخ الشراء، بشرط عدم حدوث أي مطالبات خلال هذه الفترة.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
            {insuranceOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 md:p-5 lg:p-6"
                dir="rtl"
              >
                <div className="flex items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">{offer.company}</h3>
                    <p className="text-blue-600 font-semibold text-base md:text-lg mb-3 md:mb-4">
                      التأمين {offer.type}
                    </p>

                    <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                      {offer.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 md:gap-2">
                          <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-xs md:text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 md:gap-3">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gray-50">
                      <span className="text-xs md:text-sm text-gray-400">شعار</span>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl md:text-3xl font-bold text-[#0a4a68]">{offer.price}</div>
                      <div className="text-xs md:text-sm text-gray-600">ريال / سنة</div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectOffer(offer)}
                  className="w-full h-10 md:h-11 bg-[#0a4a68] hover:bg-[#083d57] text-white font-semibold text-sm md:text-base rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  اختر هذا العرض
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="min-h-screen bg-gray-50 py-4 md:py-6 lg:py-8 px-3 md:px-4" dir="rtl">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg md:rounded-xl shadow-xl p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a4a68] mb-4 md:mb-6 text-center">
                تأكيد العرض والدفع
              </h2>

              <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-5 mb-4 md:mb-6 border-2 border-gray-200">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">{selectedOffer.company}</h3>
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-5">
                  {selectedOffer.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-gray-200 pt-3 md:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-semibold text-gray-700">المبلغ الإجمالي:</span>
                    <span className="text-2xl md:text-3xl font-bold text-[#0a4a68]">{selectedOffer.price} ريال</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4 md:space-y-5">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold text-sm md:text-base">طريقة الدفع</label>
                  <div className="space-y-2 md:space-y-3">
                    <label className="flex items-center gap-2 md:gap-3 p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-discount"
                        checked={selectedPaymentMethod === "credit-discount"}
                        onChange={() => setSelectedPaymentMethod("credit-discount")}
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                      <span className="text-sm md:text-base font-medium">بطاقة ائتمانية (خصم 5%)</span>
                    </label>
                    <label className="flex items-center gap-2 md:gap-3 p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit"
                        checked={selectedPaymentMethod === "credit"}
                        onChange={() => setSelectedPaymentMethod("credit")}
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                      <span className="text-sm md:text-base font-medium">بطاقة ائتمانية</span>
                    </label>
                    <label className="flex items-center gap-2 md:gap-3 p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mada"
                        checked={selectedPaymentMethod === "mada"}
                        onChange={() => setSelectedPaymentMethod("mada")}
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                      <span className="text-sm md:text-base font-medium">مدى</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold text-sm md:text-base">رقم البطاقة</label>
                  <Input
                    type="tel"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68]"
                    dir="ltr"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-semibold text-sm md:text-base">تاريخ الانتهاء</label>
                    <Input
                      type="tel"
                      placeholder="MM/YY"
                      value={formData?.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      className="h-11 md:h-12 text-center text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-semibold text-sm md:text-base">CVV</label>
                    <Input
                      type="tel"
                      placeholder="000"
                      maxLength={3}
                      value={formData?.cardCvv}
                      onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                      className="h-11 md:h-12 text-center text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 md:h-14 bg-yellow-500 hover:bg-yellow-600 text-[#0a4a68] font-bold text-base md:text-lg rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  تأكيد الدفع
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Confirmation */}
      {currentStep === 5 && bookingData && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4">
          <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-10">
              <div className="text-center mb-8">
                <div className="w-16 md:w-20 h-16 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg
                    className="w-8 md:w-10 h-8 md:h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">تم التأكيد بنجاح!</h2>
                <p className="text-gray-600 text-sm md:text-base">تم إتمام عملية الحجز والدفع بنجاح</p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 space-y-3" dir="rtl">
                <div className="bg-[#0a4a68] text-white rounded-lg md:rounded-xl p-3 md:p-4 text-center mb-4">
                  <span className="text-xs md:text-sm">رقم الحجز</span>
                  <br />
                  <span className="font-bold text-lg md:text-2xl">#{bookingData.booking.queueNumber}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-600 text-sm md:text-base">الخدمة:</span>
                  <span className="font-semibold text-gray-900">{bookingData.booking.serviceName}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-600 text-sm md:text-base">القسم:</span>
                  <span className="font-semibold text-gray-900">{bookingData.booking.department}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-600 text-sm md:text-base">الفرع:</span>
                  <span className="font-semibold text-gray-900">{bookingData.booking.branch}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-600 text-sm md:text-base">التاريخ:</span>
                  <span className="font-semibold text-gray-900">{bookingData.booking.appointmentDate}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-600 text-sm md:text-base">الوقت:</span>
                  <span className="font-semibold text-gray-900">{bookingData.booking.appointmentTime}</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mt-4">
                <h4 className="font-bold text-gray-900 mb-3">معلومات العميل</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">الاسم:</span>
                    <span className="font-semibold text-gray-900">{bookingData.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">رقم الهوية:</span>
                    <span className="font-semibold text-gray-900">{bookingData.customer.idNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">الهاتف:</span>
                    <span className="font-semibold text-gray-900">{bookingData.customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">البريد الإلكتروني:</span>
                    <span className="font-semibold text-gray-900">{bookingData.customer.email}</span>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mt-4">
                <h4 className="font-bold text-gray-900 mb-3">معلومات الدفع</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">الرسوم:</span>
                    <span className="font-semibold text-gray-900">{bookingData.booking.fee.toFixed(2)} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">الضريبة:</span>
                    <span className="font-semibold text-gray-900">{bookingData.booking.tax.toFixed(2)} ريال</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                    <span className="text-gray-900 font-bold text-base md:text-lg">الإجمالي:</span>
                    <span className="text-[#0a4a68] font-bold text-xl md:text-2xl">
                      {bookingData.booking.total.toFixed(2)} ريال
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                    <span className="text-gray-600 text-sm">طريقة الدفع:</span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {bookingData.payment.cardBrand} •••• {bookingData.payment.cardLast4}
                      </div>
                      <div className="text-xs text-gray-500">{bookingData.payment.cardHolder}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg md:rounded-xl p-3 md:p-4 mb-6">
              <p className="text-blue-900 text-xs md:text-sm leading-relaxed">
                سيتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني ورسالة نصية إلى رقم هاتفك.
              </p>
            </div>

            <Button
              onClick={() => {
                setCurrentStep(1)
                setBookingData(null)
              }}
              className="w-full h-12 md:h-14 bg-[#0a4a68] hover:bg-[#083d57] text-white font-bold text-base md:text-lg rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              حجز جديد
            </Button>
          </div>
        </div>
      )}

      {/* OTP Dialog */}
      {showOtpDialog && bookingData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" dir="rtl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <img src="/visa-logo-generic.png" alt="Visa" width={50} />
              <span className="font-bold text-blue-800">Verified </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Enter verification code</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              We sent you a verification code by text message to{" "}
              {bookingData.customer.phone.replace(/\d(?=\d{4})/g, "*")}.
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm text-center">Verification code</label>
                <Input
                  type="tel"
                  value={otpValue}
                  onChange={(e) => {
                    setOtpValue(e.target.value)
                    setOtpError("")
                  }}
                  placeholder="######"
                  maxLength={6}
                  className="h-16 text-center text-2xl tracking-widest border-2 rounded-xl focus:border-blue-500 shadow-sm font-mono"
                  required
                />
                {otpError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-semibold justify-center">
                    <X className="w-4 h-4" />
                    <span>{otpError}</span>
                  </div>
                )}
                <p className="text-center text-xs text-gray-500 mt-2">المحاولات المتبقية: {otpAttempts}</p>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                CONTINUE
              </Button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
              >
                RESEND CODE
              </button>
            </form>

            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <button className="flex items-center justify-between w-full text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                <span>Need Help?</span>
                <span className="text-xl">+</span>
              </button>
            </div>

            <div className="mt-4">
              <p className="text-gray-500 text-xs text-center leading-relaxed">
                Having trouble?
                <br />
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  Choose another security option
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
