'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Invalid email or password. Please try again.')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="bg-[#E85D2A] rounded-xl p-3">
              <Car className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-white font-heading font-bold text-2xl">
            PISTON SOCIETY
          </h1>
          <p className="text-white/50 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-[#1E293B] font-bold font-heading text-xl mb-6">
            Sign In
          </h2>

          {error && (
            <div
              className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#EF4444] text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@pistonsociety.com.au"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          <p className="text-xs text-center text-[#94A3B8] mt-4">
            Admin access only. No public registration available.
          </p>
        </div>
      </div>
    </div>
  )
}
