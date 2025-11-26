export default function toMinutes(time: string) {
    const [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
}

export function toTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const minutesRemaining = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutesRemaining
        .toString()
        .padStart(2, "0")}`;
}

