export function formatDatetime(date: Date): string {
    return formatDatetimeString(date.toISOString());
}

export function formatDatetimeString(date: string): string {
    return date.slice(0, 19);
}

export function humanReadableTime(date: string): string {
    return Intl.DateTimeFormat('bg-BG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

export function now(): string {
    return formatDatetime(new Date());
}