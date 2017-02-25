/**
 * Created by s911415 on 2017/02/25.
 */

"use strict";

/**
 * Try convert an object to array
 * @param obj
 * @returns {*}
 */
Array.prototype.toArray = (obj) => {
    return Array.prototype.slice.call(obj);
};