// Detect card type based on card number prefix
export function detectCardType(cardNumber: string): string | null {
  const cleanNumber = cardNumber.replace(/\s/g, "")

  // Visa: starts with 4
  if (/^4/.test(cleanNumber)) {
    return "Visa"
  }

  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return "Mastercard"
  }

  // Mada: Saudi cards (various BINs)
  const madaBins = [
    "588845",
    "440647",
    "440795",
    "446404",
    "457865",
    "968208",
    "636120",
    "417633",
    "468540",
    "468541",
    "468542",
    "468543",
    "968201",
    "446393",
    "588848",
    "468544",
    "411111",
  ]
  if (madaBins.some((bin) => cleanNumber.startsWith(bin))) {
    return "Mada"
  }

  return null
}

// Format card number with spaces
export function formatCardNumber(value: string): string {
  const cleanValue = value.replace(/\D/g, "")
  const groups = cleanValue.match(/.{1,4}/g)
  return groups ? groups.join(" ").slice(0, 19) : ""
}

// Format expiry date as MM/YY
export function formatExpiryDate(value: string): string {
  const cleanValue = value.replace(/\D/g, "")

  if (cleanValue.length >= 2) {
    return cleanValue.slice(0, 2) + "/" + cleanValue.slice(2, 4)
  }

  return cleanValue
}

// Get bank info based on BIN (first 6 digits)
export function getBankInfo(cardNumber: string): { name: string; country: string } | null {
  const cleanNumber = cardNumber.replace(/\s/g, "")

  if (cleanNumber.length < 6) return null

  const bin = cleanNumber.slice(0, 6)

  // Sample bank identification (in production, use a BIN database API)
  const bankDatabase: Record<string, { name: string; country: string }> = {
    "411111": { name: "Chase Bank", country: "USA" },
    "424242": { name: "Stripe Test", country: "USA" },
    "588845": { name: "Al Rajhi Bank", country: "Saudi Arabia" },
    "440647": { name: "Riyad Bank", country: "Saudi Arabia" },
    "446404": { name: "Saudi National Bank", country: "Saudi Arabia" },
  }

  return bankDatabase[bin] || null
}
