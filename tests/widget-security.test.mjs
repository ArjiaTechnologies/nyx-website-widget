import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const source = await readFile(new URL("../nyx-widget.js", import.meta.url), "utf8")

test("uses the server security event as the authoritative counter signal", () => {
  assert.match(source, /event==="security"/)
  assert.match(source, /data\?\.kind==="prompt_injection_blocked"/)
  assert.match(source, /data\?\.blocked===true/)
  assert.match(source, /data\?\.countable===true/)
  assert.match(source, /securityCounted=false/)
  assert.match(source, /!securityCounted/)
})

test("stores only a session count and exposes no client injection detector", () => {
  assert.match(source, /sessionStorage\.setItem\(blockedInjectionStorageKey,String\(blockedInjectionCount\)\)/)
  assert.match(source, /arjia\.nyx\.blockedPromptInjections\.v1/)
  assert.doesNotMatch(source, /localStorage\.setItem\(blockedInjectionStorageKey/)
  assert.doesNotMatch(source, /function\s+detectPromptInjection|const\s+detectPromptInjection/)
})

test("counter copy, singular and plural wording, and accessibility are present", () => {
  assert.match(source, /blockedInjectionCount === 1 \? "attempt" : "attempts"/)
  assert.match(source, /Blocked prompt-injection attempts:/)
  assert.match(source, /aria-controls="nx-security-detail"/)
  assert.match(source, /aria-expanded="false"/)
  assert.match(source, /No prompt contents are stored/)
})

test("long message bubbles use natural height and safe wrapping", () => {
  assert.match(source, /\.nx-thread p\{[^}]*height:auto[^}]*overflow-wrap:anywhere[^}]*word-break:normal/)
  assert.match(source, /\.nx-thread article\.user p\{[^}]*height:auto[^}]*max-width:82%[^}]*border-radius:18px 18px 6px 18px/)
  assert.doesNotMatch(source, /\.nx-thread article\.user p\{[^}]*border-radius:999px/)
})

test("mobile and reduced-motion protections are retained", () => {
  assert.match(source, /@media\(max-width:600px\)/)
  assert.match(source, /\.nx-head-slot\{width:108px\}/)
  assert.match(source, /prefersReducedMotion/)
  assert.match(source, /@media\(prefers-reduced-motion:reduce\)/)
})
