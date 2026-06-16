'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import {
  Music,
  Zap,
  Globe,
  Shield,
  Sparkles,
  Mic,
  Upload,
  Download,
  Play,
  ArrowRight,
  Star,
  Users,
  Music2,
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Advanced AI models create professional-quality songs from your lyrics in seconds.',
  },
  {
    icon: Mic,
    title: 'Voice Recording',
    description: 'Record your voice directly in the browser and transform it into a complete song.',
  },
  {
    icon: Upload,
    title: 'Audio Upload',
    description: 'Upload existing audio and let AI enhance it with professional backing tracks.',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Create songs in English, Arabic, and more languages with native-quality output.',
  },
  {
    icon: Music,
    title: '10+ Music Genres',
    description: 'From Pop to Khaleeji, choose from a wide range of professional music styles.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Your data is protected with bank-level encryption and security measures.',
  },
];

const stats = [
  { icon: Users, value: '50K+', label: 'Active Users' },
  { icon: Music2, value: '1M+', label: 'Songs Created' },
  { icon: Star, value: '4.9/5', label: 'User Rating' },
  { icon: Zap, value: '99.9%', label: 'Uptime' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Music Producer',
    content: 'Melody AI has revolutionized my workflow. I can now create demo tracks in minutes instead of hours.',
    avatar: '👩‍🎤',
  },
  {
    name: 'Ahmed Al-Rashid',
    role: 'Content Creator',
    content: 'The Arabic language support is incredible. Finally, an AI that understands Khaleeji music!',
    avatar: '🧑‍🎨',
  },
  {
    name: 'Maria Garcia',
    role: 'Independent Artist',
    content: 'I created an entire album using Melody AI. The quality is indistinguishable from studio recordings.',
    avatar: '👩‍🎵',
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-purple-400 text-sm">AI Music Generation Platform</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Transform Words</span>
              <br />
              <span className="text-white">Into Professional Songs</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Create studio-quality music from your lyrics, voice, or audio files. 
              Powered by advanced AI, supporting multiple languages and genres.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="xl" className="w-full sm:w-auto">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Creating Free
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  <Play className="mr-2 h-5 w-5" />
                  Try Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to create professional music with AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:border-purple-500/40 transition-all duration-300 group">
                  <feature.icon className="h-12 w-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-transparent to-purple-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-xl text-gray-400">
              Create your first song in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Input Your Lyrics',
                description: 'Write your lyrics, record your voice, or upload an audio file.',
                icon: Music,
              },
              {
                step: '2',
                title: 'Choose Style',
                description: 'Select genre, mood, voice type, and customize your song.',
                icon: Sparkles,
              },
              {
                step: '3',
                title: 'Generate & Download',
                description: 'AI creates your song. Download, share, or create more!',
                icon: Download,
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by <span className="text-gradient">Creators</span>
            </h2>
            <p className="text-xl text-gray-400">
              See what our users are saying about Melody AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-gray-300 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create <span className="text-gradient">Magic?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of creators who are already making amazing music with Melody AI.
              Start for free, no credit card required.
            </p>
            <Link href="/register">
              <Button size="xl" className="animate-glow">
                <Zap className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
