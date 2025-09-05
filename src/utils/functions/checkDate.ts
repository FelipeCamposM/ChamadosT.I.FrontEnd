export function checkDate(createdAt: Date | string){
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if(diffDays >= 7 && diffDays < 10) {
        return "level1"
    }
    else if(diffDays >= 10 && diffDays < 15) {
        return "level2"
    }
    else if(diffDays >= 15) {
        return "level3"
    }
    else {
        return ""
    }
}