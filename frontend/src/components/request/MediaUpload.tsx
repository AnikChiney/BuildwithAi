import React, { useEffect, useRef, useState } from 'react';
import { Image, Upload, Video, X } from 'lucide-react';

export interface SelectedMedia {
  file: File;
  previewUrl: string;
}

interface MediaUploadProps {
  files: SelectedMedia[];
  onChange: (files: SelectedMedia[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

export const MediaUpload: React.FC<MediaUploadProps> = ({
  files,
  onChange,
  disabled = false,
  maxFiles = 5,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');

  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach(item => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const addFiles = (selected: FileList | null) => {
    if (!selected || selected.length === 0) return;

    setError('');
    const next = [...files];

    for (const file of Array.from(selected)) {
      if (next.length >= maxFiles) {
        setError(`You can upload up to ${maxFiles} files.`);
        break;
      }

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        setError('Only JPG, PNG, WEBP images and MP4, WEBM, MOV videos are supported.');
        continue;
      }

      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        setError(
          `${file.name} is too large. Images must be ≤ 10 MB and videos ≤ 100 MB.`
        );
        continue;
      }

      next.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    onChange(next);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(files[index].previewUrl);
    onChange(files.filter((_, i) => i !== index));
    setError('');
  };

  return (
    <div className="mt-4 rounded-xl border border-brand-border bg-brand-surface-alt p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-text">Add photo or video</p>
          <p className="mt-1 text-xs text-brand-text-muted">
            Attach evidence of the issue. Up to {maxFiles} files.
          </p>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || files.length >= maxFiles}
          className="inline-flex items-center gap-2 rounded-lg border border-brand-primary bg-white px-3 py-2 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={e => addFiles(e.target.files)}
          disabled={disabled}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.map((item, index) => {
            const isVideo = item.file.type.startsWith('video/');

            return (
              <div
                key={`${item.file.name}-${index}`}
                className="group relative overflow-hidden rounded-lg border border-brand-border bg-white"
              >
                {isVideo ? (
                  <video
                    src={item.previewUrl}
                    className="h-28 w-full object-cover"
                    muted
                    controls
                  />
                ) : (
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-28 w-full object-cover"
                  />
                )}

                <div className="flex items-center gap-1 px-2 py-2">
                  {isVideo ? (
                    <Video className="h-3.5 w-3.5 text-brand-secondary" />
                  ) : (
                    <Image className="h-3.5 w-3.5 text-brand-secondary" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-[10px] text-brand-text-muted">
                    {item.file.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  aria-label={`Remove ${item.file.name}`}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white hover:bg-black disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-brand-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
