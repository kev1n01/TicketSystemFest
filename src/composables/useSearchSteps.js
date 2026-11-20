import { computed, ref } from "vue";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Drives a "searching" step list around one async lookup.
 * The first step lasts as long as the real request (with a minimum, so it reads as a search);
 * the remaining steps then confirm, one by one, what that request already did.
 *
 * `task` must resolve to `{ success, message }`, like the user store actions.
 */
export function useSearchSteps(labels, { minStepMs = 650, minSearchMs = 1100 } = {}) {
  const states = ref(labels.map(() => "pending"));
  const visible = ref(false);

  const steps = computed(() => labels.map((label, index) => ({ label, state: states.value[index] })));

  const setState = (index, state) => {
    states.value = states.value.map((current, i) => (i === index ? state : current));
  };

  async function run(task) {
    visible.value = true;
    states.value = labels.map(() => "pending");
    setState(0, "active");

    let result;
    try {
      [result] = await Promise.all([task(), wait(minSearchMs)]);
    } catch (error) {
      setState(0, "error");
      throw error;
    }

    if (!result?.success) {
      setState(0, "error");
      return result;
    }

    setState(0, "done");
    for (let index = 1; index < labels.length; index++) {
      setState(index, "active");
      await wait(minStepMs);
      setState(index, "done");
    }
    return result;
  }

  function reset() {
    visible.value = false;
    states.value = labels.map(() => "pending");
  }

  return { steps, visible, run, reset };
}
