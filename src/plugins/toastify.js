import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const ToastContainerOptions = {
  limit: 3,
  autoClose: 4000,
  hideProgressBar: true,
  transition: toast.TRANSITIONS.SLIDE,
  position: toast.POSITION.BOTTOM_CENTER,
}

export default {
  Vue3Toastify,
  ToastContainerOptions,
  toast
}