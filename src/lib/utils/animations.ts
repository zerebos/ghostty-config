function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
    // Adapted from http://dmitry.baranovskiy.com/bezier-easing.html
    return (x: number) => {
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;

        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;

        const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
        const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
        const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

        let t = x;
        for (let i = 0; i < 5; i += 1) {
            const dx = sampleX(t) - x;
            const d = sampleDX(t);
            if (Math.abs(d) < 1e-6) break;
            t -= dx / d;
            t = Math.max(0, Math.min(1, t));
        }
        return sampleY(t);
    };
}

export const sequoiaEase = cubicBezier(0.4, 0.0, 0.2, 1.0);
export const sequoiaFly = {y: -44, duration: 300, easing: sequoiaEase};
export const sequoiaFlyFast = {y: -44, duration: 250, easing: sequoiaEase};