import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Plan, CreatePlanInput } from '../types/plan';

export const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Basic',
      numberOfChats: 100,
      numberOfQuestions: 1000,
      questionSizeInWords: 50,
      historyItemsLimit: 10,
      createdAt: new Date('2025-01-15'),
    },
    {
      id: '2',
      name: 'Pro',
      numberOfChats: 500,
      numberOfQuestions: 5000,
      questionSizeInWords: 100,
      historyItemsLimit: 50,
      createdAt: new Date('2025-01-20'),
    },
    {
      id: '3',
      name: 'Enterprise',
      numberOfChats: -1,
      numberOfQuestions: -1,
      questionSizeInWords: 200,
      historyItemsLimit: 100,
      createdAt: new Date('2025-02-01'),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<CreatePlanInput>({
    name: '',
    numberOfChats: '',
    numberOfQuestions: '',
    questionSizeInWords: '',
    historyItemsLimit: '',
  });
  const [errors, setErrors] = useState<Partial<CreatePlanInput>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleOpenModal = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
    setFormData({
      name: '',
      numberOfChats: '',
      numberOfQuestions: '',
      questionSizeInWords: '',
      historyItemsLimit: '',
    });
    setErrors({});
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      numberOfChats: String(plan.numberOfChats),
      numberOfQuestions: String(plan.numberOfQuestions),
      questionSizeInWords: String(plan.questionSizeInWords),
      historyItemsLimit: String(plan.historyItemsLimit),
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleInputChange = (field: keyof CreatePlanInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreatePlanInput> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required';
    }

    if (!formData.numberOfChats.trim()) {
      newErrors.numberOfChats = 'Number of chats is required';
    } else if (isNaN(Number(formData.numberOfChats))) {
      newErrors.numberOfChats = 'Must be a valid number';
    }

    if (!formData.numberOfQuestions.trim()) {
      newErrors.numberOfQuestions = 'Number of questions is required';
    } else if (isNaN(Number(formData.numberOfQuestions))) {
      newErrors.numberOfQuestions = 'Must be a valid number';
    }

    if (!formData.questionSizeInWords.trim()) {
      newErrors.questionSizeInWords = 'Question size is required';
    } else if (isNaN(Number(formData.questionSizeInWords)) || Number(formData.questionSizeInWords) <= 0) {
      newErrors.questionSizeInWords = 'Must be a positive number';
    }

    if (!formData.historyItemsLimit.trim()) {
      newErrors.historyItemsLimit = 'History items limit is required';
    } else if (isNaN(Number(formData.historyItemsLimit)) || Number(formData.historyItemsLimit) <= 0) {
      newErrors.historyItemsLimit = 'Must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePlan = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingPlan) {
      // Update existing plan
      const updatedPlan: Plan = {
        ...editingPlan,
        name: formData.name,
        numberOfChats: Number(formData.numberOfChats),
        numberOfQuestions: Number(formData.numberOfQuestions),
        questionSizeInWords: Number(formData.questionSizeInWords),
        historyItemsLimit: Number(formData.historyItemsLimit),
      };

      setPlans((prev) => prev.map((plan) => (plan.id === editingPlan.id ? updatedPlan : plan)));
      setToastMessage('Plan updated successfully!');
    } else {
      // Create new plan
      const newPlan: Plan = {
        id: String(Date.now()),
        name: formData.name,
        numberOfChats: Number(formData.numberOfChats),
        numberOfQuestions: Number(formData.numberOfQuestions),
        questionSizeInWords: Number(formData.questionSizeInWords),
        historyItemsLimit: Number(formData.historyItemsLimit),
        createdAt: new Date(),
      };

      setPlans((prev) => [...prev, newPlan]);
      setToastMessage('Plan added successfully!');
    }

    setLoading(false);
    setIsModalOpen(false);
    setEditingPlan(null);
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteClick = (id: string) => {
    setPlanToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) {
      return;
    }

    setDeleteLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setPlans((prev) => prev.filter((plan) => plan.id !== planToDelete));
    setDeleteLoading(false);
    setIsDeleteDialogOpen(false);
    setPlanToDelete(null);
    setToastMessage('Plan deleted successfully');
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const formatNumber = (num: number): string => {
    if (num === -1) {
      return 'Unlimited';
    }
    return num.toLocaleString();
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your chatbot subscription plans
          </p>
        </div>
        <Button onClick={handleOpenModal}>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Plan
          </span>
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  History Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                        {plan.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatNumber(plan.numberOfChats)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatNumber(plan.numberOfQuestions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {plan.questionSizeInWords} words
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {plan.historyItemsLimit} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                        title="Edit plan"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(plan.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Delete plan"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {plans.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No plans</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new plan.</p>
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPlan ? 'Edit Plan' : 'Add New Plan'}>
        <div className="space-y-4">
          <Input
            label="Plan Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="e.g., Basic, Pro, Enterprise"
            helperText="A descriptive name for the plan"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Number of Chats"
              type="number"
              value={formData.numberOfChats}
              onChange={(e) => handleInputChange('numberOfChats', e.target.value)}
              error={errors.numberOfChats}
              placeholder="100"
              helperText="Use -1 for unlimited"
            />

            <Input
              label="Number of Questions"
              type="number"
              value={formData.numberOfQuestions}
              onChange={(e) => handleInputChange('numberOfQuestions', e.target.value)}
              error={errors.numberOfQuestions}
              placeholder="1000"
              helperText="Use -1 for unlimited"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Question Size (words)"
              type="number"
              value={formData.questionSizeInWords}
              onChange={(e) => handleInputChange('questionSizeInWords', e.target.value)}
              error={errors.questionSizeInWords}
              placeholder="50"
              helperText="Max words per question"
            />

            <Input
              label="History Items Limit"
              type="number"
              value={formData.historyItemsLimit}
              onChange={(e) => handleInputChange('historyItemsLimit', e.target.value)}
              error={errors.historyItemsLimit}
              placeholder="10"
              helperText="Chat history items to store"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan} loading={loading}>
              {editingPlan ? 'Update Plan' : 'Add Plan'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

