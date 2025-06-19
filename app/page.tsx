'use client';

import { useState, useEffect } from 'react';
import { Search, Play, Loader2, Star, Users, Trophy, ChevronRight, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReelPlayer } from '@/components/ReelPlayer';
import { LoadingAnimation } from '@/components/LoadingAnimation';

interface GeneratedReel {
  id: string;
  celebrity: string;
  videoUrl: string;
  fileId: string;
  createdAt: Date;
}

const popularCelebrities = [
  { name: 'Saurav Ganguly', sport: 'Cricket', country: 'India' },
  { name: 'Virat Kohli', sport: 'Cricket', country: 'India' },
  { name: 'MS Dhoni', sport: 'Cricket', country: 'India' },
  { name: 'Lionel Messi', sport: 'Football', country: 'Argentina' },
  { name: 'Cristiano Ronaldo', sport: 'Football', country: 'Portugal' },
  { name: 'LeBron James', sport: 'Basketball', country: 'USA' },
  { name: 'Serena Williams', sport: 'Tennis', country: 'USA' },
  { name: 'Roger Federer', sport: 'Tennis', country: 'Switzerland' },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReel, setCurrentReel] = useState<GeneratedReel | null>(null);
  const [reelHistory, setReelHistory] = useState<GeneratedReel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredCelebrities, setFilteredCelebrities] = useState(popularCelebrities);
  const [generatingFor, setGeneratingFor] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
    useEffect(() => {
      const savedHistory = localStorage.getItem("reelHistory");
      if (savedHistory) {
        setReelHistory(JSON.parse(savedHistory));
      }
    }, []);

  useEffect(() => {
    const filtered = popularCelebrities.filter(celebrity =>
      celebrity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      celebrity.sport.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCelebrities(filtered);
  }, [searchTerm]);

 
  const validateCelebrityName = (name: string): string => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return 'Please enter a celebrity name';
    }
    
    if (trimmedName.length < 2) {
      return 'Celebrity name must be at least 2 characters long';
    }
    
    if (trimmedName.length > 50) {
      return 'Celebrity name must be less than 50 characters';
    }
    
 
    const validNameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!validNameRegex.test(trimmedName)) {
      return 'Celebrity name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
  
    if (trimmedName.includes('  ')) {
      return 'Please remove extra spaces from the name';
    }
    

    if (/^\d+$/.test(trimmedName)) {
      return 'Please enter a valid celebrity name, not just numbers';
    }
    
    return '';
  };

  const generateReel = async (celebrityName: string) => {
    const validationErr = validateCelebrityName(celebrityName);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    setValidationError('');
    setIsGenerating(true);
    setGeneratingFor(celebrityName);
    setError(null);
    setCurrentReel(null);

    try {
      
      const response = await fetch('http://localhost:5000/api/generate/reel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          celebrity: celebrityName.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 1 && data.data) {
        const newReel: GeneratedReel = {
          id: data.data.fileId,
          celebrity: celebrityName.trim(),
          videoUrl: data.data.videoUrl,
          fileId: data.data.fileId,
          createdAt: new Date(),
        };

        setCurrentReel(newReel);
        // setReelHistory(prev => [newReel, ...prev.slice(0, 9)]);
        setReelHistory(prev => {
        const updatedHistory = [newReel, ...prev.slice(0, 9)];
        localStorage.setItem("reelHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });

      } else {
        throw new Error(data.message || 'Failed to generate reel');
      }
    } catch (err) {
      console.error('Error generating reel:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating the reel. Please try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingFor('');
    }
  };

  const handleCelebritySelect = (celebrity: typeof popularCelebrities[0]) => {
    generateReel(celebrity.name);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      generateReel(searchTerm.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (validationError) {
      setValidationError('');
    }
  };

  if (currentReel) {
    return (
      <ReelPlayer
        reel={currentReel}
        onBack={() => setCurrentReel(null)}
        onGenerateNew={(celebrity) => generateReel(celebrity)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-12 sm:pb-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-6 sm:mb-8">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">AI-Powered Sports History</span>
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
              Sports Celebrity
              <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                History Reels
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              Generate incredible AI-powered video stories of your favorite sports legends
            </p>
            <div className="max-w-lg mx-auto mb-8 sm:mb-16 px-4">
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="relative">
                 <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Search className="text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                 </div>

                  <Input
                    type="text"
                    placeholder="Enter any sports celebrity name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`pl-10 sm:pl-12 pr-4 py-4 sm:py-6 text-base sm:text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl sm:rounded-2xl transition-all duration-200 ${
                      validationError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                    }`}
                    maxLength={50}
                  />
                  <Button
                    type="submit"
                    disabled={!searchTerm.trim() || isGenerating || !!validationError}
                    className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 disabled:opacity-0 text-sm sm:h-10 h-8 min-h-[30px] sm:text-base"
                  >
                    {isGenerating && generatingFor === searchTerm.trim() ?  (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <>
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Generate</span>
                      </>
                    )}
                  </Button>
                </div>
                {validationError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {searchTerm && filteredCelebrities.length > 0 && isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-10">
                    {filteredCelebrities.slice(0, 5).map((celebrity) => (
                      <button
                        key={celebrity.name}
                        type="button"
                        onClick={() => {
                          setSearchTerm(celebrity.name);
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                      >
                        <div className="font-medium">{celebrity.name}</div>
                        <div className="text-xs text-white/60">{celebrity.sport} • {celebrity.country}</div>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-sm sm:max-w-md mx-auto px-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">1000+</div>
                <div className="text-white/60 text-xs sm:text-sm">Celebrities</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">50+</div>
                <div className="text-white/60 text-xs sm:text-sm">Sports</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">AI</div>
                <div className="text-white/60 text-xs sm:text-sm">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <LoadingAnimation celebrityName={generatingFor} />
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Generation Failed</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
              <Button
                onClick={() => setError(null)}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Popular Sports Legends</h2>
          <Badge variant="secondary" className="bg-white/10 text-white/80 self-start sm:self-auto">
            <Users className="w-3 h-3 mr-1" />
            {filteredCelebrities.length} Available
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCelebrities.map((celebrity, index) => (
            <Card
              key={celebrity.name}
              className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                  {celebrity.name}
                </h3>
                
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
                  <Badge variant="outline" className="border-white/20 text-white/80 text-xs px-2 py-0.5">
                    {celebrity.sport}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white/80 text-xs px-2 py-0.5">
                    {celebrity.country}
                  </Badge>
                </div>
                
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 disabled:opacity-50 text-sm py-2"
                  disabled={isGenerating}
                  onClick={() => handleCelebritySelect(celebrity)}
                >
                  {isGenerating && generatingFor === celebrity.name ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      <span className="hidden sm:inline">Generating...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Generate Reel</span>
                      <span className="sm:hidden">Generate</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {reelHistory.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Recently Generated Reels</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {reelHistory.slice(0, 5).map((reel) => (
                <Card
                  key={reel.id}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => setCurrentReel(reel)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="aspect-[9/16] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-2 sm:mb-3 flex items-center justify-center group-hover:from-orange-500/20 group-hover:to-yellow-500/20 transition-all">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 font-medium truncate">{reel.celebrity}</p>
                    <p className="text-xs text-white/60"> {reel.createdAt ? new Date(reel.createdAt).toLocaleDateString() : ""}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}