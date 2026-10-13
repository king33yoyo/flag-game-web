import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { shuffleArray, formatTimeSec, isBetterResult, quantizeGeo } = require('../utils.js');

test('shuffleArray 保留全部元素且不改原数组', () => {
  const src = Array.from({ length: 52 }, (_, i) => i);
  const out = shuffleArray(src);
  assert.equal(out.length, 52);
  assert.deepEqual([...out].sort((a, b) => a - b), src, '洗牌后元素集合不变');
  assert.deepEqual(src, Array.from({ length: 52 }, (_, i) => i), '原数组不被修改');
});

test('shuffleArray 输出有随机性', () => {
  const src = Array.from({ length: 20 }, (_, i) => i);
  const same = [0, 1, 2].map(() => shuffleArray(src).join(','));
  assert.ok(new Set(same).size > 1, '多次洗牌至少产生两种顺序');
});

test('formatTimeSec 常规格式', () => {
  assert.equal(formatTimeSec(0), '00:00');
  assert.equal(formatTimeSec(65), '01:05');
  assert.equal(formatTimeSec(600), '10:00');
  assert.equal(formatTimeSec(3599), '59:59');
});

test('formatTimeSec 非法输入兜底为 0', () => {
  assert.equal(formatTimeSec(-5), '00:00');
  assert.equal(formatTimeSec(NaN), '00:00');
});

test('isBetterResult 按分数优先', () => {
  assert.equal(isBetterResult({ score: 9, timeSec: 100, errors: 2 }, { score: 8, timeSec: 10, errors: 0 }), true);
  assert.equal(isBetterResult({ score: 8, timeSec: 10, errors: 0 }, { score: 9, timeSec: 100, errors: 2 }), false);
});

test('isBetterResult 分数相同比用时', () => {
  assert.equal(isBetterResult({ score: 10, timeSec: 50, errors: 3 }, { score: 10, timeSec: 60, errors: 0 }), true);
  assert.equal(isBetterResult({ score: 10, timeSec: 60, errors: 0 }, { score: 10, timeSec: 50, errors: 3 }), false);
});

test('isBetterResult 分数用时相同比失误', () => {
  assert.equal(isBetterResult({ score: 10, timeSec: 50, errors: 1 }, { score: 10, timeSec: 50, errors: 2 }), true);
  assert.equal(isBetterResult({ score: 10, timeSec: 50, errors: 2 }, { score: 10, timeSec: 50, errors: 1 }), false);
  assert.equal(isBetterResult({ score: 10, timeSec: 50, errors: 2 }, { score: 10, timeSec: 50, errors: 2 }), false, '完全相同不算更好');
});

test('isBetterResult 空值处理', () => {
  assert.equal(isBetterResult({ score: 1, timeSec: 1, errors: 1 }, null), true);
  assert.equal(isBetterResult(null, { score: 1, timeSec: 1, errors: 1 }), false);
});

test('quantizeGeo 截断坐标精度', () => {
  const geo = { type: 'Polygon', coordinates: [[[1.234567, 2.345678], [3.456789, 4.56789]]] };
  const q = quantizeGeo(geo, 2);
  assert.deepEqual(q.coordinates, [[[1.23, 2.35], [3.46, 4.57]]]);
  assert.deepEqual(geo.coordinates[0][0], [1.234567, 2.345678], '原对象不被修改');
});

test('quantizeGeo 支持 MultiPolygon', () => {
  const q = quantizeGeo({ type: 'MultiPolygon', coordinates: [[[[1.111, 2.222]]]] }, 1);
  assert.equal(q.type, 'MultiPolygon');
  assert.deepEqual(q.coordinates, [[[[1.1, 2.2]]]]);
});
