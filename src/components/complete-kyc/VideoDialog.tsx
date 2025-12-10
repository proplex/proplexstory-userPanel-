"use client";

import dynamic from 'next/dynamic';
import { X } from "lucide-react";

const Dialog = dynamic(
  () => import("@/components/ui/dialog").then(mod => mod.Dialog),
  { ssr: false }
);
const DialogContent = dynamic(
  () => import("@/components/ui/dialog").then(mod => mod.DialogContent),
  { ssr: false }
);
const DialogHeader = dynamic(
  () => import("@/components/ui/dialog").then(mod => mod.DialogHeader),
  { ssr: false }
);
const DialogTitle = dynamic(
  () => import("@radix-ui/react-dialog").then(mod => mod.DialogTitle),
  { ssr: false }
);

const getFormattedVideoUrl = (url: string) => {
  if (!url) return '';
  
  try {
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/embed/')) {
      return url; // Already in correct format
    }
    return url; // Return original URL if not YouTube
  } catch (error) {
    console.error('Error formatting video URL:', error);
    return '';
  }
};

interface VideoDialogProps {
  isVideoOpen: boolean;
  setIsVideoOpen: (open: boolean) => void;
  media_value: string;
  name: string;
}

const VideoDialog = ({ isVideoOpen, setIsVideoOpen, media_value, name }: VideoDialogProps) => {
  const formattedUrl = getFormattedVideoUrl(media_value);

  return (
    <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
      <DialogContent className="max-w-[90vw] w-[1000px] p-0 gap-0 bg-black/95 border-zinc-800">
        <div className="relative flex flex-col w-full h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-zinc-100">
                {name || 'Project Video'}
              </DialogTitle>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="p-2 transition-colors rounded-full hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </DialogHeader>
          {/* Video Content */}
          <div className="relative w-full h-[calc(100vh-200px)]">
            {formattedUrl ? (
              <iframe
                src={formattedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-zinc-400">
                No video available
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;