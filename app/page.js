"use client";
import { useRouter } from "next/navigation";
import { Zap, BookOpen, Clock} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter(); 

  const features = [
    {
      icon: Zap,
      title: "AI Personas",
      description: "Choose unique AI personalities tailored for learning, interviews, or conversation.",
    },
    {
      icon: BookOpen,
      title: "Smart Memory",
      description: "Your sessions, preferences & chat styles automatically adapt over time.",
    },
    {
      icon: Clock,
      title: "Coming Soon",
      description: "User Auth and Mentor based features with personalised feedback...",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      
      <main className="w-full max-w-5xl text-center py-10 md:py-20">
        {/* Title & Subtitle Section */}
        <div className="w-full max-w-3xl mx-auto">
          {/* Title with Gradient */}
          <h1 className="font-extrabold text-5xl sm:text-6xl md:text-7xl mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400">
              Mentor AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Your personalised AI mentor, interviewer, teacher & guide — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/persona"
              className="w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-bold shadow-xl 
                         bg-blue-600 text-white 
                         hover:bg-blue-700 hover:shadow-2xl hover:scale-[1.02] 
                         transition-all duration-300"
            >
              Get Started Now
            </a>

            <a
              href="#features"
              className="w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-semibold border-2 
                         border-gray-300 bg-white text-gray-700 
                         hover:bg-gray-50 hover:border-gray-400 hover:scale-[1.02] 
                         transition-all duration-300
                         dark:bg-gray-950 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Feature Section */}
        <div id="features" className="mt-20">
          <h2 className="text-3xl font-bold mb-10 text-gray-800 dark:text-white">
            What Can Mentor AI Do For You?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl border border-gray-200 shadow-lg 
                           bg-white dark:bg-gray-800 dark:border-gray-700 
                           hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 mb-4 text-blue-500 dark:text-blue-400" />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl border-t border-gray-100 dark:border-gray-800 mt-10 pt-4 pb-2">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} Mentor AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}