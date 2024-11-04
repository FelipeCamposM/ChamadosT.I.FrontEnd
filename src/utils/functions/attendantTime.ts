export function attendantTime(dateattributed: Date, datefinished: Date) {
    const dateStart = typeof dateattributed === 'string' ? new Date(dateattributed) : dateattributed;
    const dateEnd = typeof datefinished === 'string' ? new Date(datefinished) : datefinished;

    // Calcula a diferença em milissegundos
    const diffMs = dateEnd.getTime() - dateStart.getTime();
    
    // Converte a diferença para dias, horas e minutos
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);


    // Formata a saída
    const daysPart = diffDays > 0 ? `${diffDays} dias ` : "";
    const timePart = `${String(diffHours).padStart(2, '0')}h :${String(diffMinutes).padStart(2, '0')}min :${String(diffSeconds).padStart(2, '0')}s`;

    return daysPart + timePart;
}