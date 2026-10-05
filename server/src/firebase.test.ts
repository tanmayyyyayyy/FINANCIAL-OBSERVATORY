/**
 * Unit tests for normalizePrivateKey()
 *
 * Uses only synthetic placeholder strings — no real credentials.
 * Run with: node --experimental-strip-types src/firebase.test.ts
 * Or via tsx: npx tsx src/firebase.test.ts
 */

import { normalizePrivateKey } from "./firebase.js";

interface TestResult {
  name: string;
  passed: boolean;
  detail?: string;
}

const results: TestResult[] = [];

function test(name: string, actual: string, expected: string) {
  const passed = actual === expected;
  results.push({ name, passed, detail: passed ? undefined : `\n  expected: ${JSON.stringify(expected)}\n  got:      ${JSON.stringify(actual)}` });
  console.log(`${passed ? "✅" : "❌"} ${name}`);
  if (!passed) console.log(`   ${results[results.length - 1].detail ?? ""}`);
}

// ── Test 1: literal \n sequences are converted to real newlines ─────────────
test(
  'literal \\\\n → real newlines',
  normalizePrivateKey("-----BEGIN PRIVATE KEY-----\\nABC\\n-----END PRIVATE KEY-----"),
  "-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----"
);

// ── Test 2: already-real newlines are preserved unchanged ───────────────────
test(
  'real newlines preserved',
  normalizePrivateKey("-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----"),
  "-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----"
);

// ── Test 3: surrounding double-quotes are stripped ──────────────────────────
test(
  'surrounding double-quotes stripped',
  normalizePrivateKey('"-----BEGIN PRIVATE KEY-----\\nABC\\n-----END PRIVATE KEY-----"'),
  "-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----"
);

// ── Test 4: surrounding single-quotes are stripped ──────────────────────────
test(
  "surrounding single-quotes stripped",
  normalizePrivateKey("'-----BEGIN PRIVATE KEY-----\\nABC\\n-----END PRIVATE KEY-----'"),
  "-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----"
);

// ── Test 5: Windows CRLF is normalised to LF ───────────────────────────────
test(
  'CRLF normalised to LF',
  normalizePrivateKey("-----BEGIN PRIVATE KEY-----\r\nABC\r\n-----END PRIVATE KEY-----"),
  "-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----"
);

// ── Test 6: leading/trailing whitespace is trimmed ─────────────────────────
test(
  'leading/trailing whitespace trimmed',
  normalizePrivateKey("  -----BEGIN PRIVATE KEY-----\\nABC\\n-----END PRIVATE KEY-----  "),
  "-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----"
);

// ── Test 7: combined — quoted + literal \n + CRLF (worst-case Render value) ─
test(
  'combined: quotes + literal \\\\n + CRLF',
  normalizePrivateKey('"-----BEGIN PRIVATE KEY-----\\nABC\\r\\n-----END PRIVATE KEY-----"'),
  "-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----"
);

// ── Test 8: key with no newlines at all stays unchanged (no mangling) ───────
test(
  'key with no newlines unchanged',
  normalizePrivateKey("PLAINTEXT"),
  "PLAINTEXT"
);

// ── Summary ─────────────────────────────────────────────────────────────────
const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;
console.log(`\n── ${passed} passed, ${failed} failed ──`);
if (failed > 0) process.exit(1);
