'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Music,
  Mail,
  ArrowLeft,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      if (res.ok) {
        setIsSent(true);
        toast({
          title: 'Email Sent',
          description: 'Check your inbox for password reset instructions.',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Music className="h-10 w-10 text-purple-500" />
            <span className="text-3xl font-bold text-gradient">Melody AI</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isSent ? 'Check Your Email' : 'Forgot Password'}
            </CardTitle>
            <CardDescription>
              {isSent
                ? 'We sent a password reset link to your email'
                : 'Enter your email to receive a password reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-16 w-16 text-green-400" />
                  </div>
                </div>
                <p className="text-gray-300">
                  We've sent a password reset link to <strong>{form.getValues('email')}</strong>
                </p>
                <p className="text-gray-500 text-sm">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    try again
                  </button>
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Resend Email
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      {...form.register('email')}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Send Reset Link
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
