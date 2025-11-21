import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Plan, PlanInput, PlanPeriod} from '../types/plan';
import { PlanSchema } from '../types/plan';
import { useRouter } from '@tanstack/react-router';
import { makePlansApi } from '../api/plans-api';
import { flattenErrors } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';
import { humanReadableTime, now } from '../utils/time';


export const Plans: React.FC<{ plans: Plan[] }> = ({ plans = [] }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<PlanInput>({
    name: '',
    totalChats: '0',
    totalQuestions: '0',
    questionSize: '0',
    historySize: '0',
    period: 'month',
  });
  const [errors, setErrors] = useState<Partial<PlanInput & {general?: string, planPeriod?: string}>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const router = useRouter();

  const handleOpenModal = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
    setFormData({
      name: '',
      totalChats: '0' as string,
      totalQuestions: '0' as string,
      questionSize: '0' as string,
      historySize: '0' as string,
      period: 'month',
    });
    setErrors({});
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      totalChats: plan.totalChats?.toString(),
      totalQuestions: plan.totalQuestions?.toString(),
      questionSize: plan.questionSize?.toString(),
      historySize: plan.historySize?.toString(),
      period: plan.period,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleInputChange = (field: keyof PlanInput, value: string | PlanPeriod) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if ((errors as Partial<PlanInput>)[field]) {
      setErrors((prev) => ({ ...prev, [field as keyof PlanInput]: undefined }));
    }
  };


  const handleSavePlan = async () => {
    const newPlan: any = {
      id: "",
      createdAt: now(),
     
      ...plans.find((p) => p.id === editingPlan?.id),
      ...formData,
      totalChats: Number(formData.totalChats),
      totalQuestions: Number(formData.totalQuestions),
      questionSize: Number(formData.questionSize),
      historySize: Number(formData.historySize),
      updatedAt: now(),
    } 
    
 
    const result = PlanSchema.safeParse(newPlan);
    if (!result.success) {
      setErrors(flattenErrors(result.error));
      return;
    };
    const plan = result.data;

    setLoading(true);

    try {
      if (editingPlan) {
        // Update existing plan
        const response = await makePlansApi().update(plan);
        
        if (!response.plan) {
          console.log("error");
          setErrors({ general: response.message.toString() || 'An error occurred while saving the configs' });
          setToastMessage(response.message.toString() || 'An error occurred while saving the configs');
          setToastType('error');
          setShowToast(true);
          return;
        }
        router.invalidate();
        setToastMessage('Plan updated successfully!');  
        setToastType('success');
        setShowToast(true);
        setIsModalOpen(false);
        setEditingPlan(null);
      } else {
        // Create new plan
        const response = await makePlansApi().post(plan);

        console.log(response);
        return;

        if (!response.plan) {
          setErrors({ general: response.message.toString() || 'An error occurred while saving the plan' });
          setToastMessage(response.message.toString() || 'An error occurred while saving the plan');

          setToastType('error');
          setShowToast(true);
          return;
        }

        router.invalidate();
        setToastMessage('Plan added successfully!');
        setToastType('success');
        setShowToast(true);
        setIsModalOpen(false);
        setEditingPlan(null);
      }
    } catch (error) {
      setErrors({
        general: 'An error occurred while saving the plan',
      });
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }

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

    try {
      const response = await makePlansApi().delete(planToDelete);
      if (!response.success) {
        setErrors({ general: response.message.toString() || 'An error occurred while saving the configs' });
        setToastMessage(response.message.toString() || 'An error occurred while saving the configs');
        setToastType('error');
        setShowToast(true);
        return;
      }

      router.invalidate();
      setToastMessage('Plan deleted successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred while deleting the plan',
      });
      setToastMessage(error instanceof Error ? error.message : 'An error occurred while deleting the plan');
      setToastType('error');
      setShowToast(true);
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
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

  const formatPlanPeriod = (period: PlanPeriod): string => {
    const periodLabels: Record<PlanPeriod, string> = {
      month: 'Month',
      year: 'Year',
      week: 'Week', 
      day: 'Day',
      lifetime: 'Lifetime',
    };
    return periodLabels[period];
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
                  Period
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatPlanPeriod(plan.period)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatNumber(plan.totalChats)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatNumber(plan.totalQuestions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatNumber(plan.questionSize || -1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatNumber(plan.historySize)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {humanReadableTime(plan.createdAt)}
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
                        onClick={() => handleDeleteClick(plan.id!)}
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
            error={errors.name as string}
            placeholder="e.g., Basic, Pro, Enterprise"
            helperText="A descriptive name for the plan"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Period
            </label>
            <select
              value={formData.period}
              onChange={(e) => handleInputChange('period', e.target.value as PlanPeriod)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="lifetime">Lifetime</option>
            </select>
            <p className="mt-1.5 text-sm text-gray-500">Billing period for this plan</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Number of Chats"
              type="number"
              value={formData.totalChats}
              onChange={(e) => handleInputChange('totalChats', e.target.value)}
              error={errors.totalChats}
              placeholder="100"
              helperText="Use -1 for unlimited"
            />

            <Input
              label="Number of Questions"
              type="number"
              value={formData.totalQuestions}
              onChange={(e) => handleInputChange('totalQuestions', e.target.value)}
              error={errors.totalQuestions}
              placeholder="1000"
              helperText="Use -1 for unlimited"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Question Size (words)"
              type="number"
              value={formData.questionSize}
              onChange={(e) => handleInputChange('questionSize', e.target.value)}
              error={errors.questionSize}
              placeholder="50"
              helperText="Max words per question"
            />

            <Input
              label="History Items Limit"
              type="number"
              value={formData.historySize}
              onChange={(e) => handleInputChange('historySize', e.target.value)}
              error={errors.historySize}
              placeholder="10"
              helperText="Chat history items to store"
            />
          </div>
          {errors.general && (
            <div className="text-red-500 text-sm mt-2">
              {errors.general}
            </div>
          )}
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

