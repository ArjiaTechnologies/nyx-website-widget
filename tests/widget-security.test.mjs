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
  assert.match(source, /Blocked prompt contents are not stored/)
})

test("security counter is a fixed header control with a glowing X", () => {
  assert.match(source, /<header class="nx-head">[\s\S]*<div class="nx-actions"><button class="nx-security"[\s\S]*<span class="nx-security-mark" aria-hidden="true">X<\/span>[\s\S]*<button class="nx-close"/)
  assert.match(source, /\.nx-security-mark\{[^}]*text-shadow:/)
  assert.doesNotMatch(source, /😛|nx-security-emoji/)
  assert.doesNotMatch(source, /<div class="nx-status-strip"[^>]*>[\s\S]*?<button class="nx-security"/)
})

test("long message bubbles use natural height and safe wrapping", () => {
  assert.match(source, /\.nx-thread p\{[^}]*height:auto[^}]*overflow-wrap:anywhere[^}]*word-break:normal/)
  assert.match(source, /\.nx-thread article\.user p\{[^}]*height:auto[^}]*max-width:82%[^}]*border-radius:18px 18px 6px 18px/)
  assert.doesNotMatch(source, /\.nx-thread article\.user p\{[^}]*border-radius:999px/)
})

test("mobile and reduced-motion protections are retained", () => {
  assert.match(source, /@media\(max-width:600px\)/)
  assert.match(source, /\.nx-head-slot\{width:98px\}/)
  assert.match(source, /\.nx-impact\[data-compact="true"\]\{flex-basis:98px;width:98px;padding-inline:5px;gap:3px\}/)
  assert.match(source, /prefersReducedMotion/)
  assert.match(source, /@media\(prefers-reduced-motion:reduce\)/)
})

test("chat logging is disclosed and requires versioned affirmative consent", () => {
  assert.match(source, /Before you chat/)
  assert.match(source, /stores your messages, its replies, and your IP address in protected local storage/)
  assert.match(source, /30 days/)
  assert.match(source, /Allow and chat/)
  assert.match(source, /https:\/\/arjia\.tech\/legal-pages\/privacy-policy/)
  assert.match(source, /logging_consent:true/)
  assert.match(source, /consent_version:conversationConsentVersion/)
  assert.match(source, /conversation_id:conversationId/)
  assert.match(source, /turn_id:uuid\(\)/)
  assert.match(source, /visitor_session_id:visitorSessionId/)
})

test("consent and conversation identifiers last only for the current browser tab", () => {
  assert.match(source, /sessionStorage\.setItem\(conversationConsentStorageKey/)
  assert.match(source, /sessionStorage\.setItem\(key,created\)/)
  assert.match(source, /arjia\.nyx\.conversationLoggingConsent\.v1/)
  assert.match(source, /arjia\.nyx\.conversationId\.v1/)
  assert.match(source, /arjia\.nyx\.visitorSessionId\.v1/)
  assert.doesNotMatch(source, /ip_address|client_ip|cf-connecting-ip/i)
})

test("the updated copy distinguishes stored chats from blocked injection bodies", () => {
  assert.match(source, /Blocked prompt contents are not stored/)
  assert.match(source, /Chats stored 30 days/)
  assert.doesNotMatch(source, />Session only</)
})
