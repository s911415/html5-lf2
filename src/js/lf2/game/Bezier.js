"use strict";
var lf2 = (function (lf2) {
    /**
     * @method bezier
     * @param {number[]} controlPoints - [x1, y1, x2, y2]
     * @param {number} x - time(0 - 1)
     * @return {number}  - y(0 - 1)
     */
    const Bezier = (function () {
        const cos = Math.cos,
            acos = Math.acos,
            max = Math.max,
            pi = Math.PI,
            tau = 2 * pi,
            sqrt = Math.sqrt;

        function crt(v) {
            if (v < 0) {
                return -Math.pow(-v, 1 / 3);
            }
            else {
                return Math.pow(v, 1 / 3);
            }
        }

        // Modified from http://jsbin.com/yibipofeqi/1/edit, optimized for animations.
        // The origin Cardano's algorithm is based on http://www.trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm
        function cardano(curve, x) {
            let pa = x - 0;
            let pb = x - curve[0];
            let pc = x - curve[2];
            let pd = x - 1;

            let pa3 = pa * 3;
            let pb3 = pb * 3;
            let pc3 = pc * 3;
            let d = (-pa + pb3 - pc3 + pd),
                rd = 1 / d,
                r3 = 1 / 3,
                a = (pa3 - 6 * pb + pc3) * rd,
                a3 = a * r3,
                b = (-pa3 + pb3) * rd,
                c = pa * rd,
                p = (3 * b - a * a) * r3,
                p3 = p * r3,
                q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
                q2 = q / 2,
                discriminant = q2 * q2 + p3 * p3 * p3,
                u1, v1, x1, x2, x3;

            if (discriminant < 0) {
                let mp3 = -p * r3,
                    mp33 = mp3 * mp3 * mp3,
                    r = sqrt(mp33),
                    t = -q / (2 * r),
                    cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
                    phi = acos(cosphi),
                    crtr = crt(r),
                    t1 = 2 * crtr;
                x1 = t1 * cos(phi * r3) - a3;
                x2 = t1 * cos((phi + tau) * r3) - a3;
                x3 = t1 * cos((phi + 2 * tau) * r3) - a3;

                if (0 <= x1 && x1 <= 1) {
                    if (0 <= x2 && x2 <= 1) {
                        if (0 <= x3 && x3 <= 1) {
                            return max(x1, x2, x3);
                        }
                        else {
                            return max(x1, x2);
                        }
                    }
                    else if (0 <= x3 && x3 <= 1) {
                        return max(x1, x3);
                    }
                    else {
                        return x1;
                    }
                }
                else {
                    if (0 <= x2 && x2 <= 1) {
                        if (0 <= x3 && x3 <= 1) {
                            return max(x2, x3);
                        }
                        else {
                            return x2;
                        }
                    }
                    else {
                        return x3;
                    }
                }
            }
            else if (discriminant === 0) {
                u1 = q2 < 0 ? crt(-q2) : -crt(q2);
                x1 = 2 * u1 - a3;
                x2 = -u1 - a3;

                if (0 <= x1 && x1 <= 1) {
                    if (0 <= x2 && x2 <= 1) {
                        return max(x1, x2);
                    }
                    else {
                        return x1;
                    }
                }
                else {
                    return x2;
                }
            }
            else {
                let sd = sqrt(discriminant);
                u1 = crt(-q2 + sd);
                v1 = crt(q2 + sd);
                x1 = u1 - v1 - a3;
                return x1;
            }
        }

        function get(a, b, c, d, t) {
            let t1 = 1 - t;
            return a * t1 * t1 * t1 +
                b * 3 * t * t1 * t1 +
                c * 3 * t * t * t1 +
                d * t * t * t;
        }

        return function (controlPoints, x) {
            let percent = cardano(controlPoints, x);
            let p0y = 0;
            let p1y = controlPoints[1];
            let p2y = controlPoints[3];
            let p3y = 1;
            return get(p0y, p1y, p2y, p3y, percent);
        };
    })();
    lf2.Bezier = Bezier;

    return lf2;
})(lf2 || {});
