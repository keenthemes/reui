// Description: Advanced clean login form card
// Order: 12

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Card className="mx-auto w-full max-w-xs">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="grid gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email-12">Email address</FieldLabel>
              <Input
                id="email-12"
                type="email"
                placeholder="name@example.com"
                required
              />
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password-12">Password</FieldLabel>
                <a
                  href="#"
                  className="text-muted-foreground text-xs underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="password-12"
                  placeholder="Password"
                  type={isVisible ? "text" : "password"}
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <IconPlaceholder
                        lucide="EyeOffIcon"
                        tabler="IconEyeOff"
                        hugeicons="ViewOffSlashIcon"
                        phosphor="EyeSlashIcon"
                        remixicon="RiEyeOffLine"
                        aria-hidden="true"
                      />
                    ) : (
                      <IconPlaceholder
                        lucide="EyeIcon"
                        tabler="IconEye"
                        hugeicons="ViewIcon"
                        phosphor="EyeIcon"
                        remixicon="RiEyeLine"
                        aria-hidden="true"
                      />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
          <div className="flex flex-col gap-6">
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <FieldSeparator className="text-xs">
              Or continue with
            </FieldSeparator>
            <Button variant="outline" className="w-full">
              <IconPlaceholder
                lucide="GithubIcon"
                tabler="IconBrandGithub"
                hugeicons="GithubIcon"
                phosphor="GithubLogoIcon"
                remixicon="RiGithubLine"
                aria-hidden="true"
              />
              Github
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground w-full text-center text-xs">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
