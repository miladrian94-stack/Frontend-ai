'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Check, Crown, Zap } from 'lucide-react';
import { subscriptionTiers } from '@/config/site';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Simple Pricing</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {Object.entries(subscriptionTiers).map(([key, tier], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={key === 'PRO' ? 'lg:-mt-4 lg:mb-4' : ''}
            >
              <Card className={`p-6 h-full relative ${
                key === 'PRO' ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' : ''
              }`}>
                {key === 'PRO' && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-gradient mb-2">
                    ${tier.price}
                    <span className="text-lg text-gray-400">/mo</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {tier.credits === -1 ? 'Unlimited' : tier.credits.toLocaleString()} credits
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant={key === 'PRO' ? 'premium' : key === 'FREE' ? 'outline' : 'default'}
                >
                  {key === 'FREE' ? 'Get Started' : 'Upgrade'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
