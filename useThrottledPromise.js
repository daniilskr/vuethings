import { ref } from "vue";

export const useThrottledPromise = (callback) => { 
    const isProcessing = ref(false);
    let lastUnprocessed = null;

    const processCallback = () => {
        if (lastUnprocessed) {
            const process = lastUnprocessed;
            lastUnprocessed = null;
            process().catch(processCallback).then(processCallback);
        } else {
            isProcessing.value = false;
        }
    };

    // Возможно стоит перегонять args в JSON и обратно, чтобы они не мутировали, пока промис ждет своего часа?
    const callThrottled = (...args) => {
        lastUnprocessed = () => callback(...args);
        if (! isProcessing.value) {
            isProcessing.value = true;
            processCallback();
        }
    };

    return {
        callThrottled,
        isProcessing,
    };
}
