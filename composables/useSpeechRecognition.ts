import { ref, onUnmounted } from "vue";

export function useSpeechRecognition() {
    const transcript = ref("");
    const isListening = ref(false);
    const scaleValue = ref(1);
    const opacityValue = ref(1);

    let recognition: SpeechRecognition | null = null;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;

    if (process.client) {
        // Check for browser compatibility
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            recognition =
                new (window as any).webkitSpeechRecognition() ||
                new (window as any).SpeechRecognition();

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "ar-SA"; // Arabic recognition (you can make this dynamic)

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                transcript.value = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join(" ");
            };

            recognition.onend = () => {
                isListening.value = false;
            };
        } else {
            console.error("Speech Recognition API is not supported in this browser.");
        }
    }

    //   const startListening = () => {
    //     if (recognition) {
    //       recognition.start();
    //       isListening.value = true;
    //     }
    //   };

    const startListening = () => {
        if (recognition) {
            recognition.start();
            isListening.value = true;

            // Initialize audio context for volume detection
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);

                    // Start analyzing volume
                    analyzeVolume();
                })
                .catch((error) => console.error("Error accessing microphone", error));
        }
    };

    // const stopListening = () => {
    //     if (recognition) {
    //         recognition.stop();
    //         isListening.value = false;
    //     }
    // };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            isListening.value = false;
        }
        if (audioContext) {
            audioContext.close();
        }
    };

    const analyzeVolume = () => {
        if (!isListening.value) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        dataArray.forEach((value) => {
            sum += value;
        });

        const averageVolume = sum / dataArray.length;

        // Map volume to scale and opacity
        scaleValue.value = Math.min(1 + averageVolume / 100, 1.5);
        opacityValue.value = Math.min(averageVolume / 255, 1);

        requestAnimationFrame(analyzeVolume); // Continue analyzing volume
    };

    // Clean up on component unmount to avoid memory leaks
    onUnmounted(() => {
        if (recognition) {
            recognition.stop();
            recognition = null;
        }
    });

    return { transcript, isListening, startListening, stopListening, scaleValue, opacityValue };}
