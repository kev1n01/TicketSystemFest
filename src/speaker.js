export default function speaker(text) {
    if (!window.speechSynthesis) {
        alert("API de síntesis de voz no soportada en este navegador.");
        return;
    }

    // Crear el mensaje a reproducir
    const message = new SpeechSynthesisUtterance(`${text}`);

    // Configurar opciones de voz (puedes ajustarlas según prefieras)
    message.lang = "es-ES"; // Idioma: Español
    message.pitch = 1; // Tono de la voz
    message.rate = 1; // Velocidad de reproducción

    // Obtener las voces disponibles en el navegador
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.lang.startsWith("es")) || voices[0]; // Escoge una voz en español o la primera disponible
    if (selectedVoice) {
        message.voice = selectedVoice;
    }

    // Reproducir el mensaje
    window.speechSynthesis.speak(message);
}