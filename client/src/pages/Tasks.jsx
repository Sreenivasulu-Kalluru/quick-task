import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Search, Filter, Trash2, Edit2, Calendar } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../components/Spinner';
import ConfirmationModal from '../components/ConfirmationModal';
import TasksSkeleton from '../components/TasksSkeleton';
import SEO from '../components/SEO';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, search, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let result = [...tasks];

    if (search) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== 'All') {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(result);
  };

  const handleDelete = (id) => {
    setTaskToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await api.delete(`/tasks/${taskToDelete}`);
      setTasks(tasks.filter((t) => t._id !== taskToDelete));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleTaskSaved = (savedTask, isEdit) => {
    if (isEdit) {
      setTasks(tasks.map((t) => (t._id === savedTask._id ? savedTask : t)));
    } else {
      setTasks([savedTask, ...tasks]);
    }
    setIsModalOpen(false);
    toast.success(`Task ${isEdit ? 'updated' : 'created'} successfully`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <SEO
        title="My Tasks"
        description="Manage, sort, and filter your daily tasks."
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-white">My Tasks</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Task</span>
        </motion.button>
      </div>
      {/* Filters */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="input-field md:w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="input-field md:w-40"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </motion.div>
      {/* Task List */}
      {loading ? (
        <TasksSkeleton />
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                variants={itemVariants}
                exit="exit"
                layout
                className="card hover:border-primary-500/50 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">
                        {task.title}
                      </h3>
                      <span
                        className={clsx(
                          'text-xs px-2 py-1 rounded-full border',
                          getPriorityColor(task.priority)
                        )}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                        {task.status}
                      </span>
                    </div>
                    <p className="text-slate-400 mb-3">{task.description}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <span>
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 w-full md:w-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-slate-400 hover:text-primary-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-slate-500"
            >
              No tasks found. Create one to get started!
            </motion.div>
          )}
        </motion.div>
      )}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={currentTask}
          onSave={handleTaskSaved}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        type="danger"
      />
    </div>
  );
};

export default Tasks;
