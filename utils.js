/**
 * 纯函数工具集:页面脚本与 node --test 共用(UMD 风格导出)
 */
(function (global) {
  'use strict';

  /** Fisher-Yates 洗牌,返回新数组不改动原数组 */
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /** 秒 → "mm:ss" */
  function formatTimeSec(sec) {
    if (!Number.isFinite(sec) || sec < 0) sec = 0;
    sec = Math.floor(sec);
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${s}`;
  }

  /**
   * 成绩比较:result a 是否优于 b。
   * 规则:先比分数(高好),再比用时(低好),再比失误数(低好)。b 为空视为 a 更好。
   * result 形如 { score, total, errors, timeSec }
   */
  function isBetterResult(a, b) {
    if (!a) return false;
    if (!b) return true;
    if (a.score !== b.score) return a.score > b.score;
    if (a.timeSec !== b.timeSec) return a.timeSec < b.timeSec;
    return (a.errors ?? Infinity) < (b.errors ?? Infinity);
  }

  /** 把 GeoJSON 坐标精度截断到 2 位小数,返回新结构 */
  function quantizeGeo(geo, precision) {
    const p = precision ?? 2;
    const fix = (ring) => ring.map(([lon, lat]) => [
      Math.round(lon * 10 ** p) / 10 ** p,
      Math.round(lat * 10 ** p) / 10 ** p
    ]);
    if (geo.type === 'Polygon') {
      return { type: 'Polygon', coordinates: geo.coordinates.map(fix) };
    }
    return { type: 'MultiPolygon', coordinates: geo.coordinates.map(poly => poly.map(fix)) };
  }

  const FlagUtils = { shuffleArray, formatTimeSec, isBetterResult, quantizeGeo };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlagUtils;
  } else {
    global.FlagUtils = FlagUtils;
  }
})(typeof window !== 'undefined' ? window : globalThis);
