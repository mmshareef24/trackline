import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ObjectiveForm = ({ isOpen, onClose, onSave, objective = null, mode = 'create' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    quarter: 'Q1 2025',
    owner: '',
    team: '',
    template: '',
    keyResults: [],
    dependencies: [],
    tags: []
  });

  const [keyResultForm, setKeyResultForm] = useState({
    title: '',
    metricType: 'percentage',
    currentValue: 0,
    targetValue: 100,
    unit: '%'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Details', icon: 'FileText' },
    { id: 2, title: 'Key Results', icon: 'Target' },
    { id: 3, title: 'Team & Timeline', icon: 'Users' },
    { id: 4, title: 'Review', icon: 'CheckCircle' }
  ];

  const categories = [
    'Revenue Growth', 'Customer Success', 'Product Development', 
    'Operational Excellence', 'Team Development', 'Market Expansion'
  ];

  const templates = [
    { id: 'revenue', name: 'Revenue Growth Template', description: 'Standard revenue objectives with KRs' },
    { id: 'product', name: 'Product Launch Template', description: 'Product development and launch goals' },
    { id: 'customer', name: 'Customer Success Template', description: 'Customer satisfaction and retention' },
    { id: 'team', name: 'Team Development Template', description: 'Team growth and skill development' }
  ];

  const teamMembers = [
    'John Doe', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 
    'Alex Rodriguez', 'Lisa Wang', 'David Brown', 'Anna Smith'
  ];

  const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];

  useEffect(() => {
    if (objective && mode === 'edit') {
      setFormData({
        title: objective?.title || '',
        description: objective?.description || '',
        category: objective?.category || '',
        priority: objective?.priority || 'medium',
        quarter: objective?.quarter || 'Q1 2025',
        owner: objective?.owner || '',
        team: objective?.team || '',
        template: '',
        keyResults: objective?.keyResults || [],
        dependencies: objective?.dependencies || [],
        tags: objective?.tags || []
      });
    }
  }, [objective, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyResultChange = (field, value) => {
    setKeyResultForm(prev => ({ ...prev, [field]: value }));
  };

  const addKeyResult = () => {
    if (!keyResultForm?.title?.trim()) return;

    const newKR = {
      id: Date.now(),
      title: keyResultForm?.title,
      metricType: keyResultForm?.metricType,
      currentValue: keyResultForm?.currentValue,
      targetValue: keyResultForm?.targetValue,
      unit: keyResultForm?.unit,
      progress: Math.round((keyResultForm?.currentValue / keyResultForm?.targetValue) * 100)
    };

    setFormData(prev => ({
      ...prev,
      keyResults: [...prev?.keyResults, newKR]
    }));

    setKeyResultForm({
      title: '',
      metricType: 'percentage',
      currentValue: 0,
      targetValue: 100,
      unit: '%'
    });
  };

  const removeKeyResult = (id) => {
    setFormData(prev => ({
      ...prev,
      keyResults: prev?.keyResults?.filter(kr => kr?.id !== id)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.title?.trim()) newErrors.title = 'Title is required';
        if (!formData?.description?.trim()) newErrors.description = 'Description is required';
        if (!formData?.category) newErrors.category = 'Category is required';
        break;
      case 2:
        if (formData?.keyResults?.length === 0) newErrors.keyResults = 'At least one key result is required';
        break;
      case 3:
        if (!formData?.owner) newErrors.owner = 'Owner is required';
        if (!formData?.quarter) newErrors.quarter = 'Quarter is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving objective:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyTemplate = (templateId) => {
    const templateData = {
      revenue: {
        title: 'Increase Revenue Growth',
        description: 'Drive significant revenue growth through strategic initiatives and market expansion',
        category: 'Revenue Growth',
        keyResults: [
          { id: 1, title: 'Achieve $2M in quarterly revenue', metricType: 'currency', currentValue: 0, targetValue: 2000000, unit: '$', progress: 0 },
          { id: 2, title: 'Increase conversion rate to 15%', metricType: 'percentage', currentValue: 0, targetValue: 15, unit: '%', progress: 0 }
        ]
      },
      product: {
        title: 'Launch New Product Feature',
        description: 'Successfully launch and adopt new product features to enhance user experience',
        category: 'Product Development',
        keyResults: [
          { id: 1, title: 'Complete feature development', metricType: 'percentage', currentValue: 0, targetValue: 100, unit: '%', progress: 0 },
          { id: 2, title: 'Achieve 80% user adoption', metricType: 'percentage', currentValue: 0, targetValue: 80, unit: '%', progress: 0 }
        ]
      }
    };

    const template = templateData?.[templateId];
    if (template) {
      setFormData(prev => ({
        ...prev,
        title: template?.title,
        description: template?.description,
        category: template?.category,
        keyResults: template?.keyResults
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      {/* Side Sheet */}
      <div className="relative ml-auto w-full max-w-2xl bg-card shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'edit' ? 'Edit Objective' : 'Create New Objective'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep} of {steps?.length}: {steps?.[currentStep - 1]?.title}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            {steps?.map((step, index) => (
              <div key={step?.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                  currentStep >= step?.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                }`}>
                  {currentStep > step?.id ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </span>
                {index < steps?.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    currentStep > step?.id ? 'bg-primary' : 'bg-border'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Quick Start Templates (Optional)
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {templates?.map((template) => (
                    <div
                      key={template?.id}
                      onClick={() => applyTemplate(template?.id)}
                      className="p-3 border border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground text-sm">{template?.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{template?.description}</p>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <Input
                  label="Objective Title"
                  type="text"
                  placeholder="Enter a clear, measurable objective title"
                  value={formData?.title}
                  onChange={(e) => handleInputChange('title', e?.target?.value)}
                  error={errors?.title}
                  required
                />

                <Input
                  label="Description"
                  type="text"
                  placeholder="Provide context and details about this objective"
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  error={errors?.description}
                  required
                  className="mt-4"
                />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData?.category}
                    onChange={(e) => handleInputChange('category', e?.target?.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors?.category && (
                    <p className="text-error text-xs mt-1">{errors?.category}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                  <div className="flex space-x-3">
                    {['low', 'medium', 'high']?.map((priority) => (
                      <label key={priority} className="flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={formData?.priority === priority}
                          onChange={(e) => handleInputChange('priority', e?.target?.value)}
                          className="mr-2"
                        />
                        <span className={`text-sm capitalize ${
                          priority === 'high' ? 'text-error' :
                          priority === 'medium' ? 'text-warning' : 'text-accent'
                        }`}>
                          {priority}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Key Results */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Key Results</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define measurable outcomes that indicate success for this objective.
                </p>
              </div>

              {/* Add Key Result Form */}
              <div className="p-4 border border-border rounded-lg bg-muted/30">
                <h4 className="font-medium text-foreground mb-3">Add Key Result</h4>
                
                <Input
                  label="Key Result Title"
                  type="text"
                  placeholder="e.g., Increase monthly recurring revenue to $50K"
                  value={keyResultForm?.title}
                  onChange={(e) => handleKeyResultChange('title', e?.target?.value)}
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Metric Type</label>
                    <select
                      value={keyResultForm?.metricType}
                      onChange={(e) => {
                        const type = e?.target?.value;
                        handleKeyResultChange('metricType', type);
                        handleKeyResultChange('unit', type === 'percentage' ? '%' : type === 'currency' ? '$' : '');
                      }}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="currency">Currency</option>
                      <option value="number">Number</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <Input
                    label="Unit"
                    type="text"
                    placeholder="%, $, units, etc."
                    value={keyResultForm?.unit}
                    onChange={(e) => handleKeyResultChange('unit', e?.target?.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Current Value"
                    type="number"
                    placeholder="0"
                    value={keyResultForm?.currentValue}
                    onChange={(e) => handleKeyResultChange('currentValue', parseFloat(e?.target?.value) || 0)}
                  />

                  <Input
                    label="Target Value"
                    type="number"
                    placeholder="100"
                    value={keyResultForm?.targetValue}
                    onChange={(e) => handleKeyResultChange('targetValue', parseFloat(e?.target?.value) || 0)}
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={addKeyResult}
                  iconName="Plus"
                  iconPosition="left"
                  className="mt-4"
                  disabled={!keyResultForm?.title?.trim()}
                >
                  Add Key Result
                </Button>
              </div>

              {/* Key Results List */}
              {formData?.keyResults?.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    Key Results ({formData?.keyResults?.length})
                  </h4>
                  <div className="space-y-3">
                    {formData?.keyResults?.map((kr) => (
                      <div key={kr?.id} className="p-4 border border-border rounded-lg bg-card">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground text-sm">{kr?.title}</h5>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>Current: {kr?.currentValue}{kr?.unit}</span>
                              <span>Target: {kr?.targetValue}{kr?.unit}</span>
                              <span className="text-primary font-medium">{kr?.progress}% complete</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                              <div
                                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${kr?.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeKeyResult(kr?.id)}
                            className="ml-2 text-error hover:text-error"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors?.keyResults && (
                <p className="text-error text-sm">{errors?.keyResults}</p>
              )}
            </div>
          )}

          {/* Step 3: Team & Timeline */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Team & Timeline</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Assign ownership and set timeline for this objective.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Owner <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData?.owner}
                    onChange={(e) => handleInputChange('owner', e?.target?.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select owner</option>
                    {teamMembers?.map((member) => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                  {errors?.owner && (
                    <p className="text-error text-xs mt-1">{errors?.owner}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quarter <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData?.quarter}
                    onChange={(e) => handleInputChange('quarter', e?.target?.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {quarters?.map((quarter) => (
                      <option key={quarter} value={quarter}>{quarter}</option>
                    ))}
                  </select>
                  {errors?.quarter && (
                    <p className="text-error text-xs mt-1">{errors?.quarter}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Team</label>
                <select
                  value={formData?.team}
                  onChange={(e) => handleInputChange('team', e?.target?.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select team (optional)</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Customer Success">Customer Success</option>
                </select>
              </div>

              <Input
                label="Tags (comma-separated)"
                type="text"
                placeholder="e.g., revenue, growth, q1-priority"
                value={formData?.tags?.join(', ')}
                onChange={(e) => handleInputChange('tags', e?.target?.value?.split(',')?.map(tag => tag?.trim())?.filter(Boolean))}
                description="Add tags to help organize and filter objectives"
              />
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Review & Confirm</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review all details before creating your objective.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-foreground mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Title:</span> <span className="text-foreground font-medium">{formData?.title}</span></div>
                    <div><span className="text-muted-foreground">Category:</span> <span className="text-foreground">{formData?.category}</span></div>
                    <div><span className="text-muted-foreground">Priority:</span> <span className={`capitalize ${
                      formData?.priority === 'high' ? 'text-error' :
                      formData?.priority === 'medium' ? 'text-warning' : 'text-accent'
                    }`}>{formData?.priority}</span></div>
                    <div><span className="text-muted-foreground">Description:</span> <span className="text-foreground">{formData?.description}</span></div>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-foreground mb-2">Key Results ({formData?.keyResults?.length})</h4>
                  <div className="space-y-2">
                    {formData?.keyResults?.map((kr, index) => (
                      <div key={kr?.id} className="text-sm">
                        <span className="text-muted-foreground">{index + 1}.</span> <span className="text-foreground">{kr?.title}</span>
                        <span className="text-muted-foreground ml-2">({kr?.currentValue}{kr?.unit} → {kr?.targetValue}{kr?.unit})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-foreground mb-2">Assignment & Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Owner:</span> <span className="text-foreground">{formData?.owner}</span></div>
                    <div><span className="text-muted-foreground">Quarter:</span> <span className="text-foreground">{formData?.quarter}</span></div>
                    {formData?.team && <div><span className="text-muted-foreground">Team:</span> <span className="text-foreground">{formData?.team}</span></div>}
                    {formData?.tags?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData?.tags?.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < 4 ? (
              <Button variant="default" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleSubmit}
                loading={isSubmitting}
                iconName="Save"
                iconPosition="left"
              >
                {mode === 'edit' ? 'Update Objective' : 'Create Objective'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveForm;