"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, loginStatus } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState("")

  const isLoading = loginStatus.isPending
  const apiError = useMemo(() => {
    const error = loginStatus.error as any
    return error?.response?.data?.message || ""
  }, [loginStatus.error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!email.includes("@")) {
      setLocalError("Please enter a valid email address.")
      return
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.")
      return
    }

    await login({ email, password })
    router.replace("/dashboard")
  }

  const errorMessage = localError || apiError

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">CreatorFlow</p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to manage brand deals with clarity and speed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-background shadow-sm transition focus-visible:ring-2 focus-visible:ring-primary/30"
                  placeholder="you@creatorflow.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl border-border/60 bg-background shadow-sm transition focus-visible:ring-2 focus-visible:ring-primary/30 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2 animate-in fade-in-0">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full rounded-xl shadow-sm transition-transform hover:scale-[1.01]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/60 border-t-primary-foreground animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              New to CreatorFlow?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <img
            src="/auth-illustration.svg"
            alt="CreatorFlow dashboard preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/0 via-background/10 to-background/30" />
        </div>
      </div>
    </div>
  )
}
