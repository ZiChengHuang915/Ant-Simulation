export function degreesToRad(degree) {
    return degree * Math.PI / 180;
}

export function distSq(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}