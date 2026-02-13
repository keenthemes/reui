import { NextResponse } from "next/server"

import { verifyRecaptchaToken } from "@/lib/recaptcha"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_LIST_ID = process.env.BREVO_LIST_ID
const isDev = process.env.NODE_ENV === "development"

export async function POST(request: Request) {
  try {
    // Validate server config early
    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      console.error("Missing BREVO_API_KEY or BREVO_LIST_ID env vars")
      return NextResponse.json(
        { message: "Newsletter service is temporarily unavailable." },
        { status: 503 }
      )
    }

    const listId = parseInt(BREVO_LIST_ID, 10)
    if (isNaN(listId)) {
      console.error("BREVO_LIST_ID is not a valid number:", BREVO_LIST_ID)
      return NextResponse.json(
        { message: "Newsletter service is temporarily unavailable." },
        { status: 503 }
      )
    }

    // Skip reCAPTCHA in development environment
    if (!isDev) {
      const recaptchaToken = request.headers.get("x-recaptcha-token")

      if (!recaptchaToken) {
        return NextResponse.json(
          { message: "reCAPTCHA verification required." },
          { status: 400 }
        )
      }

      const isValidToken = await verifyRecaptchaToken(recaptchaToken)

      if (!isValidToken) {
        return NextResponse.json(
          { message: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        )
      }
    }

    // Parse the JSON body from the request
    const { email } = await request.json()

    // Validate the email format server-side
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { message: "Invalid email address. Please check and try again." },
        { status: 400 }
      )
    }

    // Prepare the payload for Brevo
    const payload = {
      email,
      listIds: [listId],
      updateEnabled: true, // Update contact if already exists
    }

    // Call Brevo API to add the email to your list
    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    // Handle errors from Brevo
    if (!brevoResponse.ok) {
      let errorMessage = "Error subscribing email. Please try again later."
      try {
        const errorData = await brevoResponse.json()
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch {
        // Brevo returned a non-JSON error response — use default message
      }
      return NextResponse.json(
        { message: errorMessage },
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
      { message: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    )
  }
}
