import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.5, bounce: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger', // danger | info | warning
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700 overflow-hidden"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            <div
              className={clsx(
                'mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4',
                type === 'danger' && 'bg-red-500/10 text-red-500',
                type === 'warning' && 'bg-yellow-500/10 text-yellow-500',
                type === 'info' && 'bg-blue-500/10 text-blue-500'
              )}
            >
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 mb-6">{message}</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors w-full"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={clsx(
                  'px-4 py-2 rounded-lg text-white transition-colors w-full font-medium',
                  type === 'danger'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-primary-500 hover:bg-primary-600'
                )}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
