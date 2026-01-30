import React, { useState, useEffect, useRef } from 'react';
import { Upload, File, Trash2, Download, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileItem {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

interface UploadingFile {
  name: string;
  progress: number;
  size: number;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (err) {
      console.error('Error fetching files:', err);
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleUpload(Array.from(selectedFiles));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleUpload(Array.from(droppedFiles));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const uploadFileWithProgress = (file: File, filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/shared-files/${filePath}`;
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadingFiles(prev => 
            prev.map(f => f.name === file.name ? { ...f, progress } : f)
          );
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed - network error'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`);
      xhr.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
      xhr.setRequestHeader('x-upsert', 'false');

      const formData = new FormData();
      formData.append('cacheControl', '3600');
      formData.append('', file);

      xhr.send(formData);
    });
  };

  const handleUpload = async (filesToUpload: File[]) => {
    // Check file sizes
    const oversizedFiles = filesToUpload.filter(f => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast.error(`Files over 50MB are not supported: ${oversizedFiles.map(f => f.name).join(', ')}`);
      filesToUpload = filesToUpload.filter(f => f.size <= MAX_FILE_SIZE);
      if (filesToUpload.length === 0) return;
    }

    // Initialize progress tracking
    setUploadingFiles(filesToUpload.map(f => ({ name: f.name, progress: 0, size: f.size })));

    try {
      for (const file of filesToUpload) {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${timestamp}_${safeName}`;

        // Upload with progress tracking
        await uploadFileWithProgress(file, filePath);

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('shared_files')
          .insert({
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type || 'application/octet-stream',
          });

        if (dbError) throw dbError;
      }

      toast.success(`${filesToUpload.length} file(s) uploaded successfully`);
      fetchFiles();
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload file(s). Please try with smaller files.');
    } finally {
      setUploadingFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (file: FileItem) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('shared-files')
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete metadata from database
      const { error: dbError } = await supabase
        .from('shared_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      toast.success('File deleted');
      setFiles(files.filter(f => f.id !== file.id));
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete file');
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const { data } = supabase.storage
        .from('shared-files')
        .getPublicUrl(file.file_path);

      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.download = file.file_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download file');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-border">
          <div className="p-3 rounded-xl bg-brand/10">
            <Upload className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Files</h2>
            <p className="text-sm text-muted-foreground">Shared globally with all users</p>
          </div>
        </div>

        {/* Drop Zone */}
        <div className="p-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-brand bg-brand/5'
                : 'border-border hover:border-brand/50 hover:bg-secondary/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploadingFiles.length > 0 ? (
              <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
                <p className="text-muted-foreground font-medium">Uploading...</p>
                {uploadingFiles.map((file) => (
                  <div key={file.name} className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <span className="text-muted-foreground">{file.progress}%</span>
                    </div>
                    <Progress value={file.progress} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="text-lg font-medium">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  Max 50MB per file
                </p>
              </div>
            )}
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="px-6 pb-6">
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-background">
                    <File className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file_size)} • {new Date(file.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(file)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length === 0 && !isLoading && (
          <div className="px-6 pb-6">
            <div className="text-center py-8 text-muted-foreground">
              <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
