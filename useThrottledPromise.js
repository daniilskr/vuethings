import { ref } from "vue";

export const useThrottledPromise = (callback: any) => { 
    const isProcessing = ref(false);
    let lastUnprocessed: any = null;

    const processCallback = () => {
        if (lastUnprocessed) {
            const process = lastUnprocessed;
            lastUnprocessed = null;
            process().then(processCallback).catch(processCallback);
        } else {
            isProcessing.value = false;
        }
    };

    // Возможно стоит перегонять args в JSON и обратно, чтобы они не мутировали, пока промис ждет своего часа?
    const callThrottled = (...args: any) => {
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
