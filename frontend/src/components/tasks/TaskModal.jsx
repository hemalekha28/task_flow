import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, AlertTriangle, Flag, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTask } from '../../context/TaskContext';
import { showToast } from '../common/Toast';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import DatePicker from 'react-datepicker';
import { getAnimationProps } from '../../utils/animationUtils';

const TaskModal = ({ isOpen, onClose, task = null }) => {
  const { createTask, updateTask } = useTask();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(3);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'pending',
      dueDate: task?.dueDate || ''
    }
  });

  const priority = watch('priority');
  const status = watch('status');

  React.useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description);
      setValue('priority', task.priority);
      setValue('status', task.status);
      setValue('dueDate', task.dueDate);
    } else {
      reset();
      setCurrentStep(1);
    }
  }, [task, setValue, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (task) {
        await updateTask(task._id, data);
        showToast.success('Task updated successfully!');
      } else {
        await createTask(data);
        showToast.success('Task created successfully!');
      }
      onClose();
    } catch (error) {
      showToast.error(task ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'high', label: 'High', icon: AlertTriangle, color: 'text-priority-high' },
    { value: 'medium', label: 'Medium', icon: Flag, color: 'text-priority-medium' },
    { value: 'low', label: 'Low', icon: Circle, color: 'text-priority-low' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const PriorityIcon = priorityOptions.find(opt => opt.value === priority)?.icon || Flag;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="Task Title"
              placeholder="Enter task title"
              {...register('title', { 
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Title must be less than 100 characters'
                }
              })}
              error={errors.title?.message}
            />
            <Input
              label="Description"
              placeholder="Enter task description"
              as="textarea"
              rows="3"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description must be less than 500 characters'
                }
              })}
              error={errors.description?.message}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {priorityOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue('priority', opt.value)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        priority === opt.value
                          ? 'border-accent-purple bg-accent-purple/10'
                          : 'border-dark-card hover:bg-dark-card'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mx-auto ${opt.color} mb-1`} />
                      <span className="text-sm text-text-primary">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('status', opt.value)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      status === opt.value
                        ? 'border-accent-purple bg-accent-purple/10'
                        : 'border-dark-card hover:bg-dark-card'
                    }`}
                  >
                    <span className="text-sm text-text-primary">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Due Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={watch('dueDate') ? new Date(watch('dueDate')) : null}
                  onChange={(date) => setValue('dueDate', date ? date.toISOString() : '')}
                  className="w-full px-3 py-2 bg-dark-secondary text-text-primary border border-dark-card rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple"
                  placeholderText="Select due date"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-text-secondary">
              {priorityOptions.find(opt => opt.value === priority)?.label} Priority
            </span>
          </div>
          <div className="w-full bg-dark-card rounded-full h-2">
            <div 
              className="bg-accent-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form content */}
        <motion.div
          key={currentStep}
          {...getAnimationProps({
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 }
          })}
          className="mb-6"
        >
          {renderStep()}
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            )}
          </div>
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
              >
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;