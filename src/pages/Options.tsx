import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { Switch, Input as HeadlessInput, Textarea, Field, Label, Description } from '@headlessui/react';
import type { Plan } from '../types/plan';
import { now } from '../utils/time';
import { flattenErrors } from '../utils/errors';
import { ConfigsSchema, Configs } from '../types/configs';
import { makeConfigsApi } from '../api/configs-api';
import { useRouter } from '@tanstack/react-router';
import clsx from 'clsx';


type Errors = {
  general: string;
  adminsOnly: string;
  totalChats: string;
  totalQuestions: string;
  publicPlan: string;
  defaultPlan: string;
  apiKey: string;
  fileSearchStore: string;
  systemInstructions: string;
  temperature: string;
  topP: string;
  topK: string;
  maxOutputTokens: string;
}

export const Options: React.FC<{ configs: Configs, plans: Plan[], chatbotId: number }> = ({ configs, plans = [], chatbotId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Configs>({
    apiKey: "",
    totalChats: 0,
    totalQuestions: 0,
    adminsOnly: false,
    publicPlan: "",
    defaultPlan: "",
    fileSearchStore: "",
    systemInstructions: "",
    temperature: 0,
    topP: 0,
    topK: 0,
    maxOutputTokens: 0,
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
      temperature: formData.temperature !== undefined && formData.temperature.toString() !== '' ? Number(formData.temperature) : undefined,
      topP: formData.topP !== undefined && formData.topP.toString() !== '' ? Number(formData.topP) : undefined,
      topK: formData.topK !== undefined && formData.topK.toString() !== '' ? Number(formData.topK) : undefined,
      maxOutputTokens: formData.maxOutputTokens !== undefined && formData.maxOutputTokens.toString() !== '' ? Number(formData.maxOutputTokens) : undefined,
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
      const response = await makeConfigsApi().store(newConfigs, chatbotId);
      if (!response.success) {
        setErrors(
          typeof response.message === "string" ? 
          { general: response.message } :
          response.message || 'An error occurred while saving the configs'
          );
        setToastMessage('An error occurred while saving the configs');
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
                type={showApiKey || formData.apiKey === "🔒" ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                error={errors.apiKey}
                placeholder="sk-..."
                helperText="Your secret API key for authentication"
              />
              <Button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-1 bg-transparent top-7 text-gray-400 hover:text-gray-600 !border-none !outline-none !ring-0 cursor-pointer"
                variant="secondary"
                size="sm"
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
              </Button>
            </div>

            <Field>
              <Label className="block text-sm font-medium text-gray-700">File Search Store</Label>
              <Input
                type="text"
                value={formData.fileSearchStore || ''}
                onChange={(e) => handleInputChange('fileSearchStore', e.target.value)}
                placeholder="Enter value"
                className={clsx(
                  'mt-2',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.fileSearchStore ? 'border-red-300' : 'border-gray-300',
                )}
              />
              <Description className="mt-1.5 text-sm text-gray-500">
                Gemini File Search Store ID for file search
              </Description>
              {errors.fileSearchStore && (
                <p className="mt-1.5 text-sm text-red-600">{errors.fileSearchStore}</p>
              )}
            </Field>

            <Field>
              <Label className="block text-sm font-medium text-gray-700">System Instructions</Label>
              <Textarea
                value={formData.systemInstructions || ''}
                onChange={(e) => handleInputChange('systemInstructions', e.target.value)}
                placeholder="Enter system instructions for the AI assistant..."
                rows={6}
                className={clsx(
                  'mt-2 block w-full px-4 py-2.5 rounded-lg border transition-all duration-200 resize-y',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.systemInstructions ? 'border-red-300' : 'border-gray-300',
                )}
              />
              <Description className="mt-1.5 text-sm text-gray-500">
                Custom instructions that define the AI assistant's behavior, personality, and context
              </Description>
              {errors.systemInstructions && (
                <p className="mt-1.5 text-sm text-red-600">{errors.systemInstructions}</p>
              )}
            </Field>
          </div>
        </Card>

        <Card
          title="LLM Parameters"
          description="Configure the language model generation parameters"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label className="block text-sm font-medium text-gray-700">Temperature</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={formData.temperature ?? ''}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                placeholder="1.0"
                className={clsx(
                  'mt-2',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.temperature ? 'border-red-300' : 'border-gray-300',
                )}
              />
              <Description className="mt-1.5 text-sm text-gray-500">
                Controls creativity (0-2). Lower = more focused and consistent, Higher = more creative and varied.
              </Description>
              {errors.temperature && (
                <p className="mt-1.5 text-sm text-red-600">{errors.temperature}</p>
              )}
            </Field>

            <Field>
              <Label className="block text-sm font-medium text-gray-700">Top P</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={formData.topP ?? ''}
                onChange={(e) => handleInputChange('topP', e.target.value)}
                placeholder="0.95"
                className={clsx(
                  'mt-2',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.topP ? 'border-red-300' : 'border-gray-300',
                )}
              />
              <Description className="mt-1.5 text-sm text-gray-500">
                Controls response diversity (0-1). Lower = more predictable, Higher = more diverse word choices.
              </Description>
              {errors.topP && (
                <p className="mt-1.5 text-sm text-red-600">{errors.topP}</p>
              )}
            </Field>

            <Field>
              <Label className="block text-sm font-medium text-gray-700">Top K</Label>
              <Input
                type="number"
                step="1"
                min="1"
                max="100"
                value={formData.topK ?? ''}
                onChange={(e) => handleInputChange('topK', e.target.value)}
                placeholder="40"
                className={clsx(
                  'mt-2',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.topK ? 'border-red-300' : 'border-gray-300',
                )}
              />
              <Description className="mt-1.5 text-sm text-gray-500">
                Limits vocabulary choices (1-100). Lower = more precise and focused, Higher = more vocabulary variety.
              </Description>
              {errors.topK && (
                <p className="mt-1.5 text-sm text-red-600">{errors.topK}</p>
              )}
            </Field>

            <Field>
              <Label className="block text-sm font-medium text-gray-700">Max Output Tokens</Label>
              <Input
                type="number"
                step="1"
                min="1"
                max="8192"
                value={formData.maxOutputTokens ?? ''}
                onChange={(e) => handleInputChange('maxOutputTokens', e.target.value)}
                placeholder="2048"
                className={clsx(
                  'mt-2',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.maxOutputTokens ? 'border-red-300' : 'border-gray-300',
                )}
              />
              <Description className="mt-1.5 text-sm text-gray-500">
                Maximum response length in tokens (1-65000). Roughly 1 token = 4 characters.
              </Description>
              {errors.maxOutputTokens && (
                <p className="mt-1.5 text-sm text-red-600">{errors.maxOutputTokens}</p>
              )}
            </Field>
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
                className="w-full px-4 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

