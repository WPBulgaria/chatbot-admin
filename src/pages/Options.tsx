import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { Switch } from '@headlessui/react';

interface FormData {
  apiKey: string;
  apiEndpoint: string;
  enableLogs: boolean;
  maxTokens: string;
}

export const Options: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    apiKey: '',
    apiEndpoint: 'https://api.openai.com/v1',
    enableLogs: false,
    maxTokens: '2000',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleToggleChange = (field: keyof FormData, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    }

    if (!formData.apiEndpoint.trim()) {
      newErrors.apiEndpoint = 'API Endpoint is required';
    } else if (!formData.apiEndpoint.startsWith('http')) {
      newErrors.apiEndpoint = 'API Endpoint must be a valid URL';
    }

    if (!formData.maxTokens.trim()) {
      newErrors.maxTokens = 'Max tokens is required';
    } else if (isNaN(Number(formData.maxTokens)) || Number(formData.maxTokens) <= 0) {
      newErrors.maxTokens = 'Max tokens must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setToastMessage('Settings saved successfully!');
    setToastType('success');
    setShowToast(true);
  };

  const handleTestConnection = async () => {
    if (!formData.apiKey.trim()) {
      setErrors({ apiKey: 'API Key is required to test connection' });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setToastMessage('Connection successful!');
    setToastType('success');
    setShowToast(true);
  };

  const handleReset = () => {
    setFormData({
      apiKey: '',
      apiEndpoint: 'https://api.openai.com/v1',
      enableLogs: false,
      maxTokens: '2000',
    });
    setErrors({});
    setToastMessage('Settings reset to defaults');
    setToastType('info');
    setShowToast(true);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">API Configuration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your API settings and credentials for the chatbot.
        </p>
      </div>

      <div className="space-y-6">
        <Card
          title="API Credentials"
          description="Enter your API key and endpoint URL"
        >
          <div className="space-y-4">
            <div className="relative">
              <Input
                label="API Key"
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                error={errors.apiKey}
                placeholder="sk-..."
                helperText="Your secret API key for authentication"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                type="button"
              >
                {showApiKey ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-1.655 0-3.22-.378-4.61-1.059L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <Input
              label="API Endpoint"
              type="url"
              value={formData.apiEndpoint}
              onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
              error={errors.apiEndpoint}
              placeholder="https://api.openai.com/v1"
              helperText="The base URL for API requests"
            />

            <div className="flex gap-3 pt-2">
              <Button onClick={handleTestConnection} variant="secondary">
                Test Connection
              </Button>
            </div>
          </div>
        </Card>

        <Card
          title="Advanced Settings"
          description="Configure advanced chatbot behavior"
        >
          <div className="space-y-5">
            <Input
              label="Max Tokens"
              type="number"
              value={formData.maxTokens}
              onChange={(e) => handleInputChange('maxTokens', e.target.value)}
              error={errors.maxTokens}
              placeholder="2000"
              helperText="Maximum number of tokens per response"
            />

            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Enable Logging
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Save conversation logs for debugging and analytics
                </p>
              </div>
              <Switch
                checked={formData.enableLogs}
                onChange={(value) => handleToggleChange('enableLogs', value)}
                className={`${
                  formData.enableLogs ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    formData.enableLogs ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-4">
          <Button
            onClick={handleReset}
            variant="secondary"
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            loading={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

