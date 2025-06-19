'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target, Award, Crown } from 'lucide-react';

const loadingMessages = [
  "Researching sports history...",
  "Gathering legendary moments...",
  "Creating AI-powered video...",
  "Adding visual effects...",
  "Finalizing your reel...",
  "Almost ready to watch!"
];

const icons = [Trophy, Star, Zap, Target, Award, Crown];

interface LoadingAnimationProps {
  celebrityName?: string;
}

export function LoadingAnimation({ celebrityName }: LoadingAnimationProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const CurrentIcon = icons[currentMessage % icons.length];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md mx-auto text-center border border-white/20">
      <div className="relative mb-6 sm:mb-8">
        {/* Animated Icon Container */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full animate-spin opacity-20" />
          <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
          <div className="absolute inset-3 sm:inset-4 bg-white rounded-full flex items-center justify-center">
            <CurrentIcon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-bounce" />
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -inset-6 sm:-inset-8">
          {[...Array(6)].map((_, i) => {
            const IconComponent = icons[i];
            return (
              <div
                key={i}
                className="absolute w-4 h-4 sm:w-6 sm:h-6 text-white/40 animate-pulse"
                style={{
                  top: `${20 + (i * 15)}%`,
                  left: `${10 + (i * 15)}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s',
                }}
              >
                <IconComponent className="w-full h-full" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading Text */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {celebrityName ? `Generating ${celebrityName} Reel` : 'Creating Your Reel'}
        </h3>
        
        <p 
          key={currentMessage}
          className="text-white/80 text-base sm:text-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
        >
          {loadingMessages[currentMessage]}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 mt-4 sm:mt-6">
          <div 
            className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
        </div>
        
        <p className="text-white/60 text-sm mt-2">
          {Math.round(progress)}% Complete
        </p>

        {celebrityName && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/70 text-sm">
              Generating AI video for <span className="text-orange-400 font-semibold">{celebrityName}</span>
            </p>
          </div>
        )}
      </div>

      {/* Pulsing Dots */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}