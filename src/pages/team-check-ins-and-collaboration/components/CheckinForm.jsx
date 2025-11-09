import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CheckinForm = ({ selectedMember, onSubmitCheckin, onSaveDraft, onCancel }) => {
  const [formData, setFormData] = useState({
    weekOf: new Date()?.toISOString()?.split('T')?.[0],
    progressUpdate: '',
    completedTasks: '',
    blockers: '',
    supportNeeded: '',
    nextWeekPriorities: '',
    mood: 'neutral',
    workloadRating: 3,
    attachments: []
  });

  const [charCounts, setCharCounts] = useState({
    progressUpdate: 0,
    completedTasks: 0,
    blockers: 0,
    supportNeeded: 0,
    nextWeekPriorities: 0
  });

  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxChars = {
    progressUpdate: 500,
    completedTasks: 300,
    blockers: 300,
    supportNeeded: 200,
    nextWeekPriorities: 300
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (maxChars?.[field]) {
      setCharCounts(prev => ({ ...prev, [field]: value?.length }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmitCheckin({
        ...formData,
        memberId: selectedMember?.id,
        submittedAt: new Date()?.toISOString(),
        status: 'pending'
      });
      
      // Reset form
      setFormData({
        weekOf: new Date()?.toISOString()?.split('T')?.[0],
        progressUpdate: '',
        completedTasks: '',
        blockers: '',
        supportNeeded: '',
        nextWeekPriorities: '',
        mood: 'neutral',
        workloadRating: 3,
        attachments: []
      });
      setCharCounts({
        progressUpdate: 0,
        completedTasks: 0,
        blockers: 0,
        supportNeeded: 0,
        nextWeekPriorities: 0
      });
    } catch (error) {
      console.error('Error submitting check-in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    onSaveDraft({
      ...formData,
      memberId: selectedMember?.id,
      savedAt: new Date()?.toISOString(),
      status: 'draft'
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev?.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev?.attachments?.filter((_, i) => i !== index)
    }));
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'great': return 'Smile';
      case 'good': return 'Meh';
      case 'neutral': return 'Minus';
      case 'challenging': return 'Frown';
      case 'difficult': return 'X';
      default: return 'Minus';
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'great': return 'text-success';
      case 'good': return 'text-success/70';
      case 'neutral': return 'text-muted-foreground';
      case 'challenging': return 'text-warning';
      case 'difficult': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  if (!selectedMember) {
    return (
      <div className="h-full flex items-center justify-center bg-card">
        <div className="text-center">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a Team Member</h3>
          <p className="text-sm text-muted-foreground">Choose a team member to view their check-ins or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Weekly Check-in</h2>
            <p className="text-sm text-muted-foreground">
              {selectedMember?.name} • Week of {new Date(formData.weekOf)?.toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveDraft} iconName="Save">
              Save Draft
            </Button>
          </div>
        </div>
      </div>
      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Week Selection */}
          <div>
            <Input
              type="date"
              label="Week Of"
              value={formData?.weekOf}
              onChange={(e) => handleInputChange('weekOf', e?.target?.value)}
              required
            />
          </div>

          {/* Progress Update */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Progress Update *
              <span className="text-xs text-muted-foreground ml-2">
                ({charCounts?.progressUpdate}/{maxChars?.progressUpdate})
              </span>
            </label>
            <textarea
              value={formData?.progressUpdate}
              onChange={(e) => handleInputChange('progressUpdate', e?.target?.value)}
              placeholder="What did you accomplish this week? Share your key wins and progress on objectives..."
              maxLength={maxChars?.progressUpdate}
              required
              className="w-full h-24 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Completed Tasks */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Completed Tasks
              <span className="text-xs text-muted-foreground ml-2">
                ({charCounts?.completedTasks}/{maxChars?.completedTasks})
              </span>
            </label>
            <textarea
              value={formData?.completedTasks}
              onChange={(e) => handleInputChange('completedTasks', e?.target?.value)}
              placeholder="List specific tasks, deliverables, or milestones you completed..."
              maxLength={maxChars?.completedTasks}
              className="w-full h-20 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Blockers & Challenges
              <span className="text-xs text-muted-foreground ml-2">
                ({charCounts?.blockers}/{maxChars?.blockers})
              </span>
            </label>
            <textarea
              value={formData?.blockers}
              onChange={(e) => handleInputChange('blockers', e?.target?.value)}
              placeholder="What's blocking your progress? Any challenges or obstacles you're facing..."
              maxLength={maxChars?.blockers}
              className="w-full h-20 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Support Needed */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Support Needed
              <span className="text-xs text-muted-foreground ml-2">
                ({charCounts?.supportNeeded}/{maxChars?.supportNeeded})
              </span>
            </label>
            <textarea
              value={formData?.supportNeeded}
              onChange={(e) => handleInputChange('supportNeeded', e?.target?.value)}
              placeholder="What support do you need from your team or manager?"
              maxLength={maxChars?.supportNeeded}
              className="w-full h-16 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Next Week Priorities */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Next Week Priorities *
              <span className="text-xs text-muted-foreground ml-2">
                ({charCounts?.nextWeekPriorities}/{maxChars?.nextWeekPriorities})
              </span>
            </label>
            <textarea
              value={formData?.nextWeekPriorities}
              onChange={(e) => handleInputChange('nextWeekPriorities', e?.target?.value)}
              placeholder="What are your top priorities for next week?"
              maxLength={maxChars?.nextWeekPriorities}
              required
              className="w-full h-20 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Mood & Workload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">How was your week?</label>
              <div className="flex space-x-2">
                {['great', 'good', 'neutral', 'challenging', 'difficult']?.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => handleInputChange('mood', mood)}
                    className={`p-2 rounded-lg border transition-colors ${
                      formData?.mood === mood
                        ? 'border-primary bg-primary/10' :'border-border hover:border-border/80'
                    }`}
                  >
                    <Icon 
                      name={getMoodIcon(mood)} 
                      size={20} 
                      className={formData?.mood === mood ? 'text-primary' : getMoodColor(mood)}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Workload Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Workload Rating (1-5)
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5]?.map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleInputChange('workloadRating', rating)}
                    className={`p-2 rounded-lg transition-colors ${
                      formData?.workloadRating >= rating
                        ? 'text-warning' :'text-muted-foreground hover:text-warning/70'
                    }`}
                  >
                    <Icon name="Star" size={16} fill={formData?.workloadRating >= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                1 = Light, 3 = Balanced, 5 = Overwhelming
              </p>
            </div>
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Attachments</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Icon name="Upload" size={24} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload files or drag and drop
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, DOC, PNG, JPG up to 10MB each
                </span>
              </label>
            </div>

            {/* Attachment List */}
            {formData?.attachments?.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData?.attachments?.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="File" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{file?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file?.size / 1024 / 1024)?.toFixed(1)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      iconName="X"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <Icon name="Info" size={12} className="inline mr-1" />
              Use Ctrl+Enter to submit quickly
            </div>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                iconName="Save"
                iconPosition="left"
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                iconName="Send"
                iconPosition="left"
              >
                Submit Check-in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckinForm;