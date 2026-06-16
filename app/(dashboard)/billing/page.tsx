'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Crown,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

export default function BillingPage() {
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [subRes, payRes] = await Promise.all([
        fetch('/api/subscriptions'),
        fetch('/api/payments/billing'),
      ]);
      
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData);
      }
      
      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'stripe' }),
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open subscription management.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-gray-400 mt-1">Manage your subscription and payment methods.</p>
      </motion.div>

      <div className="grid gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-purple-400" />
              <span>Current Plan</span>
            </CardTitle>
            <CardDescription>You are currently on the following plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl font-bold text-white">
                    {subscription?.currentTier || 'Free'}
                  </h3>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    Active
                  </Badge>
                </div>
                <p className="text-gray-400 mt-1">
                  {subscription?.tierDetails?.songsPerMonth || 5} songs per month
                </p>
              </div>
              <Link href="/pricing">
                <Button variant="premium">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              </Link>
            </div>
            
            {subscription?.subscription && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Period</span>
                  <span className="text-white">
                    {new Date(subscription.subscription.currentPeriodStart).toLocaleDateString()} - 
                    {new Date(subscription.subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span>Payment History</span>
            </CardTitle>
            <CardDescription>View your recent payments and invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50"
                  >
                    <div>
                      <p className="text-white font-medium">
                        ${payment.amount.toFixed(2)} {payment.currency}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={
                          payment.status === 'completed'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }
                      >
                        {payment.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-gray-400 mb-2">No payments yet</h3>
                <p className="text-gray-600 text-sm">
                  Your payment history will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
