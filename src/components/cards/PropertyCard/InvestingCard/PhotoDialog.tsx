import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface PhotoDialogProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const PhotoDialog = ({ open, onClose, images, currentIndex, setCurrentIndex }: PhotoDialogProps) => {
  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToImage = (index: number) => setCurrentIndex(index);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] border-0 p-0">
        <DialogHeader className="absolute top-4 left-6 z-10">
          <DialogTitle className="text-white bg-black/50 px-3 py-1 rounded-lg">
            {currentIndex + 1} / {images.length}
          </DialogTitle>
        </DialogHeader>

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/70"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white bg-black/50 hover:bg-black/70"
            onClick={prevImage}
            disabled={images.length <= 1}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white bg-black/50 hover:bg-black/70"
            onClick={nextImage}
            disabled={images.length <= 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
          <div className="flex gap-2 justify-center overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-white '
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoDialog;
