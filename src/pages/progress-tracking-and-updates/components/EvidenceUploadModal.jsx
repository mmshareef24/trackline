import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EvidenceUploadModal = ({ isOpen, onClose, keyResultId, onEvidenceUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleChange = (e) => {
    e?.preventDefault();
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)?.map(file => ({
      file,
      id: Math.random()?.toString(36)?.substr(2, 9),
      name: file?.name,
      size: file?.size,
      type: file?.type,
      preview: file?.type?.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev?.filter(f => f?.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (files?.length === 0) return;

    setUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const evidenceData = {
      keyResultId,
      files: files?.map(f => ({
        name: f?.name,
        size: f?.size,
        type: f?.type,
        url: f?.preview || '/assets/images/document-placeholder.png'
      })),
      description,
      timestamp: new Date()?.toISOString(),
      uploadedBy: 'Current User'
    };

    onEvidenceUpload(evidenceData);
    
    // Reset form
    setFiles([]);
    setDescription('');
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Upload Evidence</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
            <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-muted-foreground">
              Support for images, videos, documents (PDF, DOC, XLS, PPT)
            </p>
          </div>

          {/* File List */}
          {files?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Selected Files ({files?.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files?.map((file) => (
                  <div key={file?.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    {file?.preview ? (
                      <img 
                        src={file?.preview} 
                        alt={file?.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                        <Icon name="File" size={20} className="text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file?.size)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file?.id)}
                      className="text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <Input
              type="text"
              label="Description (Optional)"
              placeholder="Add a description for this evidence..."
              value={description}
              onChange={(e) => setDescription(e?.target?.value)}
            />
          </div>

          {/* Upload Guidelines */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Upload Guidelines</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Maximum file size: 10MB per file</li>
              <li>• Supported formats: Images (JPG, PNG, GIF), Videos (MP4, MOV), Documents (PDF, DOC, XLS, PPT)</li>
              <li>• Files will be automatically compressed for optimal storage</li>
              <li>• Evidence will be linked to the specific Key Result</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={uploading}
              iconName="Upload"
              iconPosition="left"
              disabled={files?.length === 0}
            >
              {uploading ? 'Uploading...' : `Upload ${files?.length} File${files?.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvidenceUploadModal;