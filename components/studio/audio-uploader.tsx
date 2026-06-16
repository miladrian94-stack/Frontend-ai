'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  FileAudio,
  X,
  Check,
  AlertCircle,
  Music2,
} from 'lucide-react';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
}

export function AudioUploader({
  onFileSelect,
  accept = 'audio/*',
  maxSize = 50 * 1024 * 1024, // 50MB
}: AudioUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
      } else {
        setError('Invalid file type. Please upload an audio file.');
      }
      return;
    }

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    onFileSelect(selectedFile);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        toast({
          title: 'File Ready',
          description: `${selectedFile.name} has been uploaded successfully.`,
        });
      }
    }, 100);
  }, [maxSize, onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm'] },
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {error && (
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-400 font-medium">Upload Error</h4>
              <p className="text-red-300/70 text-sm mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getRootProps()}
          >
            <Card
              className={`p-12 border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isDragActive
                  ? 'border-purple-500 bg-purple-500/10 scale-105'
                  : 'border-gray-700 hover:border-purple-500/50 hover:bg-gray-900/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <motion.div
                  animate={isDragActive ? { scale: 1.1, y: -10 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Upload className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? 'Drop Your Audio Here' : 'Upload Audio File'}
                </h3>
                <p className="text-gray-400 mb-4">
                  Drag & drop or click to browse
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span>MP3</span>
                  <span>•</span>
                  <span>WAV</span>
                  <span>•</span>
                  <span>OGG</span>
                  <span>•</span>
                  <span>FLAC</span>
                </div>
                <p className="text-gray-600 text-xs mt-4">
                  Maximum file size: {formatFileSize(maxSize)}
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-6 bg-black/50 border-purple-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <FileAudio className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{file.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {file.type}
                      </Badge>
                      <span className="text-gray-500 text-xs">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-400"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {uploadProgress < 100 ? (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Uploading...</span>
                    <span className="text-purple-400">{uploadProgress}%</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-400">
                  <Check className="h-5 w-5" />
                  <span className="text-sm">Ready to use</span>
                </div>
              )}

              {/* Audio Preview */}
              {uploadProgress === 100 && (
                <div className="mt-4">
                  <audio controls className="w-full">
                    <source src={URL.createObjectURL(file)} type={file.type} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
