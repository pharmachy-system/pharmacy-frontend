import { toast } from 'sonner';

export function useToast() {
  return {
    success: (msg, opts) => toast.success(msg, opts),
    error:   (msg, opts) => toast.error(msg, opts),
    info:    (msg, opts) => toast.info(msg, opts),
    warning: (msg, opts) => toast.warning(msg, opts),
    loading: (msg, opts) => toast.loading(msg, opts),
    dismiss: (id) => toast.dismiss(id),
    promise: (promise, msgs) => toast.promise(promise, msgs),
  };
}
