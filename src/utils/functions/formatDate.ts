export function formatDate(date: string | Date): string {
    if (date !== null){
        // Verifique se a data é uma string, e converta para Date se necessário
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      // Caso a conversão para Date falhe (data inválida), retorne uma string padrão
      return 'Data inválida';
    }
  
    const day = String(dateObj.getDate()).padStart(2, '0'); // Dia com dois dígitos
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mês com dois dígitos
    const year = dateObj.getFullYear(); // Ano
    const hours = String(dateObj.getHours()).padStart(2, '0'); // Hora com dois dígitos
    const minutes = String(dateObj.getMinutes()).padStart(2, '0'); // Minuto com dois dígitos

  
    return `${day}/${month}/${year} - ${hours}:${minutes}`; // Retorna a data formatada como DD/MM/YYYY
    } else {
        return date = "Não informado"
    }
  }