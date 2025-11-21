import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { Switch } from '@headlessui/react';
import type { Plan } from '../types/plan';
import { now } from '../utils/time';
import { flattenErrors } from '../utils/errors';
import { ConfigsSchema, Configs} from '../types/configs';
import { makeConfigsApi } from '../api/configs-api';
import { useRouter } from '@tanstack/react-router';


type Errors = {
  general: string;
  adminsOnly: string;
  totalChats: string;
  totalQuestions: string;
  publicPlan: string;
  defaultPlan: string;
  apiKey: string;
}

export const Options: React.FC<{ configs: Configs, plans: Plan[] }> = ({ configs, plans = [] }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Configs>({
    apiKey: "",
    totalChats: 0,  
    totalQuestions: 0,
    adminsOnly: false,
    publicPlan: "",
    defaultPlan: "",
  });

  useEffect(() => {

    if (configs) {
      setFormData({...configs});
    }
  }, [configs]);

  const [errors, setErrors] = useState<Partial<Errors>>({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleInputChange = (field: keyof Errors, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleToggleChange = (field: keyof Errors, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setErrors({});

    const data: any = {
      createdAt: now(),
      ...configs,
      ...formData,
      totalChats: Number(formData.totalChats),
      totalQuestions: Number(formData.totalQuestions),
      modifiedAt: now(),
    }


    const result = ConfigsSchema.safeParse(data);
    if (!result.success) {
      setErrors(flattenErrors(result.error));
      return;
    }
  
    const newConfigs = result.data;


    setLoading(true);

    try {
      const response = await makeConfigsApi().store(newConfigs);
      if (!response.success) {
        setErrors({ general: response.message.toString() || 'An error occurred while saving the configs' });
        setToastMessage(response.message.toString() || 'An error occurred while saving the configs');
        setToastType('error');
        setShowToast(true);
        return;
      }
      router.invalidate();
      setToastMessage('Settings saved successfully!');
      setToastType('success');
      setShowToast(true);
      setErrors({});
      return;
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'An error occurred while saving the configs' });
      setToastMessage(error instanceof Error ? error.message : 'An error occurred while saving the configs');
      setToastType('error');
      setShowToast(true);
      return;
    } finally {
      setLoading(false);
    }
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
          </div>
        </Card>

        <Card
          title="Monthly Global Limits"
          description="Set global usage limits for the chatbot"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Chats"
              type="number"
              value={formData.totalChats}
              onChange={(e) => handleInputChange('totalChats', e.target.value)}
              error={errors.totalChats}
              placeholder="10000"
              helperText="Maximum total chats allowed"
            />

            <Input
              label="Total Questions"
              type="number"
              value={formData.totalQuestions}
              onChange={(e) => handleInputChange('totalQuestions', e.target.value)}
              error={errors.totalQuestions}
              placeholder="50000"
              helperText="Maximum total questions allowed"
            />
          </div>
        </Card>

        <Card
          title="Advanced Settings"
          description="Configure advanced chatbot behavior"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Admin Only
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Restrict chatbot access to administrators only
                </p>
              </div>
              <Switch
                checked={formData.adminsOnly}
                onChange={(value) => handleToggleChange('adminsOnly', value)}
                className={`${
                  formData.adminsOnly ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    formData.adminsOnly ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Plan
              </label>
              <select
                value={formData.publicPlan}
                onChange={(e) => handleInputChange('publicPlan', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-sm text-gray-500">Plan available for public users</p>
              {errors.publicPlan && (
                <div className="text-red-500 text-sm">
                  {errors.publicPlan}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Plan
              </label>
              <select
                value={formData.defaultPlan}
                onChange={(e) => handleInputChange('defaultPlan', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-sm text-gray-500">Default plan assigned to new users</p>
              {errors.defaultPlan && (
                <div className="text-red-500 text-sm">
                  {errors.defaultPlan}
                </div>
              )}
            </div>
          </div>
        </Card>
        {errors.general && (
          <div className="text-red-500 text-sm">
            {errors.general}
          </div>
        )}
        <div className="flex items-center justify-between pt-4">
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

