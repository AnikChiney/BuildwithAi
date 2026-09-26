import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImagePlus,
  Upload,
  Video,
  X,
} from 'lucide-react';
import './MediaUpload.css';

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
  const [uploadType, setUploadType] = useState<'image' | 'video' | null>(null);
  const [error, setError] = useState('');

  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach(item => {
        URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const openFilePicker = (type: 'image' | 'video') => {
    if (disabled || files.length >= maxFiles) return;

    setError('');
    setUploadType(type);

    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

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

      if (uploadType === 'image' && !isImage) {
        setError('Please select a valid image file.');
        continue;
      }

      if (uploadType === 'video' && !isVideo) {
        setError('Please select a valid video file.');
        continue;
      }

      if (!isImage && !isVideo) {
        setError(
          'Only JPG, PNG, WEBP images and MP4, WEBM, MOV videos are supported.'
        );
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

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setUploadType(null);
  };

  const removeFile = (index: number) => {
    const file = files[index];

    if (file) {
      URL.revokeObjectURL(file.previewUrl);
    }

    onChange(files.filter((_, i) => i !== index));
    setError('');
  };

  const removeAll = () => {
    files.forEach(item => {
      URL.revokeObjectURL(item.previewUrl);
    });

    onChange([]);
    setError('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="media-upload">
      {/* Header */}
      <div className="media-upload__header">
        <div className="media-upload__title-wrap">
          <div className="media-upload__icon">
            <ImagePlus size={19} />
          </div>

          <div>
            <h3>Add photo or video</h3>
            <p>
              Attach visual evidence to help explain the issue.
            </p>
          </div>
        </div>

        <span className="media-upload__counter">
          {files.length}/{maxFiles}
        </span>
      </div>

      {/* Upload Box */}
      <div
        className={`media-upload__dropzone ${
          disabled ? 'media-upload__dropzone--disabled' : ''
        }`}
      >
        <div className="media-upload__drop-icon">
          <Upload size={22} />
        </div>

        <h4>Attach supporting media</h4>

        <p>
          Photos and videos can make your report easier to understand.
        </p>

        <div className="media-upload__actions">
          <button
            type="button"
            className="media-upload__button"
            onClick={() => openFilePicker('image')}
            disabled={disabled || files.length >= maxFiles}
          >
            <Image size={17} />
            <span>Add Photo</span>
          </button>

          <button
            type="button"
            className="media-upload__button"
            onClick={() => openFilePicker('video')}
            disabled={disabled || files.length >= maxFiles}
          >
            <Video size={17} />
            <span>Add Video</span>
          </button>
        </div>

        <div className="media-upload__formats">
          <span>JPG</span>
          <span>PNG</span>
          <span>WEBP</span>
          <span>MP4</span>
          <span>WEBM</span>
          <span>MOV</span>
        </div>

        <p className="media-upload__limits">
          Images up to 10 MB · Videos up to 100 MB
        </p>
      </div>

      {/* IMPORTANT:
          Inline display:none guarantees the native input
          cannot accidentally appear even if Tailwind is unavailable.
      */}
      <input
        ref={inputRef}
        type="file"
        accept={
          uploadType === 'image'
            ? 'image/jpeg,image/png,image/webp'
            : uploadType === 'video'
              ? 'video/mp4,video/webm,video/quicktime'
              : 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime'
        }
        multiple
        style={{ display: 'none' }}
        onChange={e => addFiles(e.target.files)}
        disabled={disabled}
      />

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="media-upload__selected">
          <div className="media-upload__selected-header">
            <div>
              <h4>Selected media</h4>
              <span>
                {files.length} {files.length === 1 ? 'file' : 'files'} attached
              </span>
            </div>

            <button
              type="button"
              onClick={removeAll}
              disabled={disabled}
              className="media-upload__remove-all"
            >
              Remove all
            </button>
          </div>

          <div className="media-upload__grid">
            {files.map((item, index) => {
              const isVideo = item.file.type.startsWith('video/');

              return (
                <div
                  className="media-upload__card"
                  key={`${item.file.name}-${item.file.lastModified}-${index}`}
                >
                  <div className="media-upload__preview">
                    {isVideo ? (
                      <video
                        src={item.previewUrl}
                        controls
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                      />
                    )}

                    <div className="media-upload__type">
                      {isVideo ? (
                        <>
                          <Video size={11} />
                          VIDEO
                        </>
                      ) : (
                        <>
                          <Image size={11} />
                          PHOTO
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      className="media-upload__remove"
                      onClick={() => removeFile(index)}
                      disabled={disabled}
                      aria-label={`Remove ${item.file.name}`}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="media-upload__file-info">
                    <span title={item.file.name}>
                      {item.file.name}
                    </span>

                    <small>
                      {formatFileSize(item.file.size)}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="media-upload__error">
          <span />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
