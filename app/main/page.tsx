"use client"

import type React from "react"
import { offerData } from "@/lib/offer-data"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, RefreshCw, Check, X } from "lucide-react"


export default function InsuranceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [activeTab, setActiveTab] = useState("مركبات")
  const [insuranceType, setInsuranceType] = useState("تأمين جديد")
  const [documentType, setDocumentType] = useState("استمارة")
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState("")
  const [captchaError, setCaptchaError] = useState(false)
  const [insuranceStartDate, setInsuranceStartDate] = useState("")
  const [selectedOffer, setSelectedOffer] = useState(offerData[11])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-discount")
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState("")
  const [otpAttempts, setOtpAttempts] = useState(5)
  const [cardNumber, setCardNumber] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [insuranceCoverage, setInsuranceCoverage] = useState("")
  const [vehicleUsage, setVehicleUsage] = useState("")
  const [vehicleValue, setVehicleValue] = useState("")
  const [vehicleYear, setVehicleYear] = useState("")
  const [vehicleModel, setVehicleModel] = useState("")
  const [repairLocation, setRepairLocation] = useState("agency")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({})
  const [idNumberError, setIdNumberError] = useState("") // Added error state for ID validation

  function generateCaptcha() {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha())
    setCaptchaInput("")
    setCaptchaError(false)
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

    // Validate using Luhn algorithm (checksum validation)
    let sum = 0
    for (let i = 0; i < 10; i++) {
      let digit = Number.parseInt(cleanId[i])

      // Double every second digit from right to left
      if ((10 - i) % 2 === 0) {
        digit *= 2
        // If doubled digit is greater than 9, subtract 9
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
    }

    // Valid if sum is divisible by 10
    if (sum % 10 !== 0) {
      setIdNumberError("رقم الهوية غير صالح")
      return false
    }

    setIdNumberError("")
    return true
  }

  const handleFirstStepSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate Saudi ID
    if (!validateSaudiId(idNumber)) {
      return // Don't proceed if validation fails
    }

    setCurrentStep(2)
  }

  const handleSecondStepSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(3)
  }

  const handleSelectOffer = (offer: (typeof offerData)[0]) => {
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

  const toggleFeature = (offerId: string, featureId: string) => {
    setSelectedFeatures((prev) => {
      const current = prev[offerId] || []
      if (current.includes(featureId)) {
        return { ...prev, [offerId]: current.filter((id) => id !== featureId) }
      } else {
        return { ...prev, [offerId]: [...current, featureId] }
      }
    })
  }

  const calculateOfferTotal = (offer: (typeof offerData)[0], selectedFeatures: string[] = []) => {
    const mainPrice = Number.parseFloat(offer.main_price)
    const featuresPrice = offer.extra_features
      .filter((f) => selectedFeatures.includes(f.id))
      .reduce((sum, f) => sum + f.price, 0)
    const expensesTotal = offer.extra_expenses.reduce((sum, e) => sum + e.price, 0)
    return mainPrice + featuresPrice + expensesTotal
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
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value)
                    if (idNumberError) setIdNumberError("")
                  }}
                  className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm"
                  dir="rtl"
                  required
                />
                {idNumberError && (
                  <p className="text-red-500 text-sm mt-1 text-right" dir="rtl">
                    {idNumberError}
                  </p>
                )}

                <Input
                  placeholder="اسم مالك الوثيقة كاملاً"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm"
                  dir="rtl"
                  required
                />

                <Input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm"
                  dir="rtl"
                  required
                />

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
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
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
                                  : "text-green-500"
                          }`}
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
                        setCaptchaInput(e.target.value)
                        setCaptchaError(false)
                      }}
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
                  value={insuranceCoverage}
                  onChange={(e) => setInsuranceCoverage(e.target.value)}
                  className="w-full h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl px-3 md:px-4 bg-white focus:border-[#0a4a68] focus:outline-none shadow-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">إختر</option>
                  <option value="comprehensive">شامل</option>
                  <option value="third-party">ضد الغير</option>
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
                <select
                  value={vehicleUsage}
                  onChange={(e) => setVehicleUsage(e.target.value)}
                  className="w-full h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl px-3 md:px-4 bg-white focus:border-[#0a4a68] focus:outline-none shadow-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">إختر</option>
                  <option value="personal">شخصي</option>
                  <option value="commercial">تجاري</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">
                  القيمة التقديرية للمركبة
                </label>
                <Input
                  type="number"
                  placeholder="أدخل القيمة بالريال"
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(e.target.value)}
                  className="h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68] shadow-sm"
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">سنة صنع المركبة</label>
                <select
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  className="w-full h-11 md:h-12 text-right text-sm md:text-base border-2 rounded-lg md:rounded-xl px-3 md:px-4 bg-white focus:border-[#0a4a68] focus:outline-none shadow-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">إختر</option>
                  {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm md:text-base">ماركة وموديل السيارة</label>
                <Input
                  placeholder="مثال: تويوتا كامري 2023"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
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
                      checked={repairLocation === "agency"}
                      onChange={(e) => setRepairLocation(e.target.value)}
                      className="w-4 h-4 md:w-5 md:h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm md:text-base font-medium">الوكالة</span>
                  </label>
                  <label className="flex items-center gap-2 md:gap-3 p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="repairLocation"
                      value="workshop"
                      checked={repairLocation === "workshop"}
                      onChange={(e) => setRepairLocation(e.target.value)}
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
            {offerData.map((offer) => {
              const offerSelectedFeatures = selectedFeatures[offer.id] || []
              const totalPrice = calculateOfferTotal(offer, offerSelectedFeatures)

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 md:p-5 lg:p-6"
                  dir="rtl"
                >
                  <div className="flex items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">{offer.name}</h3>
                      <p className="text-blue-600 font-semibold text-base md:text-lg mb-3 md:mb-4">
                        التأمين {offer.type === "against-others" ? "ضد الغير" : "شامل"}
                      </p>

                      <div className="space-y-2 mb-3 md:mb-4">
                        {offer.extra_features.map((feature) => (
                          <div key={feature.id} className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id={`${offer.id}-${feature.id}`}
                              checked={offerSelectedFeatures.includes(feature.id)}
                              onChange={() => toggleFeature(offer.id, feature.id)}
                              className="mt-1 w-4 h-4 rounded border-gray-300"
                            />
                            <label
                              htmlFor={`${offer.id}-${feature.id}`}
                              className="flex-1 text-gray-700 text-xs md:text-sm cursor-pointer"
                            >
                              {feature.content}
                              {feature.price > 0 && (
                                <span className="text-blue-600 font-semibold mr-1">(+{feature.price} ريال)</span>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>

                      {offer.extra_expenses.length > 0 && (
                        <div className="border-t pt-2 mt-2">
                          <p className="text-xs text-gray-600 font-semibold mb-1">رسوم إضافية:</p>
                          {offer.extra_expenses.map((expense) => (
                            <div key={expense.id} className="flex justify-between text-xs text-gray-600">
                              <span>{expense.reason}</span>
                              <span>{expense.price} ريال</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 md:gap-3">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
                        <img
                          src={offer.company.image_url || "/placeholder.svg"}
                          alt={offer.company.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-left">
                        <div className="text-2xl md:text-3xl font-bold text-[#0a4a68]">{totalPrice.toFixed(2)}</div>
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
              )
            })}
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
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">{selectedOffer.company.name}</h3>
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-5">
                  {selectedOffer.extra_features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className="text-gray-700 text-sm md:text-base">{feature.content}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-gray-200 pt-3 md:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-semibold text-gray-700">المبلغ الإجمالي:</span>
                    <span className="text-2xl md:text-3xl font-bold text-[#0a4a68]">{selectedOffer.main_price} ريال</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-4 md:space-y-5">
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
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="h-11 md:h-12 text-center text-sm md:text-base border-2 rounded-lg md:rounded-xl focus:border-[#0a4a68]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-semibold text-sm md:text-base">CVV</label>
                    <Input
                      type="tel"
                      placeholder="000"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={3}
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

      {/* OTP Dialog */}
      {showOtpDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" dir="rtl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <img src="/visa.svg" alt="kd" width={50} />
              <span className="font-bold text-blue-800">Verified </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Enter verification code</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              We sent you a verification code by text message to (+966) 5******.
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
