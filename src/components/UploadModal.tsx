import { useState, useCallback } from 'react';
import { Upload, FileText, Image as ImageIcon, Check, Loader2, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SummaryTheme {
  title: string;
  points: string[];
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [summary, setSummary] = useState<{
    themes: SummaryTheme[];
    flashcards: { front: string; back: string }[];
  } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      processFile(droppedFile);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  }, []);

  const processFile = (_file: File) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      setSummary({
        themes: [
          {
            title: 'Spaced Repetition',
            points: [
              'Review material at increasing intervals',
              'Improves long-term retention significantly',
              'Based on Ebbinghaus forgetting curve',
            ],
          },
          {
            title: 'Active Recall',
            points: [
              'Test yourself instead of re-reading',
              'Strengthens neural connections',
              'More effective than passive review',
            ],
          },
          {
            title: 'Interleaving',
            points: [
              'Mix different topics during study',
              'Improves problem-solving skills',
              'Prevents context-dependent memory',
            ],
          },
        ],
        flashcards: [
          { front: 'What is spaced repetition?', back: 'A learning technique with increasing review intervals.' },
          { front: 'Why is active recall effective?', back: 'It strengthens memory through retrieval practice.' },
          { front: 'What is interleaving?', back: 'Mixing different topics during study sessions.' },
        ],
      });
    }, 2500);
  };

  const resetModal = () => {
    setFile(null);
    setIsProcessing(false);
    setIsComplete(false);
    setSummary(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto bg-surface rounded-[24px] p-0 border-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-heading text-2xl text-violet flex items-center gap-3">
            {!isComplete ? (
              <>
                <div className="w-10 h-10 bg-lime/20 rounded-xl flex items-center justify-center">
                  <Upload size={20} className="text-lime" />
                </div>
                {t.uploadModal.titleUpload}
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-lime/20 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-lime" />
                </div>
                {t.uploadModal.titleReady}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {!file && !isComplete && (
            <>
              <p className="font-body text-[15px] text-violet/90 leading-relaxed mb-6">
                {t.uploadModal.intro}
              </p>

              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-[20px] p-12 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-lime bg-lime/10'
                    : 'border-violet/20 hover:border-violet/40 bg-violet/5'
                }`}
              >
                <div className="w-16 h-16 bg-lime/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-lime" />
                </div>
                <p className="font-heading text-lg text-violet mb-2">
                  {t.uploadModal.dropHere}
                </p>
                <p className="font-body text-[15px] text-violet/90 mb-4">
                  {t.uploadModal.orClick}
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button
                    variant="outline"
                    className="border-violet/30 text-violet hover:bg-violet/5"
                    asChild
                  >
                    <span>{t.uploadModal.selectFile}</span>
                  </Button>
                </label>
              </div>

              {/* Supported formats */}
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-violet/85">
                  <FileText size={16} />
                  <span className="font-body text-sm font-medium">PDF</span>
                </div>
                <div className="flex items-center gap-2 text-violet/85">
                  <ImageIcon size={16} />
                  <span className="font-body text-sm font-medium">Images</span>
                </div>
                <div className="flex items-center gap-2 text-violet/85">
                  <BookOpen size={16} />
                  <span className="font-body text-sm font-medium">Documents</span>
                </div>
              </div>
            </>
          )}

          {file && isProcessing && (
            <div className="py-12 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-lime/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-lime rounded-full flex items-center justify-center">
                  <Loader2 size={32} className="text-violet animate-spin" />
                </div>
              </div>
              <h3 className="font-heading text-xl text-violet mb-2">
                {t.uploadModal.analyzing}
              </h3>
              <p className="font-body text-[15px] text-violet/90">
                {t.uploadModal.extracting}
              </p>
            </div>
          )}

          {isComplete && summary && (
            <div className="space-y-6">
              {/* Summary Themes */}
              <div>
                <h3 className="font-heading text-lg text-violet mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-lime" />
                  {t.uploadModal.keyThemes}
                </h3>
                <div className="space-y-3">
                  {summary.themes.map((theme, index) => (
                    <div
                      key={index}
                      className="bg-violet/5 rounded-xl p-4 border border-violet/10"
                    >
                      <h4 className="font-heading text-sm text-violet mb-2">
                        {theme.title}
                      </h4>
                      <ul className="space-y-1">
                        {theme.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-lime mt-0.5">•</span>
                            <span className="font-body text-[15px] text-violet/90">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flashcards Preview */}
              <div>
                <h3 className="font-heading text-lg text-violet mb-4 flex items-center gap-2">
                  <HelpCircle size={20} className="text-lime" />
                  {t.uploadModal.generatedFlashcards}
                </h3>
                <div className="grid gap-3">
                  {summary.flashcards.map((card, index) => (
                    <div
                      key={index}
                      className="bg-lime/10 rounded-xl p-4 border border-lime/30"
                    >
                      <p className="font-body text-sm text-violet font-medium mb-1">
                        Q: {card.front}
                      </p>
                      <p className="font-body text-[15px] text-violet/90">
                        A: {card.back}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={resetModal}
                  variant="outline"
                  className="flex-1 border-violet/30 text-violet hover:bg-violet/5"
                >
                  {t.uploadModal.uploadAnother}
                </Button>
                <Button
                  className="flex-1 bg-lime text-violet hover:bg-lime-dark"
                >
                  <Check size={18} className="mr-2" />
                  {t.uploadModal.saveToLibrary}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
