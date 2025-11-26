"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = toMinutes;
exports.toTime = toTime;
function toMinutes(time) {
    const [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
}
function toTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const minutesRemaining = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutesRemaining
        .toString()
        .padStart(2, "0")}`;
}
//# sourceMappingURL=utilities.js.map