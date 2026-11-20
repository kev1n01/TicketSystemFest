import { reactive } from "vue";

const MAX_VISIBLE = 3;
const DEFAULT_DURATION = { success: 4000, error: 6000 };

// One toast stack shared by the whole app, rendered by ToastHost.vue (mounted once in App.vue)
const state = reactive({ items: [] });
const timers = new Map(); // toast id -> { handle, remaining, startedAt }
let nextId = 0;

const findItem = (id) => state.items.find((item) => item.id === id);

function clearTimer(id) {
  const timer = timers.get(id);
  if (timer?.handle) clearTimeout(timer.handle);
  timers.delete(id);
}

function startTimer(id, duration) {
  clearTimer(id);
  timers.set(id, {
    remaining: duration,
    startedAt: Date.now(),
    handle: setTimeout(() => dismiss(id), duration),
  });
}

function dismiss(id) {
  clearTimer(id);
  const index = state.items.findIndex((item) => item.id === id);
  if (index !== -1) state.items.splice(index, 1);
}

// Hovering or focusing a toast freezes its countdown so it can be read calmly
function pause(id) {
  const timer = timers.get(id);
  const item = findItem(id);
  if (!timer || !timer.handle || !item) return;
  clearTimeout(timer.handle);
  timer.handle = null;
  timer.remaining -= Date.now() - timer.startedAt;
  item.paused = true;
}

function resume(id) {
  const timer = timers.get(id);
  const item = findItem(id);
  if (!timer || timer.handle || !item) return;
  timer.startedAt = Date.now();
  timer.handle = setTimeout(() => dismiss(id), Math.max(timer.remaining, 0));
  item.paused = false;
}

/**
 * `exclusive: true` clears every other visible toast first, so a new outcome (a login, a scan
 * result) is never read next to a stale one.
 */
function show(type, message, { title = "", duration, exclusive = false } = {}) {
  const isSameNotice = (item) => item.type === type && item.title === title && item.message === message;

  if (exclusive) {
    state.items.filter((item) => !isSameNotice(item)).forEach((item) => dismiss(item.id));
  }

  // The same notice fired again (e.g. the scanner reading one QR several times) refreshes the
  // visible toast instead of stacking copies of it
  const existing = state.items.find(isSameNotice);
  if (existing) {
    existing.cycle += 1;
    existing.paused = false;
    startTimer(existing.id, existing.duration);
    return existing.id;
  }

  const id = ++nextId;
  const item = { id, type, title, message, duration: duration ?? DEFAULT_DURATION[type], cycle: 0, paused: false };
  state.items.push(item);
  startTimer(id, item.duration);

  while (state.items.length > MAX_VISIBLE) dismiss(state.items[0].id);
  return id;
}

export const toast = {
  success: (message, options) => show("success", message, options),
  error: (message, options) => show("error", message, options),
  dismiss,
};

export function useToastStack() {
  return { items: state.items, pause, resume, dismiss };
}
