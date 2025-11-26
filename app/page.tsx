"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, RefreshCw, Calendar, Check, X } from "lucide-react"
import { data } from "autoprefixer"

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
  const [cardNumber,setCardNumber] = useState('')

  function generateCaptcha() {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha())
    setCaptchaInput("")
    setCaptchaError(false)
  }

  const handleFirstStepSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setShowOtpDialog(true)
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue === "123456") {
      setShowOtpDialog(false)
      alert("تم الدفع بنجاح!")
    } else {
      setOtpError("رمز التحقق غير صحيح")
      setOtpAttempts((prev) => prev - 1)
    }
  }

  const handleResendOtp = () => {
    setOtpError("")
    setOtpAttempts(5)
    alert("تم إرسال رمز جديد")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f5275] via-[#1a6a91] to-[#0f5275]">
      {currentStep === 1 && (
        <>
          {/* Header */}
          <div className="bg-[#0f5275] px-4 py-6 flex items-center justify-between">
            <button className="flex items-center gap-2 px-5 py-3 bg-white/95 rounded-xl hover:bg-white transition-colors shadow-lg">
              <Globe className="w-5 h-5 text-[#0f5275]" />
              <span className="text-[#0f5275] font-bold text-base">EN</span>
            </button>

            <div className="w-14 h-14 rounded-full bg-white/10 border-3 border-white flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-gradient-to-br from-[#0f5275] to-[#1a6a91] px-4 py-10 text-center shadow-xl">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight" dir="rtl">
              اربح معنا .. سيارتين BMW 520i 2024
            </h1>
            <p className="text-yellow-300 text-xl md:text-2xl font-bold" dir="rtl">
              خصومات حتى 30% على التأمين
            </p>
          </div>

          {/* Main Form Card */}
          <div className="max-w-3xl mx-auto -mt-6 px-4 pb-8">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-4 text-center border-b" dir="rtl">
                {["مركبات", "طبي", "أخطاء طبية", "سفر"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-5 font-bold text-sm md:text-base transition-all ${activeTab === tab
                        ? "text-[#0f5275] border-b-3 bg-yellow-400/70 "
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Form Section */}
              <form onSubmit={handleFirstStepSubmit} className="p-6 md:p-8 space-y-5" dir="rtl">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setInsuranceType("تأمين جديد")}
                    className={`py-4 rounded-xl font-bold text-base shadow-md transition-all hover:shadow-lg ${insuranceType === "تأمين جديد"
                        ? "bg-[#0f5275] text-white hover:bg-[#0d4562]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    تأمين جديد
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsuranceType("نقل ملكية")}
                    className={`py-4 rounded-xl font-bold text-base shadow-md transition-all hover:shadow-lg ${insuranceType === "نقل ملكية"
                        ? "bg-[#0f5275] text-white hover:bg-[#0d4562]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    نقل ملكية
                  </button>
                </div>

                {/* Input Fields */}
                <Input
                  placeholder="رقم الهوية / الإقامة"
                  className="h-14 text-right text-base border-2 rounded-xl focus:border-[#0f5275] shadow-sm"
                  dir="rtl"
                  required
                />

                <Input
                  placeholder="اسم مالك الوثيقة كاملاً"
                  className="h-14 text-right text-base border-2 rounded-xl focus:border-[#0f5275] shadow-sm"
                  dir="rtl"
                  required
                />

                <Input
                  type="tel"
                  placeholder="رقم الهاتف"
                  className="h-14 text-right text-base border-2 rounded-xl focus:border-[#0f5275] shadow-sm"
                  dir="rtl"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDocumentType("استمارة")}
                    className={`py-4 rounded-xl font-bold text-base shadow-md transition-all hover:shadow-lg ${documentType === "استمارة"
                        ? "bg-[#0f5275] text-white hover:bg-[#0d4562]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    استمارة
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentType("بطاقة جمركية")}
                    className={`py-4 rounded-xl font-bold text-base shadow-md transition-all hover:shadow-lg ${documentType === "بطاقة جمركية"
                        ? "bg-[#0f5275] text-white hover:bg-[#0d4562]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    بطاقة جمركية
                  </button>
                </div>

                <Input
                  placeholder="الرقم التسلسلي"
                  className="h-14 text-right text-base border-2 rounded-xl focus:border-[#0f5275] shadow-sm"
                  dir="rtl"
                  required
                />

                <div className="border-2 rounded-xl p-5 bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm" dir="ltr">
                      {captchaCode.split("").map((digit, index) => (
                        <span
                          key={index}
                          className={`text-4xl font-bold select-none ${index === 0
                              ? "text-yellow-500"
                              : index === 1
                                ? "text-blue-600"
                                : index === 2
                                  ? "text-green-600"
                                  : "text-green-500"
                            }`}
                        >
                          {digit}
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm ml-2"
                      >
                        <RefreshCw className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <Input
                      placeholder="رمز التحقق"
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value)
                        setCaptchaError(false)
                      }}
                      className={`h-12 text-right text-base flex-1 border-2 rounded-xl focus:border-[#0f5275] ${captchaError ? "border-red-500 bg-red-50" : ""
                        }`}
                      dir="ltr"
                      required
                    />
                  </div>
                  {captchaError && (
                    <p className="text-red-500 text-sm mt-2 text-right font-semibold">
                      رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  إظهار العروض
                </Button>
              </form>
            </div>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <div className="p-6 md:p-8" dir="rtl">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <h2 className="text-3xl font-bold text-[#0f5275] mb-8 text-center">بيانات التأمين</h2>

            <form onSubmit={handleSecondStepSubmit} className="space-y-6">
              {/* Insurance Type */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold text-base">نوع التأمين</label>
                <select className="w-full h-14 text-right text-base border-2 rounded-xl px-4 bg-white focus:border-[#0f5275] focus:outline-none shadow-sm appearance-none cursor-pointer">
                  <option>إختر</option>
                  <option>شامل</option>
                  <option>ضد الغير</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold text-base">تاريخ بدء التأمين</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={insuranceStartDate}
                    onChange={(e) => setInsuranceStartDate(e.target.value)}
                    className="h-14 text-right text-base border-2 rounded-xl focus:border-[#0f5275] shadow-sm pr-4 pl-12 cursor-pointer"
                    dir="rtl"
                    required
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Vehicle Usage Purpose */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold text-base">الغرض من استخدام المركبة</label>
                <select className="w-full h-14 text-right text-base border-2 rounded-xl px-4 bg-white focus:border-[#0f5275] focus:outline-none shadow-sm appearance-none cursor-pointer">
                  <option>إختر</option>
                  <option>شخصي</option>
                  <option>تجاري</option>
                </select>
              </div>

              {/* Estimated Value */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold text-base">القيمة التقديرية للمركبة</label>
                <Input
                  type="number"
                  placeholder="أدخل القيمة بالريال"
                  className="h-14 text-right text-base border-2 rounded-xl focus:border-[#0f5275] shadow-sm"
                  dir="rtl"
                  required
                />
              </div>

              {/* Manufacturing Year */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold text-base">سنة صنع المركبة</label>
                <select className="w-full h-14 text-right text-base border-2 rounded-xl px-4 bg-white focus:border-[#0f5275] focus:outline-none shadow-sm appearance-none cursor-pointer">
                  <option>إختر</option>
                  {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Car Brand and Model */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold text-base">ماركة وموديل السيارة</label>
                <Input
                  placeholder="مثال: تويوتا كامري 2023"
                  className="h-14 text-right text-base border-2 rounded-xl focus:border-[#0f5275] shadow-sm"
                  dir="rtl"
                  required
                />
              </div>

              {/* Repair Location */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold text-base">مكان اصلاح المركبة</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="repairLocation"
                      value="agency"
                      defaultChecked
                      className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-base font-medium">الوكالة</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="repairLocation"
                      value="workshop"
                      className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-base font-medium">الورشة</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                إظهار العروض
              </Button>
            </form>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          {/* Info Banner */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm" dir="rtl">
              <p className="text-blue-900 text-sm leading-relaxed">
                بموجب تعليمات البنك المركزي السعودي، يحق لحامل الوثيقة إلغاء الوثيقة واسترداد كامل المبلغ المدفوع خلال
                15 يوماً من تاريخ الشراء، بشرط عدم حدوث أي مطالبات خلال هذه الفترة.
              </p>
            </div>
          </div>

          {/* Offers List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {insuranceOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
                dir="rtl"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.company}</h3>
                    <p className="text-blue-600 font-semibold text-lg mb-4">التأمين {offer.type}</p>

                    <div className="space-y-2 mb-4">
                      {offer.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{offer.price}</div>
                    <div className="text-sm text-gray-500">ريال</div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectOffer(offer)}
                  className="w-full h-12 bg-[#0f5275] hover:bg-[#0d4562] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  اختر الخطة
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 4 && selectedOffer && (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8" dir="rtl">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">تفاصيل الدفع</h2>

              {/* Company Details Card */}
              <div className="border-2 border-blue-200 rounded-xl p-6 mb-6 bg-blue-50">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-blue-600 font-bold text-2xl">{selectedOffer.company}</span>
                  </div>
                </div>

                <div className="space-y-3 text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">فترة التأمين:</span>
                    <span className="font-bold text-gray-900">سنة واحدة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تاريخ البداية:</span>
                    <span className="font-bold text-gray-900">{insuranceStartDate || "قريباً"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تاريخ الانتهاء:</span>
                    <span className="font-bold text-gray-900">بعد سنة</span>
                  </div>
                </div>

                <div className="border-t-2 border-blue-200 mt-4 pt-4">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">تفاصيل السعر:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">القسط الأساسي:</span>
                      <span className="font-semibold">{selectedOffer.price.toFixed(2)} ريال</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                      <span>خصم عدم وجود مطالبات:</span>
                      <span className="font-semibold">-135.30 ريال</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">المجموع الفرعي:</span>
                      <span className="font-semibold">{(selectedOffer.price - 135.3).toFixed(2)} ريال</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ضريبة القيمة المضافة (15%):</span>
                      <span className="font-semibold">{((selectedOffer.price - 135.3) * 0.15).toFixed(2)} ريال</span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-blue-300 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">المبلغ الإجمالي:</span>
                    <span className="text-3xl font-bold text-blue-600">{selectedOffer.price.toFixed(2)} ريال</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">اختر طريقة الدفع</h3>
                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === "credit-discount"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-discount"
                        checked={selectedPaymentMethod === "credit-discount"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <div>
                        <div className="font-bold text-gray-900">بطاقات الأهلي .. الائتمانية</div>
                        <div className="text-sm text-green-600 font-semibold">خصم 15% على بطاقات الأهل الائتمانية</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-red-500 line-through text-sm">{selectedOffer.price.toFixed(2)} ريال</div>
                      <div className="text-xl font-bold text-green-600">
                        {(selectedOffer.price * 0.85).toFixed(2)} ريال
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === "credit"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit"
                        checked={selectedPaymentMethod === "credit"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <div className="font-bold text-gray-900">بطاقة ائتمانية</div>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{selectedOffer.price.toFixed(2)} ريال</div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === "mada"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mada"
                        checked={selectedPaymentMethod === "mada"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <div className="font-bold text-gray-900">مدى</div>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{selectedOffer.price.toFixed(2)} ريال</div>
                  </label>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                {/* Cardholder Name */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-bold text-base">اسم حامل البطاقة</label>
                  <Input
                    type="text"
                    placeholder="أدخل اسم حامل البطاقة"
                    className="h-14 text-right text-base border-2 rounded-xl focus:border-[#0f5275] shadow-sm focus:shadow-md transition-all"
                    dir="rtl"
                    required
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-bold text-base">رقم البطاقة</label>
                  <Input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="h-14 text-left text-lg tracking-wider border-2 rounded-xl focus:border-[#0f5275] shadow-sm focus:shadow-md transition-all font-mono"
                    required
                  />
                </div>

                {/* Expiry, CVV and PIN in a grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-bold text-sm text-right">تاريخ الانتهاء</label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="h-14 text-center text-lg border-2 rounded-xl focus:border-[#0f5275] shadow-sm focus:shadow-md transition-all font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-bold text-sm text-right">رمز الأمان</label>
                    <Input
                      type="text"
                      placeholder="CVV"
                      maxLength={3}
                      className="h-14 text-center text-lg border-2 rounded-xl focus:border-[#0f5275] shadow-sm focus:shadow-md transition-all font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-bold text-sm text-right">رمز PIN</label>
                    <Input
                      type="password"
                      placeholder="****"
                      maxLength={4}
                      className="h-14 text-center text-lg border-2 rounded-xl focus:border-[#0f5275] shadow-sm focus:shadow-md transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 text-sm font-semibold">جميع المدفوعات محمية ومشفرة</p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  ادفع الآن -{" "}
                  {(selectedOffer.price * (selectedPaymentMethod === "credit-discount" ? 0.85 : 1)).toFixed(2)} ريال
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* OTP Dialog */}
      {showOtpDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" dir="rtl">
            <div className="flex items-center justify-between gap-4 mb-6">
              {cardNumber.at(0) === '4' ?
                <img src="/visa.svg" alt="visa" width={50}/> :
                <img src="/mas.svg" alt="master" width={50}/>}
                <span className="font-bold text-blue-500">Verified</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Enter verification code</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              We sent you a verification code by text message to (05) 456-****. You have {otpAttempts} attempts.
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm text-center">Verification code</label>
                <Input
                  type="text"
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
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                CONTINUE
              </Button>

              <button
                type="button"
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
