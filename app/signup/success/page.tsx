import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Icons.logo className="h-8 w-8" />
        <span className="text-2xl font-bold text-foreground">Cheffry</span>
      </Link>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
            <Icons.check className="h-8 w-8 text-success" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Please check your email and click the confirmation link to activate your account. Once confirmed, you can
            start using Cheffry.
          </p>
          <Button variant="outline" asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
