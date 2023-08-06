import { ref } from "vue";

export const useThrottledPromiseQueue = () => { 
    const queue = [];
    const isProcessing = ref(false);

    const processQueue = () => {
        let lastPromise = null;
        while (queue.length) {
            lastPromise = queue.shift();
        }
        if (lastPromise) {
            lastPromise().catch(processQueue).then(processQueue);
        } else {
            isProcessing.value = false;
        }
    };
     
    const enqueue = (promiseCallback) => {
        queue.push(promiseCallback);
        if (! isProcessing.value) {
            isProcessing.value = true;
            processQueue();
        }
    };

    return {
        enqueue,
        isProcessing,
    };
}
