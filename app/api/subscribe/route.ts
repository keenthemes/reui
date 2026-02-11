import { NextResponse } from "next/server"

import { verifyRecaptchaToken } from "@/lib/recaptcha"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_LIST_ID = process.env.BREVO_LIST_ID

export async function POST(request: Request) {
  try {
    const recaptchaToken = request.headers.get("x-recaptcha-token")

    if (!recaptchaToken) {
      return NextResponse.json(
        { message: "reCAPTCHA verification required" },
        { status: 400 }
      )
    }

    const isValidToken = await verifyRecaptchaToken(recaptchaToken)

    if (!isValidToken) {
      return NextResponse.json(
        { message: "reCAPTCHA verification failed" },
        { status: 400 }
      )
    }

    // Parse the JSON body from the request
    const { email } = await request.json()

    // Validate the email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Invalid email provided." },
        { status: 400 }
      )
    }

    // Prepare the payload for Brevo
    const payload = {
      email,
      listIds: [parseInt(BREVO_LIST_ID || "", 10)], // Ensure list ID is an integer
      updateEnabled: true, // Update contact if already exists
    }

    // Call Brevo API to add the email to your list
    const brevoResponse = await fetch(
      "https://api.sendinblue.com/v3/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY || "",
        },
        body: JSON.stringify(payload),
      }
    )

    // Handle errors from Brevo
    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json()
      return NextResponse.json(
        { message: errorData.message || "Error subscribing email." },
        { status: brevoResponse.status }
      )
    }

    // Successfully subscribed
    return NextResponse.json(
      { message: "Successfully subscribed." },
      { status: 201 }
    )
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json(
      { message: "Oops! Something went wrong. Please try again in a moment." },
      { status: 500 }
    )
  }
}
