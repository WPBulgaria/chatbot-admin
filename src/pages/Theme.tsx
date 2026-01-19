import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { Switch, Textarea, Field, Label, Description } from '@headlessui/react';
import { makeConfigsApi } from '../api/configs-api';
import { useRouter } from '@tanstack/react-router';
import clsx from 'clsx';
import type { ChatTheme } from '../types/chat-theme';
import { defaultTheme } from '../types/chat-theme';
import type { Configs } from '../types/configs';

interface ThemeProps {
  configs: Configs;
}

// Color input component
const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}> = ({ label, value, onChange, description }) => (
  <Field className="flex items-center gap-3">
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-10 rounded border border-[#c3c4c7] cursor-pointer"
    />
    <div className="flex-1">
      <Label className="block text-[13px] font-medium text-[#1d2327]">{label}</Label>
      <div className="flex items-center gap-2 mt-0.5">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 text-[12px] rounded border border-[#8c8f94] font-mono"
        />
        {description && (
          <Description className="text-[12px] text-[#50575e]">{description}</Description>
        )}
      </div>
    </div>
  </Field>
);

// Text input for theme
const ThemeInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  multiline?: boolean;
}> = ({ label, value, onChange, placeholder, description, multiline }) => (
  <Field>
    <Label className="block text-[13px] font-medium text-[#1d2327] mb-1">{label}</Label>
    {multiline ? (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 text-[13px] rounded border border-[#8c8f94] focus:outline-none focus:ring-1 focus:ring-[#2271b1] focus:border-[#2271b1]"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-1.5 text-[13px] rounded border border-[#8c8f94] focus:outline-none focus:ring-1 focus:ring-[#2271b1] focus:border-[#2271b1]"
      />
    )}
    {description && (
      <Description className="mt-1 text-[12px] text-[#50575e]">{description}</Description>
    )}
  </Field>
);

export const Theme: React.FC<ThemeProps> = ({ configs }) => {
  const router = useRouter();
  const [theme, setTheme] = useState<ChatTheme>(configs.chatTheme || defaultTheme);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [activeTab, setActiveTab] = useState<'branding' | 'colors' | 'typography' | 'labels' | 'backgrounds' | 'shadows' | 'borders'>('branding');

  useEffect(() => {
    if (configs.chatTheme) {
      setTheme({ ...defaultTheme, ...configs.chatTheme });
    }
  }, [configs.chatTheme]);

  const updateTheme = <K extends keyof ChatTheme>(
    section: K,
    key: keyof ChatTheme[K],
    value: ChatTheme[K][keyof ChatTheme[K]]
  ) => {
    setTheme((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedConfigs = {
        ...configs,
        chatTheme: theme,
      };
      const response = await makeConfigsApi().store(updatedConfigs);
      if (!response.success) {
        setToastType('error');
        setToastMessage(response.message?.toString() || 'An error occurred while saving the theme');
        setShowToast(true);
        return;
      }
      router.invalidate();
      setToastType('success');
      setToastMessage('Theme saved successfully!');
      setShowToast(true);
    } catch (error) {
      setToastType('error');
      setToastMessage(error instanceof Error ? error.message : 'An error occurred');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTheme(defaultTheme);
    setToastType('info');
    setToastMessage('Theme reset to defaults. Click Save to apply.');
    setShowToast(true);
  };

  const tabs = [
    { id: 'branding', label: 'Branding' },
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'labels', label: 'Labels & Text' },
    { id: 'backgrounds', label: 'Backgrounds' },
    { id: 'shadows', label: 'Shadows' },
    { id: 'borders', label: 'Border Radius' },
  ] as const;

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1d2327]">Chat Theme</h1>
          <p className="mt-1 text-[13px] text-[#50575e]">
            Customize the appearance of the chat widget
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} loading={loading}>
            Save Theme
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-[#c3c4c7]">
        <nav className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-[#2271b1] text-[#2271b1]'
                  : 'border-transparent text-[#50575e] hover:text-[#1d2327] hover:border-[#c3c4c7]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <Card title="Branding" description="Configure the chat widget branding">
          <div className="space-y-4">
            <ThemeInput
              label="Brand Name"
              value={theme.branding.name}
              onChange={(v) => updateTheme('branding', 'name', v)}
              placeholder="Your Brand Name"
              description="Displayed in the chat header"
            />
            <ThemeInput
              label="Logo URL"
              value={theme.branding.logo || ''}
              onChange={(v) => updateTheme('branding', 'logo', v || undefined)}
              placeholder="https://example.com/logo.png"
              description="URL to your logo image (optional)"
            />
            <ThemeInput
              label="Status Text"
              value={theme.branding.statusText}
              onChange={(v) => updateTheme('branding', 'statusText', v)}
              placeholder="Online"
              description="Text shown next to status indicator"
            />
            <Field className="flex items-center justify-between py-2">
              <div>
                <Label className="block text-[13px] font-medium text-[#1d2327]">
                  Show as Online
                </Label>
                <Description className="text-[12px] text-[#50575e]">
                  Display green online indicator
                </Description>
              </div>
              <Switch
                checked={theme.branding.statusOnline}
                onChange={(v) => updateTheme('branding', 'statusOnline', v)}
                className={clsx(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  theme.branding.statusOnline ? 'bg-[#2271b1]' : 'bg-[#c3c4c7]'
                )}
              >
                <span
                  className={clsx(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    theme.branding.statusOnline ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </Switch>
            </Field>
          </div>
        </Card>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          <Card title="Primary Colors" description="Main accent colors">
            <div className="grid grid-cols-2 gap-4">
              <ColorInput
                label="Primary"
                value={theme.colors.primary}
                onChange={(v) => updateTheme('colors', 'primary', v)}
                description="Main accent color"
              />
              <ColorInput
                label="Primary Hover"
                value={theme.colors.primaryHover}
                onChange={(v) => updateTheme('colors', 'primaryHover', v)}
                description="Hover state"
              />
              <ColorInput
                label="Secondary Background"
                value={theme.colors.secondaryBg}
                onChange={(v) => updateTheme('colors', 'secondaryBg', v)}
                description="Secondary areas"
              />
              <ColorInput
                label="Border"
                value={theme.colors.border}
                onChange={(v) => updateTheme('colors', 'border', v)}
                description="Border color"
              />
            </div>
          </Card>

          <Card title="Text Colors" description="Text and typography colors">
            <div className="grid grid-cols-2 gap-4">
              <ColorInput
                label="Dark Text"
                value={theme.colors.textDark}
                onChange={(v) => updateTheme('colors', 'textDark', v)}
                description="Main text color"
              />
              <ColorInput
                label="Muted Text"
                value={theme.colors.textMuted}
                onChange={(v) => updateTheme('colors', 'textMuted', v)}
                description="Secondary text"
              />
            </div>
          </Card>

          <Card title="Message Colors" description="Chat message bubble colors">
            <div className="grid grid-cols-2 gap-4">
              <ColorInput
                label="Bot Message Background"
                value={theme.colors.botMessageBg}
                onChange={(v) => updateTheme('colors', 'botMessageBg', v)}
              />
              <ColorInput
                label="Bot Message Text"
                value={theme.colors.botMessageText}
                onChange={(v) => updateTheme('colors', 'botMessageText', v)}
              />
              <ColorInput
                label="User Message Background"
                value={theme.colors.userMessageBg}
                onChange={(v) => updateTheme('colors', 'userMessageBg', v)}
              />
              <ColorInput
                label="User Message Text"
                value={theme.colors.userMessageText}
                onChange={(v) => updateTheme('colors', 'userMessageText', v)}
              />
            </div>
          </Card>

          <Card title="Code Colors" description="Code block styling">
            <div className="grid grid-cols-2 gap-4">
              <ColorInput
                label="Inline Code Background"
                value={theme.colors.codeBg}
                onChange={(v) => updateTheme('colors', 'codeBg', v)}
              />
              <ColorInput
                label="Inline Code Text"
                value={theme.colors.codeText}
                onChange={(v) => updateTheme('colors', 'codeText', v)}
              />
              <ColorInput
                label="Code Block Background"
                value={theme.colors.codeBlockBg}
                onChange={(v) => updateTheme('colors', 'codeBlockBg', v)}
              />
              <ColorInput
                label="Code Block Text"
                value={theme.colors.codeBlockText}
                onChange={(v) => updateTheme('colors', 'codeBlockText', v)}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <Card title="Typography" description="Font settings for the chat widget">
          <div className="space-y-4">
            <ThemeInput
              label="Font Family"
              value={theme.typography.fontFamily}
              onChange={(v) => updateTheme('typography', 'fontFamily', v)}
              placeholder="'Inter', system-ui, sans-serif"
              description="CSS font-family value"
            />
            <ThemeInput
              label="Font URL"
              value={theme.typography.fontUrl || ''}
              onChange={(v) => updateTheme('typography', 'fontUrl', v || undefined)}
              placeholder="https://fonts.googleapis.com/css2?family=..."
              description="Google Fonts or custom font URL (optional)"
            />
          </div>
        </Card>
      )}

      {/* Labels Tab */}
      {activeTab === 'labels' && (
        <div className="space-y-4">
          <Card title="Header Labels" description="Text shown in the chat header">
            <div className="space-y-3">
              <ThemeInput
                label="Header Title"
                value={theme.labels.headerTitle}
                onChange={(v) => updateTheme('labels', 'headerTitle', v)}
              />
              <ThemeInput
                label="Header Status"
                value={theme.labels.headerStatus}
                onChange={(v) => updateTheme('labels', 'headerStatus', v)}
              />
              <ThemeInput
                label="History Button Title"
                value={theme.labels.historyButtonTitle}
                onChange={(v) => updateTheme('labels', 'historyButtonTitle', v)}
              />
              <ThemeInput
                label="More Options Title"
                value={theme.labels.moreOptionsTitle}
                onChange={(v) => updateTheme('labels', 'moreOptionsTitle', v)}
              />
            </div>
          </Card>

          <Card title="Chat Labels" description="Messages and input area text">
            <div className="space-y-3">
              <ThemeInput
                label="Welcome Message"
                value={theme.labels.welcomeMessage}
                onChange={(v) => updateTheme('labels', 'welcomeMessage', v)}
                multiline
              />
              <ThemeInput
                label="Input Placeholder"
                value={theme.labels.inputPlaceholder}
                onChange={(v) => updateTheme('labels', 'inputPlaceholder', v)}
              />
              <ThemeInput
                label="Send Button"
                value={theme.labels.sendButton}
                onChange={(v) => updateTheme('labels', 'sendButton', v)}
              />
              <ThemeInput
                label="Loading Message"
                value={theme.labels.loadingMessage}
                onChange={(v) => updateTheme('labels', 'loadingMessage', v)}
              />
              <ThemeInput
                label="Error Message"
                value={theme.labels.errorMessage}
                onChange={(v) => updateTheme('labels', 'errorMessage', v)}
                multiline
              />
            </div>
          </Card>

          <Card title="History Modal Labels" description="Chat history dialog text">
            <div className="space-y-3">
              <ThemeInput
                label="History Title"
                value={theme.labels.historyTitle}
                onChange={(v) => updateTheme('labels', 'historyTitle', v)}
              />
              <ThemeInput
                label="History Subtitle"
                value={theme.labels.historySubtitle}
                onChange={(v) => updateTheme('labels', 'historySubtitle', v)}
              />
              <ThemeInput
                label="History Empty"
                value={theme.labels.historyEmpty}
                onChange={(v) => updateTheme('labels', 'historyEmpty', v)}
              />
              <ThemeInput
                label="History Empty Hint"
                value={theme.labels.historyEmptyHint}
                onChange={(v) => updateTheme('labels', 'historyEmptyHint', v)}
              />
              <ThemeInput
                label="History Loading"
                value={theme.labels.historyLoading}
                onChange={(v) => updateTheme('labels', 'historyLoading', v)}
              />
              <ThemeInput
                label="Untitled Chat"
                value={theme.labels.historyUntitled}
                onChange={(v) => updateTheme('labels', 'historyUntitled', v)}
              />
            </div>
          </Card>

          <Card title="Date Labels" description="Date formatting text">
            <div className="space-y-3">
              <ThemeInput
                label="Today"
                value={theme.labels.dateToday}
                onChange={(v) => updateTheme('labels', 'dateToday', v)}
              />
              <ThemeInput
                label="Yesterday"
                value={theme.labels.dateYesterday}
                onChange={(v) => updateTheme('labels', 'dateYesterday', v)}
              />
              <ThemeInput
                label="Days Ago Template"
                value={theme.labels.dateDaysAgoTemplate}
                onChange={(v) => updateTheme('labels', 'dateDaysAgoTemplate', v)}
                description="Use {days} as placeholder, e.g., '{days} days ago'"
              />
            </div>
          </Card>

          <Card title="View Chat Labels" description="Read-only chat view text">
            <div className="space-y-3">
              <ThemeInput
                label="Read-Only Notice"
                value={theme.labels.readOnlyNotice}
                onChange={(v) => updateTheme('labels', 'readOnlyNotice', v)}
              />
              <ThemeInput
                label="Start New Chat"
                value={theme.labels.startNewChat}
                onChange={(v) => updateTheme('labels', 'startNewChat', v)}
              />
              <ThemeInput
                label="Back Button"
                value={theme.labels.backButton}
                onChange={(v) => updateTheme('labels', 'backButton', v)}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Backgrounds Tab */}
      {activeTab === 'backgrounds' && (
        <Card title="Backgrounds" description="Background colors and gradients">
          <div className="space-y-4">
            <ThemeInput
              label="Page Background"
              value={theme.backgrounds.page}
              onChange={(v) => updateTheme('backgrounds', 'page', v)}
              description="CSS background value (color, gradient, or image)"
            />
            <ThemeInput
              label="Header Background"
              value={theme.backgrounds.header}
              onChange={(v) => updateTheme('backgrounds', 'header', v)}
            />
            <ThemeInput
              label="Input Area Background"
              value={theme.backgrounds.inputArea}
              onChange={(v) => updateTheme('backgrounds', 'inputArea', v)}
            />
            <ThemeInput
              label="Modal Background"
              value={theme.backgrounds.modal}
              onChange={(v) => updateTheme('backgrounds', 'modal', v)}
            />
            <ThemeInput
              label="Modal Backdrop"
              value={theme.backgrounds.modalBackdrop}
              onChange={(v) => updateTheme('backgrounds', 'modalBackdrop', v)}
              description="Semi-transparent overlay behind modals"
            />
          </div>
        </Card>
      )}

      {/* Shadows Tab */}
      {activeTab === 'shadows' && (
        <Card title="Shadows" description="Box shadow values for various elements">
          <div className="space-y-4">
            <ThemeInput
              label="Bot Message Shadow"
              value={theme.shadows.botMessage}
              onChange={(v) => updateTheme('shadows', 'botMessage', v)}
              description="CSS box-shadow value"
            />
            <ThemeInput
              label="User Message Shadow"
              value={theme.shadows.userMessage}
              onChange={(v) => updateTheme('shadows', 'userMessage', v)}
            />
            <ThemeInput
              label="Button Shadow"
              value={theme.shadows.button}
              onChange={(v) => updateTheme('shadows', 'button', v)}
            />
            <ThemeInput
              label="Modal Shadow"
              value={theme.shadows.modal}
              onChange={(v) => updateTheme('shadows', 'modal', v)}
            />
          </div>
        </Card>
      )}

      {/* Border Radius Tab */}
      {activeTab === 'borders' && (
        <Card title="Border Radius" description="Roundness of various elements">
          <div className="grid grid-cols-2 gap-4">
            <ThemeInput
              label="Message Bubbles"
              value={theme.borderRadius.message}
              onChange={(v) => updateTheme('borderRadius', 'message', v)}
              placeholder="20px"
            />
            <ThemeInput
              label="Input Field"
              value={theme.borderRadius.input}
              onChange={(v) => updateTheme('borderRadius', 'input', v)}
              placeholder="9999px"
            />
            <ThemeInput
              label="Buttons"
              value={theme.borderRadius.button}
              onChange={(v) => updateTheme('borderRadius', 'button', v)}
              placeholder="9999px"
            />
            <ThemeInput
              label="Avatar"
              value={theme.borderRadius.avatar}
              onChange={(v) => updateTheme('borderRadius', 'avatar', v)}
              placeholder="9999px"
            />
            <ThemeInput
              label="Modal"
              value={theme.borderRadius.modal}
              onChange={(v) => updateTheme('borderRadius', 'modal', v)}
              placeholder="16px"
            />
          </div>
        </Card>
      )}

      {/* Preview Section */}
      <div className="mt-6">
        <Card title="Theme Preview" description="Live preview of your theme settings">
          <div
            className="rounded-lg overflow-hidden border"
            style={{
              background: theme.backgrounds.page,
              borderColor: theme.colors.border,
            }}
          >
            {/* Preview Header */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{
                background: theme.backgrounds.header,
                borderBottom: `1px solid ${theme.colors.border}`,
              }}
            >
              {theme.branding.logo ? (
                <img src={theme.branding.logo} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: theme.colors.primary }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
              )}
              <div>
                <div className="font-semibold text-sm" style={{ color: theme.colors.textDark }}>
                  {theme.branding.name}
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: theme.colors.textMuted }}>
                  {theme.branding.statusOnline && (
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                  {theme.branding.statusText}
                </div>
              </div>
            </div>

            {/* Preview Messages */}
            <div className="p-4 space-y-3" style={{ fontFamily: theme.typography.fontFamily }}>
              <div
                className="max-w-[80%] px-4 py-2 text-sm"
                style={{
                  background: theme.colors.botMessageBg,
                  color: theme.colors.botMessageText,
                  borderRadius: theme.borderRadius.message,
                  boxShadow: theme.shadows.botMessage,
                }}
              >
                {theme.labels.welcomeMessage}
              </div>
              <div
                className="max-w-[80%] ml-auto px-4 py-2 text-sm"
                style={{
                  background: theme.colors.userMessageBg,
                  color: theme.colors.userMessageText,
                  borderRadius: theme.borderRadius.message,
                  boxShadow: theme.shadows.userMessage,
                }}
              >
                Example user message
              </div>
            </div>

            {/* Preview Input */}
            <div
              className="px-4 py-3"
              style={{
                background: theme.backgrounds.inputArea,
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.input,
                }}
              >
                <span className="flex-1 text-sm" style={{ color: theme.colors.textMuted }}>
                  {theme.labels.inputPlaceholder}
                </span>
                <button
                  className="px-4 py-1.5 text-sm font-medium text-white"
                  style={{
                    background: theme.colors.primary,
                    borderRadius: theme.borderRadius.button,
                    boxShadow: theme.shadows.button,
                  }}
                >
                  {theme.labels.sendButton}
                </button>
              </div>
            </div>
          </div>
        </Card>
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
