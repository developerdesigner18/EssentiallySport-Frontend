'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, RotateCcw, Share, Heart, Download , Bookmark, Search, Loader2, AlertCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Reel {
  id: string;
  celebrity: string;
  videoUrl: string;
  fileId: string;
  createdAt: Date;
}

interface ReelPlayerProps {
  reel: Reel;
  onBack: () => void;
  onGenerateNew: (celebrity: string) => void;
}

export function ReelPlayer({ reel, onBack, onGenerateNew }: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const updateDuration = () => {
      setDuration(video.duration);
      setVideoLoaded(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', () => setVideoLoaded(true));

    const playVideo = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        setIsPlaying(false);
      }
    };

    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', () => setVideoLoaded(true));
    };
  }, [reel.videoUrl]);

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

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    try {
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error restarting video:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${reel.celebrity} - Sports History Reel`,
      text: `Check out this amazing AI-generated history reel of ${reel.celebrity}!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    
    if (!trimmedSearch || isGenerating) return;

    const validationErr = validateCelebrityName(trimmedSearch);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    setValidationError('');
    setIsGenerating(true);
    
    try {
      await onGenerateNew(trimmedSearch);
      setSearchTerm('');
      setShowSearch(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  const handleDownloadReel = () => {
    const videoUrl = reel.videoUrl;
    window.open(videoUrl, '_blank');
  };



  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-full flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-white font-semibold text-sm sm:text-lg truncate">{reel.celebrity}</h1>
              <p className="text-white/70 text-xs sm:text-sm">AI-Generated Sports History</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="text-white hover:bg-white/20 rounded-full flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>

        {showSearch && (
          <div className="mt-3 sm:mt-4 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Generate reel for another celebrity..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={`bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:border-orange-400 focus:ring-orange-400/20 pr-20 ${
                    validationError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                  autoFocus
                  disabled={isGenerating}
                  maxLength={50}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 min-h-[30px] text-white disabled:opacity-50"
                  disabled={!searchTerm.trim() || isGenerating || !!validationError}
                >
                  {isGenerating ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <span className="text-xs sm:text-sm">Generate</span>
                  )}
                </Button>
              </div>
              
              {validationError && (
                <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      <div className="flex-1 relative bg-black flex items-center justify-center">
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-spin mx-auto mb-2 sm:mb-4" />
              <p className="text-white/80 text-sm sm:text-base">Loading video...</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="w-full h-full object-contain"
          muted={isMuted}
          playsInline
          controls={false}
          onClick={togglePlay}
          preload="metadata"
        />

        {!isPlaying && videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 hover:scale-110 transition-all"
            >
              <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
            </Button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <div className="w-full bg-white/30 rounded-full h-0.5 sm:h-1">
            <div
              className="bg-orange-500 h-0.5 sm:h-1 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="hidden sm:flex absolute right-3 sm:right-4 bottom-20 sm:bottom-24 flex-col gap-3 sm:gap-4">
       
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadReel}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
        >
          <Download className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
        >
          <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full backdrop-blur-sm transition-all ${
            isBookmarked
              ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          disabled={!videoLoaded}
        >
          {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
        >
          {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRestart}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          disabled={!videoLoaded}
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {duration > 0 && (
          <div className="ml-1 sm:ml-2 text-white/80 text-xs sm:text-sm font-medium">
            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
          </div>
        )}
      </div>

      <div className="sm:hidden absolute right-3 bottom-16 flex flex-col gap-2">
         <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadReel}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
        >
          <Download className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        

        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
        >
          <Share2 className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full backdrop-blur-sm transition-all ${
            isBookmarked
              ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <div className="absolute bottom-16 sm:bottom-20 left-3 sm:left-4 right-16 sm:right-20">
        <div className="space-y-1 sm:space-y-2">
          <Badge className="bg-orange-500/90 text-white border-0 text-xs">
            AI Generated
          </Badge>
          <h2 className="text-lg sm:text-2xl font-bold text-white line-clamp-2">{reel.celebrity}</h2>
          <p className="text-white/80 text-sm sm:text-base line-clamp-2">
            Discover the incredible journey and achievements that made {reel.celebrity} a sports legend.
          </p>
          <p className="text-white/60 text-xs sm:text-sm">
            Generated on {reel.createdAt ? new Date(reel.createdAt).toLocaleDateString() : ""}
          </p>
        </div>
      </div>
    </div>
  );
}