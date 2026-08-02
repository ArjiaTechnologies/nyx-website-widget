(() => {
  if (window.__ARJIA_NYX_WIDGET__) return
  window.__ARJIA_NYX_WIDGET__ = true

  const mobileViewportQuery = window.matchMedia?.("(max-width: 600px)")
  if (mobileViewportQuery?.matches) {
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (viewportMeta) {
      const directives = viewportMeta.content.split(",").map(value => value.trim()).filter(Boolean)
      if (!directives.some(value => value.toLowerCase().startsWith("initial-scale="))) directives.push("initial-scale=1")
      if (!directives.some(value => value.toLowerCase().startsWith("viewport-fit="))) directives.push("viewport-fit=cover")
      viewportMeta.content = directives.join(", ")
    }
  }

  const script = document.currentScript
  const config = window.NYX_CONFIG || {}
  // Keep the original outer thinking glow available as an opt-in reference.
  // Use "legacy" to restore it, false to remove it, or omit the setting for the tighter glow.
  const thinkingGlowMode = config.thinkingGlow === true || config.thinkingGlow === "legacy" ? "legacy" : config.thinkingGlow === false ? "off" : "tight"
  const thinkingGlow = thinkingGlowMode === "legacy"
    ? { inset: "-18px", padding: "18px", blur: "12px", opacity: ".36" }
    : thinkingGlowMode === "off"
      ? { inset: "-6px", padding: "6px", blur: "4px", opacity: "0" }
      : { inset: "-6px", padding: "6px", blur: "4px", opacity: ".14" }
  const base = String(config.apiBaseUrl || script?.dataset.apiBase || "").trim().replace(/\/+$/, "")
  const root = document.createElement("div")
  root.id = "arjia-nyx-widget"
  root.innerHTML = `
    <style>
      @property --nx-angle{syntax:"<angle>";inherits:false;initial-value:0deg}
      @property --nx-thinking-angle-a{syntax:"<angle>";inherits:false;initial-value:18deg}
      @property --nx-thinking-angle-b{syntax:"<angle>";inherits:false;initial-value:142deg}
      @keyframes nx-ring{to{--nx-angle:360deg}}
      @keyframes nx-thinking-ring-a{to{--nx-thinking-angle-a:378deg}}
      @keyframes nx-thinking-ring-b{to{--nx-thinking-angle-b:-218deg}}
      #arjia-nyx-widget,#arjia-nyx-widget *{box-sizing:border-box}
      #arjia-nyx-widget{--nx-right:24px;--nx-bottom:24px;--nx-thinking-glow-inset:${thinkingGlow.inset};--nx-thinking-glow-padding:${thinkingGlow.padding};--nx-thinking-glow-blur:${thinkingGlow.blur};--nx-thinking-glow-opacity:${thinkingGlow.opacity};position:fixed;z-index:2147482000;color:#f7f8fb;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-text-size-adjust:100%;text-size-adjust:100%}
      #arjia-nyx-widget button,#arjia-nyx-widget textarea{font:inherit}
      .nx-shell{position:fixed;right:var(--nx-right);bottom:var(--nx-bottom);width:108px;height:38px;border-radius:24px;isolation:isolate;filter:drop-shadow(0 18px 34px #0006);backdrop-filter:blur(34px) saturate(175%) contrast(1.1);-webkit-backdrop-filter:blur(34px) saturate(175%) contrast(1.1);transition:width .72s cubic-bezier(.76,0,.16,1),height .86s cubic-bezier(.76,0,.16,1)}
      .nx-shell:before{content:"";position:absolute;z-index:-2;inset:-1px;padding:1px;border-radius:inherit;background:conic-gradient(from var(--nx-angle),#2edbff,#4df08f,#ff8fa3,#ff334d,#ff8fa3,#9e66ff,#2edbff);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:nx-ring 5.2s linear infinite;animation-play-state:paused;opacity:0;transition:opacity .28s ease;pointer-events:none}
      .nx-shell[data-phase="closed"]:hover:before,.nx-shell[data-phase="closed"]:focus-within:before{opacity:.9;animation-play-state:running}
      .nx-glass{position:absolute;inset:0;overflow:hidden;border-radius:inherit;background:linear-gradient(142deg,#ffffff18,#ffffff05 44%,#05081212),rgba(8,12,18,.14);box-shadow:inset 0 1px #ffffff2e,inset 0 0 0 1px #dfe4ec38,inset 0 -1px #0003,0 26px 70px #0007;backdrop-filter:blur(34px) saturate(175%) contrast(1.1);-webkit-backdrop-filter:blur(34px) saturate(175%) contrast(1.1)}
      .nx-glass:after{content:"";position:absolute;inset:0;background:linear-gradient(112deg,#ffffff16,transparent 22% 68%,#ffffff0c);mix-blend-mode:screen}
      .nx-shell[data-phase="widening"],.nx-shell[data-phase="opening"],.nx-shell[data-phase="open"],.nx-shell[data-phase="closingHeight"]{width:min(426px,calc(100vw - 32px))}
      .nx-shell[data-phase="widening"],.nx-shell[data-phase="closingHeight"],.nx-shell[data-phase="closingWidth"]{height:38px}
      .nx-shell[data-phase="closingWidth"]{width:108px}
      .nx-shell[data-phase="opening"],.nx-shell[data-phase="open"]{height:min(588px,calc(100dvh - 32px))}
      .nx-launcher{position:absolute;z-index:7;inset:0;width:100%;padding:0;border:0;border-radius:inherit;background:transparent;cursor:pointer}
      .nx-launcher:focus-visible{outline:2px solid white;outline-offset:5px}
      .nx-shell:not([data-phase="closed"]) .nx-launcher{pointer-events:none}
      .nx-brand{position:absolute;z-index:6;left:50%;top:11.5px;transform:translateX(-50%);text-align:center;pointer-events:none;transition:top .86s cubic-bezier(.76,0,.16,1)}
      .nx-brand strong{display:block;font-size:15px;font-weight:780;letter-spacing:.015em;line-height:1;text-shadow:0 1px 12px #000}
      .nx-brand small{display:flex;align-items:center;justify-content:center;gap:6px;max-width:0;height:0;margin:0;overflow:hidden;color:#ffffff73;font-size:7px;font-weight:760;letter-spacing:.11em;line-height:1;text-transform:uppercase;white-space:nowrap;opacity:0;transform:translateY(-3px);transition:opacity .3s ease,transform .3s ease,max-width .3s ease,height .3s ease,margin .3s ease}
      .nx-shell[data-phase="opening"] .nx-brand,.nx-shell[data-phase="open"] .nx-brand{top:15px}
      .nx-shell[data-phase="opening"] .nx-brand small,.nx-shell[data-phase="open"] .nx-brand small{max-width:190px;height:7px;margin-top:6px;opacity:1;transform:none}
      .nx-dot{width:5px;height:5px;border-radius:50%;background:#82efad;box-shadow:0 0 8px #82efad}
      .nx-edge-dot{position:absolute;z-index:6;right:11px;top:50%;margin-top:-2.5px;transition:opacity .28s ease,background .24s,box-shadow .24s}
      .nx-shell[data-status="connecting"] .nx-dot{background:#f4d77b;box-shadow:0 0 8px #f4d77b}.nx-shell[data-status="offline"] .nx-dot{background:#ff746e;box-shadow:0 0 8px #ff746e}.nx-shell[data-status="preview"] .nx-dot{background:#a5a9b4;box-shadow:0 0 7px #a5a9b477}
      .nx-shell[data-phase="opening"] .nx-edge-dot,.nx-shell[data-phase="open"] .nx-edge-dot,.nx-shell[data-phase="closingHeight"] .nx-edge-dot{opacity:0}
      .nx-panel{position:absolute;z-index:3;inset:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;border-radius:inherit;visibility:hidden;opacity:0;filter:blur(8px);transform:translateY(18px);pointer-events:none;transition:opacity .34s ease,filter .34s ease,transform .34s cubic-bezier(.22,1,.36,1),visibility 0s linear .34s}
      .nx-shell[data-phase="opening"] .nx-panel,.nx-shell[data-phase="open"] .nx-panel,.nx-shell[data-phase="closingHeight"] .nx-panel{visibility:visible;transition-delay:0s}
      .nx-shell[data-phase="opening"] .nx-panel,.nx-shell[data-phase="open"] .nx-panel{opacity:1;filter:none;transform:none}.nx-shell[data-phase="open"] .nx-panel{pointer-events:auto}
      .nx-head{display:flex;align-items:center;justify-content:space-between;min-height:58px;padding:13px 15px 10px 17px;border-bottom:1px solid #ffffff16}.nx-head-slot{display:flex;align-items:center;width:175px;height:30px}.nx-actions{display:flex}.nx-actions button{position:relative;display:grid;place-items:center;width:28px;height:28px;padding:0;border:1px solid #ffffff1c;border-radius:50%;color:#ffffffbd;background:#ffffff0e;cursor:pointer}.nx-close:before,.nx-close:after{content:"";position:absolute;left:50%;top:50%;width:10px;height:1.5px;border-radius:999px;background:currentColor;transform-origin:center}.nx-close:before{transform:translate(-50%,-50%) rotate(45deg)}.nx-close:after{transform:translate(-50%,-50%) rotate(-45deg)}
      .nx-feed{position:relative;min-height:0;padding:18px 15px 16px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#ffffff24 transparent;mask-image:linear-gradient(to bottom,transparent,#000 18px,#000 calc(100% - 24px),transparent)}
      .nx-welcome{display:grid;align-content:start;min-height:100%;gap:16px;padding:12px 4px 4px}.nx-welcome[hidden],.nx-intro[hidden]{display:none!important}.nx-intro{display:grid;max-height:180px;overflow:hidden;transform-origin:left center;transition:max-height .42s cubic-bezier(.76,0,.16,1) .48s,opacity .3s ease .5s,filter .3s ease .5s}.nx-intro[data-exiting="true"]{max-height:0;opacity:0;filter:blur(8px)}.nx-intro h2{max-width:310px;margin:0 0 7px;font-size:27px;line-height:1.05;letter-spacing:-.045em}.nx-intro p{max-width:340px;margin:0;color:#ffffff86;font-size:11px;line-height:1.54}.nx-intro-word{display:inline-block;white-space:nowrap}.nx-intro-char{display:inline-block;will-change:opacity,filter,transform}.nx-intro[data-exiting="true"] .nx-intro-char{animation:nx-intro-char-out .38s cubic-bezier(.22,1,.36,1) forwards;animation-delay:calc(var(--nx-char) * 4ms)}
      @keyframes nx-intro-char-out{0%{opacity:1;filter:blur(0);transform:translate3d(0,0,0)}100%{opacity:0;filter:blur(7px);transform:translate3d(0,-5px,0) scale(.96)}}
      .nx-impact{position:relative;isolation:isolate;display:grid;grid-template-columns:auto 1fr 1px 1fr auto;align-items:center;gap:10px;width:min(100%,340px);min-height:58px;padding:9px 12px;border:1px solid #7bc8ff87;border-radius:999px;background:linear-gradient(115deg,#75caff14,#4d89ff0b 46%,#81d9ff10),#07101a52;box-shadow:inset 0 1px #ffffff29,inset 0 0 0 1px #66baff19,0 0 18px #278dff25,0 0 42px #3d96ff12;overflow:hidden;color:#f8fbff;cursor:help;outline:0;transform-origin:center top;transition:width .58s cubic-bezier(.22,1,.36,1),min-height .58s cubic-bezier(.22,1,.36,1),padding .58s cubic-bezier(.22,1,.36,1),gap .58s cubic-bezier(.22,1,.36,1),box-shadow .4s ease}
      .nx-impact:before{content:"";position:absolute;z-index:-1;inset:-65% -18%;background:radial-gradient(circle at 35% 55%,#5fc7ff30,transparent 36%),radial-gradient(circle at 76% 35%,#628dff24,transparent 34%);filter:blur(13px);animation:nx-impact-breathe 3.8s ease-in-out infinite alternate;pointer-events:none}.nx-impact:after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 18px #63c7ff17;pointer-events:none}
      @keyframes nx-impact-breathe{from{opacity:.55;transform:translate3d(-2%,1%,0) scale(.96)}to{opacity:1;transform:translate3d(3%,-2%,0) scale(1.06)}}
      .nx-impact-live{display:grid;justify-items:center;gap:3px;color:#91d6ff;font-size:6px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}.nx-impact-live i{width:6px;height:6px;border-radius:50%;background:#70cdff;box-shadow:0 0 4px #70cdff,0 0 11px #38a7ff}
      .nx-impact-metric{display:grid;gap:2px;min-width:0}.nx-impact-metric strong{font-size:13px;font-weight:720;letter-spacing:-.025em;line-height:1;white-space:nowrap}.nx-impact-metric small{color:#ffffff5b;font-size:6px;font-weight:760;letter-spacing:.095em;line-height:1;text-transform:uppercase;white-space:nowrap}.nx-impact-divider{width:1px;height:24px;background:#ffffff1c}.nx-impact-state{max-width:50px;color:#8fd2ff8f;font-size:5.5px;font-weight:780;letter-spacing:.09em;line-height:1.25;text-align:right;text-transform:uppercase}
      .nx-impact[data-compact="true"]{grid-template-columns:auto auto 1px auto;width:134px;min-height:28px;margin:0;padding:5px 6px;gap:4px;box-shadow:inset 0 1px #ffffff24,inset 0 0 0 1px #66baff15,0 0 13px #278dff20}.nx-impact[data-compact="true"] .nx-impact-live{display:flex;gap:0;font-size:0}.nx-impact[data-compact="true"] .nx-impact-live i{width:5px;height:5px}.nx-impact[data-compact="true"] .nx-impact-metric{display:flex;align-items:baseline;gap:2px}.nx-impact[data-compact="true"] .nx-impact-metric strong{font-size:7.5px}.nx-impact[data-compact="true"] .nx-impact-metric small{display:none}.nx-impact[data-compact="true"] .nx-impact-divider{height:12px}.nx-impact[data-compact="true"] .nx-impact-state{display:none}
      .nx-impact-detail{--nx-impact-detail-width:306px;--nx-impact-detail-height:232px;position:absolute;z-index:15;left:var(--nx-impact-detail-left,17px);top:var(--nx-impact-detail-top,80px);isolation:isolate;width:0;height:32px;padding:0;border:1px solid #79caff70;border-radius:18px;overflow:hidden;color:#f7faff;background:transparent;box-shadow:inset 0 1px #ffffff2b,inset 0 0 0 1px #70bfff13,0 18px 45px #0007,0 0 25px #358cff18;opacity:0;visibility:hidden;pointer-events:none;transform-origin:left top;transition:width .36s cubic-bezier(.76,0,.16,1),height .42s cubic-bezier(.76,0,.16,1),opacity .24s ease,visibility 0s linear .78s}
      .nx-impact-detail-glass{position:absolute;z-index:0;inset:0;border-radius:inherit;background:linear-gradient(145deg,#d9eeff18,#6489c90d 52%,#05081057),rgba(8,12,18,.84);backdrop-filter:blur(52px) saturate(150%) contrast(.94);-webkit-backdrop-filter:blur(52px) saturate(150%) contrast(.94);clip-path:inset(0 round 18px);-webkit-clip-path:inset(0 round 18px);transform:translateZ(0);pointer-events:none}
      .nx-impact-detail:before{content:"";position:absolute;z-index:1;inset:-40% -15%;background:radial-gradient(circle at 18% 30%,#5bc8ff24,transparent 36%),radial-gradient(circle at 86% 85%,#7476ff1c,transparent 38%);filter:blur(14px);pointer-events:none}
      .nx-impact-detail[data-phase="widening"],.nx-impact-detail[data-phase="opening"],.nx-impact-detail[data-phase="open"],.nx-impact-detail[data-phase="closingHeight"]{width:var(--nx-impact-detail-width);visibility:visible;opacity:1;transition-delay:0s}
      .nx-impact-detail[data-phase="widening"],.nx-impact-detail[data-phase="closingHeight"],.nx-impact-detail[data-phase="closingWidth"]{height:32px}
      .nx-impact-detail[data-phase="closingWidth"]{width:0;visibility:visible;opacity:0;transition-delay:0s}
      .nx-impact-detail[data-phase="opening"],.nx-impact-detail[data-phase="open"]{height:var(--nx-impact-detail-height);pointer-events:auto}
      .nx-impact-detail-copy{position:relative;z-index:2;display:grid;align-content:start;gap:6px;width:var(--nx-impact-detail-width);padding:14px 16px;opacity:0;filter:blur(5px);transform:translateY(8px);transition:opacity .24s ease,filter .24s ease,transform .3s cubic-bezier(.22,1,.36,1)}.nx-impact-detail[data-phase="opening"] .nx-impact-detail-copy,.nx-impact-detail[data-phase="open"] .nx-impact-detail-copy{opacity:1;filter:none;transform:none;transition-delay:.12s}.nx-impact-detail-copy strong{font-size:13px;font-weight:760;letter-spacing:-.01em}.nx-impact-detail-copy p{margin:0;color:#ffffffa3;font-size:9.5px;line-height:1.48}.nx-impact-detail-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;margin:2px 0;padding:7px 0;border-top:1px solid #ffffff12;border-bottom:1px solid #ffffff12;font-size:7.5px;line-height:1.3}.nx-impact-detail-grid span{color:#ffffff70;text-transform:uppercase;letter-spacing:.07em}.nx-impact-detail-grid b{min-width:0;color:#d8eaff;font-weight:680;text-align:right}.nx-impact-detail-copy small{color:#8fd5ffad;font-size:6.5px;font-weight:760;letter-spacing:.09em;text-transform:uppercase}.nx-impact-detail-roadmap{color:#ffffff62!important}
      .nx-impact-detail-note{color:#ffffff72!important;font-size:6.25px!important;line-height:1.35;letter-spacing:.045em!important;text-transform:none!important}.nx-impact-detail-link{width:max-content;color:#9edaff;font-size:6.5px;font-weight:760;letter-spacing:.065em;text-decoration:none;text-transform:uppercase}.nx-impact-detail-link:hover,.nx-impact-detail-link:focus-visible{color:#fff;text-decoration:underline;text-underline-offset:2px}.nx-impact-detail-roadmap{color:#ffffff62!important}
      .nx-thread{display:grid;gap:14px}.nx-welcome[hidden]+.nx-thread{min-height:100%;align-content:end}.nx-thread article{display:flex;flex-direction:column;align-items:flex-start}.nx-thread article.user{align-items:flex-end}.nx-thread label{margin:0 6px 5px;color:#ffffff9e;font-size:12px;font-weight:700}.nx-thread p{max-width:360px;margin:0;padding:9px 14px;border:1px solid #ffffff1f;border-radius:18px;color:#ffffffdd;background:#ffffff09;font-size:13px;line-height:1.42;white-space:pre-wrap}.nx-thread p a{color:#c7d8ff;text-decoration-color:#9eaeff8c;text-underline-offset:2px}.nx-thread p a:hover{color:#fff;text-decoration-color:#fff}.nx-thread article.user p{max-width:82%;border-radius:999px;background:#7a8cae20}
      .nx-activity{position:relative;isolation:isolate;overflow:visible;width:max-content;padding:8px 14px;border:0;border-radius:999px;background:transparent;box-shadow:inset 0 0 0 1px #ffffff2b,inset 0 1px #ffffff1f,0 5px 16px #0005;color:#f4f5f7;font-size:13px;line-height:1.42;white-space:nowrap;backdrop-filter:blur(16px) saturate(145%);-webkit-backdrop-filter:blur(16px) saturate(145%);transition:width .14s ease-in-out}
      .nx-activity>span{position:relative;z-index:1}
      .nx-activity:before,.nx-activity:after{content:"";position:absolute;border-radius:inherit;pointer-events:none}
      .nx-activity:before{z-index:0;inset:-1px;padding:1.5px;background:conic-gradient(from var(--nx-thinking-angle-a),#2edbfffa 0%,#4df08ff5 16%,#ff8fa3f5 34%,#ff334df0 50%,#ff8fa3f5 66%,#9e66fffa 84%,#2edbfffa 100%);filter:saturate(1.02);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:nx-thinking-ring-a 6.8s linear infinite}
      .nx-activity:after{z-index:-1;inset:var(--nx-thinking-glow-inset);padding:var(--nx-thinking-glow-padding);background:conic-gradient(from var(--nx-thinking-angle-b),#2edbffbf 0%,#4df08fb8 16%,#ff8fa3b8 34%,#ff334db8 50%,#ff8fa3b8 66%,#9e66ffbf 84%,#2edbffbf 100%);filter:blur(var(--nx-thinking-glow-blur)) saturate(1.04);opacity:var(--nx-thinking-glow-opacity);transform:translateZ(0);will-change:filter,transform,opacity;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:nx-thinking-ring-b 9.4s linear infinite}
      .nx-thinking-dots{display:inline}
      .nx-foot{padding:9px 13px 11px;border-top:1px solid #ffffff14;background:#05080e2e}.nx-composer{position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(0,1fr) 28px;align-items:center;gap:5px;padding:3px;border:1px solid #dfe4ec26;border-radius:24px;background:#ffffff05;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);transition:border-color .70s ease-in-out,box-shadow .70s ease-in-out}.nx-composer:before,.nx-composer:after{content:"";position:absolute;z-index:-1;inset:-1.5px;padding:1.5px;border-radius:inherit;background:conic-gradient(from var(--nx-angle),#2edbff,#4df08f,#ff8fa3,#ff334d,#ff8fa3,#9e66ff,#2edbff);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;pointer-events:none;animation:nx-ring 5.2s linear infinite;animation-play-state:paused;transition:opacity .70s ease-in-out}.nx-composer:after{inset:-6px;padding:4px;filter:blur(8px);opacity:0}.nx-composer[data-active="true"]{border-color:transparent;box-shadow:0 0 22px #788dff20;transition-duration:.55s}.nx-composer[data-active="true"]:before{opacity:1;animation-play-state:running;transition-duration:.55s}.nx-composer[data-active="true"]:after{opacity:.2;animation-play-state:running;transition-duration:.55s}.nx-composer textarea{display:block;width:100%;min-height:28px;max-height:88px;padding:6px 8px 0;resize:none;transform:translateY(2px);border:0;outline:0;color:#f5f6f9;background:transparent;font-size:13px;line-height:22px}.nx-composer textarea::placeholder{color:#ffffff57}.nx-composer button{align-self:center;justify-self:center;display:grid;place-items:center;width:24px;height:24px;padding:0;border:1px solid #ffffff1f;border-radius:50%;color:#fff;background:#ffffff12;cursor:pointer}.nx-composer button:disabled{opacity:.4}.nx-fine{display:flex;justify-content:space-between;margin:7px 3px 0;color:#ffffff45;font-size:6px;font-weight:760;letter-spacing:.09em;text-transform:uppercase}
      @media(max-width:600px){
        #arjia-nyx-widget{--nx-right:12px;--nx-bottom:max(12px,env(safe-area-inset-bottom));--nx-vv-left:0px;--nx-vv-top:0px;--nx-vv-width:100vw;--nx-vv-height:100dvh}
        .nx-glass{background:linear-gradient(142deg,#ffffff14,#ffffff04 44%,#0508121f),rgba(7,10,16,.32)}
        .nx-shell[data-phase="widening"],.nx-shell[data-phase="opening"],.nx-shell[data-phase="open"],.nx-shell[data-phase="closingHeight"]{width:calc(100vw - 24px)}
        .nx-shell[data-phase="opening"],.nx-shell[data-phase="open"]{height:min(620px,calc(100dvh - 24px))}
        .nx-actions button{width:40px;height:40px}
        .nx-composer textarea{font-size:17px!important;line-height:22px;-webkit-appearance:none;appearance:none;touch-action:manipulation}
        .nx-shell[data-keyboard="true"]{left:calc(var(--nx-vv-left) + 8px);top:calc(var(--nx-vv-top) + 8px);right:auto;bottom:auto;width:calc(var(--nx-vv-width) - 16px);height:calc(var(--nx-vv-height) - 16px);max-height:none;transition:width .22s ease,height .22s ease,top .22s ease,left .22s ease}
        .nx-shell[data-keyboard="true"] .nx-head{min-height:48px;padding:8px 10px 6px 13px}
        .nx-shell[data-keyboard="true"] .nx-brand{top:10px}
        .nx-shell[data-keyboard="true"] .nx-brand small{margin-top:5px}
        .nx-shell[data-keyboard="true"] .nx-feed{padding:10px 12px 8px;mask-image:linear-gradient(to bottom,transparent,#000 10px,#000 calc(100% - 14px),transparent)}
        .nx-shell[data-keyboard="true"] .nx-welcome{display:none}
        .nx-shell[data-keyboard="true"] .nx-thread{min-height:100%;align-content:end}
        .nx-shell[data-keyboard="true"] .nx-impact{display:none}
        .nx-shell[data-keyboard="true"] .nx-foot{padding:6px 8px 7px}
        .nx-shell[data-keyboard="true"] .nx-fine{display:none}
      }
      @supports not ((backdrop-filter:blur(2px)) or (-webkit-backdrop-filter:blur(2px))){.nx-glass{background:#111722e8}}
      @media(prefers-reduced-motion:reduce){#arjia-nyx-widget *,#arjia-nyx-widget *:before,#arjia-nyx-widget *:after{animation-duration:.001ms!important;transition-duration:.001ms!important}}
    </style>
    <section class="nx-shell" data-phase="closed" data-status="${base ? "connecting" : "preview"}" aria-label="Chat with Nyx">
      <span class="nx-glass"></span>
      <button class="nx-launcher" aria-label="Open Nyx"></button>
      <div class="nx-brand"><strong>Nyx</strong><small><i class="nx-dot"></i><span class="nx-status-copy">Preview</span></small></div>
      <i class="nx-dot nx-edge-dot"></i>
      <div class="nx-panel" aria-hidden="true">
        <header class="nx-head"><span class="nx-head-slot"></span><div class="nx-actions"><button class="nx-close" aria-label="Close Nyx"></button></div></header>
        <aside id="nx-impact-detail" class="nx-impact-detail" data-phase="closed" aria-hidden="true"><span class="nx-impact-detail-glass" aria-hidden="true"></span><div class="nx-impact-detail-copy"><strong>Nyx impact</strong><p>Live totals cover completed website responses. Electricity is a CPU-package estimate from a recycled Surface Pro 7—not whole-device wall power.</p><div class="nx-impact-detail-grid"><span>All visitors</span><b class="nx-impact-detail-total">Awaiting global total</b><span>Google reference</span><b>0.24 Wh · 0.03 g CO₂e</b><span>Nyx vs cloud</span><b class="nx-impact-detail-baseline">Matched test pending</b></div><small class="nx-impact-detail-note">Median Gemini text prompt, May 2025 · full-stack context only, not a savings claim</small><a class="nx-impact-detail-link" href="https://services.google.com/fh/files/misc/measuring_the_environmental_impact_of_delivering_ai_at_google_scale.pdf" target="_blank" rel="noopener noreferrer">Google methodology ↗</a><small class="nx-impact-detail-state">Starts with your first response</small><small class="nx-impact-detail-roadmap">Woodstock · EPA SRSO · wall meter next · solar planned, not active</small></div></aside>
        <main class="nx-feed" aria-live="polite"><section class="nx-welcome"><section class="nx-intro"><h2>Ask me anything about Arjia.</h2><p>I can connect the dots across Arjia, ARES, CLU, Nyx, services, and project fit. Just type naturally.</p></section><aside class="nx-impact" data-state="pending" data-compact="false" tabindex="0" aria-label="Nyx electricity and emissions estimate" aria-describedby="nx-impact-detail"><span class="nx-impact-live"><i></i><span>Live</span></span><span class="nx-impact-metric"><strong class="nx-impact-electricity">— Wh</strong><small>Electricity</small></span><i class="nx-impact-divider"></i><span class="nx-impact-metric"><strong class="nx-impact-emissions">— g CO₂e</strong><small>Emissions</small></span><span class="nx-impact-state">Meter connection pending</span></aside></section><div class="nx-thread"></div></main>
        <footer class="nx-foot"><form class="nx-composer"><textarea rows="1" maxlength="900" placeholder="${base ? "Connecting to Nyx" : "Connect to Nyx"}" aria-label="Ask Nyx anything" disabled></textarea><button type="submit" aria-label="Send message" disabled>↗</button></form><div class="nx-fine"><span>Nyx runs on a recycled Surface Pro 7</span><span>Session only</span></div></footer>
      </div>
    </section>`

  document.body.appendChild(root)
  const $ = selector => root.querySelector(selector)
  const shell = $(".nx-shell"), panel = $(".nx-panel"), feed = $(".nx-feed"), thread = $(".nx-thread"), welcome = $(".nx-welcome"), intro = $(".nx-intro"), headSlot = $(".nx-head-slot"), impact = $(".nx-impact"), impactDetail = $(".nx-impact-detail")
  const textarea = $("textarea"), composer = $(".nx-composer"), sendButton = $(".nx-composer button"), statusCopy = $(".nx-status-copy")
  const impactElectricity = $(".nx-impact-electricity"), impactEmissions = $(".nx-impact-emissions"), impactState = $(".nx-impact-state"), impactDetailState = $(".nx-impact-detail-state"), impactDetailTotal = $(".nx-impact-detail-total")
  let mobileViewportMaxHeight = window.visualViewport?.height || window.innerHeight
  let mobileComposerFocused = false
  let phase = "closed", timers = [], status = base ? "connecting" : "preview", busy = false, controller = null, typingGlowTimer = null, thinkingGlowFrame = null, thinkingGlowTick = 0, thinkingSourceTick = 0, thinkingDotPhase = -1, healthFailures = 0, healthInFlight = false, impactCompact = false, impactAnimation = null, impactValues = null, impactResponseValues = {electricityWh:0,emissionsG:0}, impactMethod = "pending", impactScope = "session", impactCompletedResponses = 0, impactEstimatedResponses = 0, impactMovingUntil = 0, impactDetailPhase = "closed", impactDetailTimers = [], impactDetailCloseTimer = null, introExiting = false, introDismissed = false, introExitTimer = null
  const messages = []
  const lockMobileComposerScale = () => {
    if (mobileViewportQuery?.matches) textarea.style.setProperty("font-size","17px","important")
  }
  lockMobileComposerScale()
  const clearTimers = () => { timers.forEach(clearTimeout); timers = [] }
  const setPhase = value => { phase = value; shell.dataset.phase = value; panel.setAttribute("aria-hidden", String(!["opening","open","closingHeight"].includes(value))) }
  const syncMobileViewport = () => {
    if (!mobileViewportQuery?.matches) {
      shell.dataset.keyboard = "false"
      return
    }
    const viewport = window.visualViewport
    const width = Math.max(1,viewport?.width || window.innerWidth)
    const height = Math.max(1,viewport?.height || window.innerHeight)
    const left = Math.max(0,viewport?.offsetLeft || 0)
    const top = Math.max(0,viewport?.offsetTop || 0)
    if (!mobileComposerFocused) mobileViewportMaxHeight = Math.max(mobileViewportMaxHeight,height)
    const keyboardOpen = mobileComposerFocused && height < mobileViewportMaxHeight - 80
    root.style.setProperty("--nx-vv-left",`${left}px`)
    root.style.setProperty("--nx-vv-top",`${top}px`)
    root.style.setProperty("--nx-vv-width",`${width}px`)
    root.style.setProperty("--nx-vv-height",`${height}px`)
    shell.dataset.keyboard = String(keyboardOpen)
    if (keyboardOpen) requestAnimationFrame(()=>feed.scrollTo({top:feed.scrollHeight,behavior:"auto"}))
  }
  const setStatus = value => {
    status = value; shell.dataset.status = value
    statusCopy.textContent = value === "online" ? "Online" : value === "offline" ? "Unavailable" : value === "connecting" ? "Connecting" : "Preview"
    textarea.disabled = value !== "online"; sendButton.disabled = value !== "online" || !textarea.value.trim()
    textarea.placeholder = value === "online" ? "Ask Nyx anything" : value === "offline" ? "Nyx is temporarily unavailable" : value === "connecting" ? "Connecting to Nyx" : "Connect to Nyx"
  }
  const open = () => {
    if (!["closed","closingHeight","closingWidth"].includes(phase)) return
    clearTimers(); setPhase("widening")
    timers.push(setTimeout(() => setPhase("opening"),720))
    timers.push(setTimeout(() => { setPhase("open");if(!mobileViewportQuery?.matches)textarea.focus();syncMobileViewport() },1580))
  }
  const close = () => {
    if (["closed","closingHeight","closingWidth"].includes(phase)) return
    if (mobileComposerFocused) textarea.blur()
    syncMobileViewport()
    closeImpactDetail(true);clearTimers();setPhase("closingHeight")
    timers.push(setTimeout(() => setPhase("closingWidth"),860))
    timers.push(setTimeout(() => setPhase("closed"),1580))
  }
  const clearImpactDetailTimers = () => { impactDetailTimers.forEach(clearTimeout);impactDetailTimers=[] }
  const setImpactDetailPhase = value => {
    impactDetailPhase=value;impactDetail.dataset.phase=value;impactDetail.setAttribute("aria-hidden",String(value === "closed"))
  }
  const positionImpactDetail = () => {
    if (!["opening","open"].includes(phase)) return
    const panelRect=panel.getBoundingClientRect(),impactRect=impact.getBoundingClientRect()
    const width=Math.min(306,Math.max(238,panelRect.width - 32))
    const left=Math.min(Math.max(16,impactRect.left - panelRect.left),Math.max(16,panelRect.width - width - 16))
    const detailHeight=232
    const desiredTop=impactRect.bottom - panelRect.top + 8
    const top=Math.min(desiredTop,panelRect.height - detailHeight - 20)
    impactDetail.style.setProperty("--nx-impact-detail-width",`${width}px`)
    impactDetail.style.setProperty("--nx-impact-detail-left",`${left}px`)
    impactDetail.style.setProperty("--nx-impact-detail-top",`${Math.max(62,top)}px`)
  }
  const openImpactDetail = () => {
    if (!["opening","open"].includes(phase)) return
    if (impactDetailCloseTimer !== null) { clearTimeout(impactDetailCloseTimer);impactDetailCloseTimer=null }
    if (["widening","opening","open"].includes(impactDetailPhase)) return
    clearImpactDetailTimers();positionImpactDetail()
    if (impactDetailPhase === "closingHeight") {
      setImpactDetailPhase("opening")
      impactDetailTimers.push(setTimeout(() => setImpactDetailPhase("open"),420))
      return
    }
    setImpactDetailPhase("widening")
    impactDetailTimers.push(setTimeout(() => setImpactDetailPhase("opening"),360))
    impactDetailTimers.push(setTimeout(() => setImpactDetailPhase("open"),780))
  }
  const closeImpactDetail = immediate => {
    if (impactDetailCloseTimer !== null) { clearTimeout(impactDetailCloseTimer);impactDetailCloseTimer=null }
    if (immediate) { clearImpactDetailTimers();setImpactDetailPhase("closed");return }
    if (["closed","closingHeight","closingWidth"].includes(impactDetailPhase)) return
    clearImpactDetailTimers()
    if (impactDetailPhase === "widening") {
      setImpactDetailPhase("closingWidth")
      impactDetailTimers.push(setTimeout(() => setImpactDetailPhase("closed"),360))
      return
    }
    setImpactDetailPhase("closingHeight")
    impactDetailTimers.push(setTimeout(() => setImpactDetailPhase("closingWidth"),420))
    impactDetailTimers.push(setTimeout(() => setImpactDetailPhase("closed"),780))
  }
  const scheduleImpactDetailClose = () => {
    if (["closed","closingHeight","closingWidth"].includes(impactDetailPhase)) return
    if (impactDetailCloseTimer !== null) clearTimeout(impactDetailCloseTimer)
    impactDetailCloseTimer=setTimeout(()=>{impactDetailCloseTimer=null;closeImpactDetail(false)},110)
  }
  const escape = text => String(text).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))
  const dismissIntro = () => {
    if (introExiting || introDismissed) return
    introExiting=true
    let characterIndex=0
    intro.querySelectorAll("h2,p").forEach(element=>{
      const label=element.textContent || ""
      element.setAttribute("aria-label",label)
      element.innerHTML=label.split(/(\s+)/).filter(Boolean).map(token=>{
        if (/^\s+$/.test(token)) return Array.from(token).map(()=>`<span class="nx-intro-char" aria-hidden="true" style="--nx-char:${characterIndex++}">&nbsp;</span>`).join("")
        return `<span class="nx-intro-word" aria-hidden="true">${Array.from(token).map(char=>`<span class="nx-intro-char" style="--nx-char:${characterIndex++}">${escape(char)}</span>`).join("")}</span>`
      }).join("")
    })
    intro.dataset.exiting="true"
    if (introExitTimer !== null) clearTimeout(introExitTimer)
    const exitDuration=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 20 : Math.min(980,430 + characterIndex * 4)
    introExitTimer=setTimeout(()=>{
      introExitTimer=null;introExiting=false;introDismissed=true;intro.hidden=true;welcome.hidden=true;render()
    },exitDuration)
  }
  const formatAssistantText = text => escape(String(text)
    .replace(/\s*\((?:(?:PRIMARY|SUPPORT)\s+)?\[?[a-z0-9-]+:\d+:\d+\]?(?:\s*,\s*\[?[a-z0-9-]+:\d+:\d+\]?)*\)/gi,"")
    .replace(/\s*(?:(?:PRIMARY|SUPPORT)\s+)?\[[a-z0-9-]+:\d+:\d+\]/gi,"")
    .replace(/`([^`\s]+@[^`\s]+)`/g,"$1")
    .replace(/\[\s*\]/g,"")
    .replace(/\s+([.,!?;:])/g,"$1"))
    .replace(/\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/gi,`<a href="mailto:$1">$1</a>`)
    .replace(/https:\/\/github\.com\/ArjiaTechnologies\/ares-engine\b/gi,`<a href="https://github.com/ArjiaTechnologies/ares-engine" target="_blank" rel="noopener noreferrer">github.com/ArjiaTechnologies/ares-engine</a>`)
    .replace(/https:\/\/github\.com\/ArjiaTechnologies\/clu-governance\b/gi,`<a href="https://github.com/ArjiaTechnologies/clu-governance" target="_blank" rel="noopener noreferrer">github.com/ArjiaTechnologies/clu-governance</a>`)
    .replace(/https:\/\/x\.com\/ISOArjia\b/gi,`<a href="https://x.com/ISOArjia" target="_blank" rel="noopener noreferrer">x.com/ISOArjia</a>`)
    .replace(/@ISOArjia\b/gi,`<a href="https://x.com/ISOArjia" target="_blank" rel="noopener noreferrer">@ISOArjia</a>`)
  const routeQuestion = () => ({
    interaction_version:"nyx-interaction-envelope-v1",
    interaction_action:"ask",
    public_scope:"arjia",
  })
  const impactStorageKey = "arjia.nyx.impact.v2"
  const loadStoredImpact = () => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(impactStorageKey) || "null")
      const electricityWh = Number(stored?.electricityWh)
      const emissionsG = Number(stored?.emissionsG)
      if (!Number.isFinite(electricityWh) || !Number.isFinite(emissionsG) || electricityWh < 0 || emissionsG < 0) return null
      return {
        values:{electricityWh,emissionsG,measured:stored?.measured === true},
        method:typeof stored?.method === "string" ? stored.method : "estimated",
        scope:stored?.scope === "global" ? "global" : "session",
        completedResponses:Number.isInteger(stored?.completedResponses) && stored.completedResponses >= 0 ? stored.completedResponses : 0,
        estimatedResponses:Number.isInteger(stored?.estimatedResponses) && stored.estimatedResponses >= 0 ? stored.estimatedResponses : 0,
      }
    } catch { return null }
  }
  const storeImpact = () => {
    if (!impactValues) return
    try {
      sessionStorage.setItem(impactStorageKey,JSON.stringify({
        electricityWh:impactValues.electricityWh,
        emissionsG:impactValues.emissionsG,
        measured:impactValues.measured === true,
        method:impactMethod,
        scope:impactScope,
        completedResponses:impactCompletedResponses,
        estimatedResponses:impactEstimatedResponses,
      }))
    } catch {}
  }
  const formatImpact = (value,digits=3) => Number.isFinite(value) ? value.toFixed(digits) : "—"
  const updateImpact = (values=impactValues,state,method=impactMethod,scope=impactScope) => {
    if (values) impactValues = values
    if (method) impactMethod = method
    if (scope) impactScope = scope
    if (values) storeImpact()
    impactElectricity.textContent = `${formatImpact(impactValues?.electricityWh)} Wh`
    impactEmissions.textContent = `${formatImpact(impactValues?.emissionsG)} g CO₂e`
    impact.dataset.state = state === "measuring" ? "measuring" : impactValues ? (impactValues.measured ? "measured" : "estimated") : (state || "pending")
    impact.setAttribute("aria-label",impactScope === "global" ? "All-user Nyx electricity and emissions estimate" : "Current-tab Nyx electricity and emissions estimate")
    impactState.textContent = state === "measuring"
      ? "Measuring local response"
      : impactValues
        ? impactValues.measured
          ? "Meter live"
          : impactMethod === "estimated_cpu_package"
            ? impactScope === "global" ? "All-user CPU estimate" : "This-tab CPU estimate"
            : "Estimated locally"
        : "Meter connection pending"
    impactDetailTotal.textContent = impactScope === "global"
      ? `${impactCompletedResponses} completed · ${impactEstimatedResponses} estimated`
      : impactValues
        ? "This tab · global total syncing"
        : "Awaiting global total"
    impactDetailState.textContent = state === "measuring"
      ? "Measuring current response"
      : impactValues
        ? impactValues.measured
          ? impactScope === "global" ? "Wall meter · all visitors" : "Wall meter · this tab"
          : impactMethod === "estimated_cpu_package"
            ? impactScope === "global" ? "CPU estimate · all visitors since launch" : "CPU-package estimate · this tab"
            : impactScope === "global" ? "Local estimate · all visitors" : "Local estimate · this tab"
        : "Starts with your first response"
  }
  const consumeGlobalImpact = data => {
    if (!data || typeof data !== "object") return false
    const electricityWh = Number(data.global_electricity_wh)
    const emissionsG = Number(data.global_emissions_g_co2e)
    const completedResponses = Number(data.global_completed_responses)
    const estimatedResponses = Number(data.global_estimated_responses)
    if (!Number.isFinite(electricityWh) || !Number.isFinite(emissionsG) || electricityWh < 0 || emissionsG < 0) return false
    if (!Number.isInteger(completedResponses) || !Number.isInteger(estimatedResponses) || completedResponses < 0 || estimatedResponses < 0 || estimatedResponses > completedResponses) return false
    impactCompletedResponses = completedResponses
    impactEstimatedResponses = estimatedResponses
    const measured = data.measured === true || data.measurement_kind === "measured_wall"
    const method = typeof data.measurement_kind === "string" ? data.measurement_kind : measured ? "measured_wall" : "estimated"
    updateImpact({electricityWh,emissionsG,measured},undefined,method,"global")
    return true
  }
  const consumeImpact = data => {
    if (!data || typeof data !== "object") return
    if (consumeGlobalImpact(data)) return
    const sessionElectricityWh = Number(data.session_electricity_wh)
    const sessionEmissionsG = Number(data.session_emissions_g_co2e)
    const responseElectricityWh = Number(data.response_electricity_wh)
    const responseEmissionsG = Number(data.response_emissions_g_co2e)
    const legacyElectricityWh = Number(data.electricity_wh)
    const legacyEmissionsG = Number(data.emissions_g_co2e)
    const validPair = (electricityWh,emissionsG) => Number.isFinite(electricityWh) && Number.isFinite(emissionsG) && electricityWh >= 0 && emissionsG >= 0
    const measured = data.measured === true || data.measurement_kind === "measured_wall"
    const method = typeof data.measurement_kind === "string" ? data.measurement_kind : measured ? "measured_wall" : "estimated"
    if (validPair(sessionElectricityWh,sessionEmissionsG)) {
      updateImpact({electricityWh:sessionElectricityWh,emissionsG:sessionEmissionsG,measured},undefined,method,"session")
      return
    }
    if (validPair(responseElectricityWh,responseEmissionsG)) {
      const electricityDelta = Math.max(0,responseElectricityWh - impactResponseValues.electricityWh)
      const emissionsDelta = Math.max(0,responseEmissionsG - impactResponseValues.emissionsG)
      impactResponseValues = {electricityWh:responseElectricityWh,emissionsG:responseEmissionsG}
      updateImpact({
        electricityWh:(impactValues?.electricityWh || 0) + electricityDelta,
        emissionsG:(impactValues?.emissionsG || 0) + emissionsDelta,
        measured,
      },undefined,method,"session")
      return
    }
    if (validPair(legacyElectricityWh,legacyEmissionsG)) {
      updateImpact({electricityWh:legacyElectricityWh,emissionsG:legacyEmissionsG,measured},undefined,method,"session")
    }
  }
  let impactRefreshInFlight = false
  const refreshGlobalImpact = async () => {
    if (!base || impactRefreshInFlight || document.hidden) return
    impactRefreshInFlight = true
    try {
      const response = await fetch(`${base}/v1/impact`,{headers:{Accept:"application/json"},cache:"no-store",credentials:"omit"})
      if (!response.ok) return
      consumeGlobalImpact(await response.json())
    } catch {} finally { impactRefreshInFlight = false }
  }
  const setImpactCompact = compact => {
    if (impactCompact === compact) return
    closeImpactDetail(true)
    const from = impact.getBoundingClientRect()
    impactCompact = compact
    impactMovingUntil = Date.now() + 760
    impact.style.transition = "none"
    impact.dataset.compact = String(compact)
    if (compact) {
      headSlot.appendChild(impact)
      welcome.hidden = introDismissed
    } else {
      welcome.hidden = false
      welcome.prepend(impact)
    }
    intro.hidden = introDismissed
    requestAnimationFrame(() => {
      const to = impact.getBoundingClientRect()
      const dx = from.left - to.left, dy = from.top - to.top
      const sx = to.width ? from.width / to.width : 1, sy = to.height ? from.height / to.height : 1
      impactAnimation?.cancel()
      impactAnimation = impact.animate([
        {transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`,opacity:.92},
        {transform:"translate(0,0) scale(1,1)",opacity:1},
      ],{duration:720,easing:"cubic-bezier(.22,1,.36,1)"})
      impactAnimation.addEventListener("finish",()=>{impact.style.removeProperty("transition");impactAnimation=null;positionImpactDetail()},{once:true})
    })
  }
  const shortSourceTopics = refs => {
    const names = {
      faq:"Arjia FAQ",services:"services",nyx:"Nyx website",company:"Arjia overview",
      contact:"contact routes",pricing:"public pricing",clu:"CLU","ares-engine":"ARES",
      "capability-boundaries":"capability limits",
    }
    return [...new Set(refs.map(ref => {
      const stem=String(ref?.id || "").split(":",1)[0].toLowerCase()
      const fallback=String(ref?.label || stem || "approved sources").split(" - ",1)[0].trim()
      return names[stem] || fallback.slice(0,26) || "approved sources"
    }))].slice(0,3)
  }
  const resizeThinkingBubble = (bubble,mutate) => {
    const previousWidth=bubble.getBoundingClientRect().width
    mutate();bubble.style.width="max-content"
    const nextWidth=bubble.getBoundingClientRect().width
    bubble.style.width=`${previousWidth}px`;bubble.getBoundingClientRect();bubble.style.width=`${nextWidth}px`
  }
  const animateThinkingGlow = now => {
    const bubble = thread.querySelector(".nx-activity")
    if (!bubble) { thinkingGlowFrame = null; thinkingGlowTick = 0; thinkingSourceTick = 0; thinkingDotPhase = -1; return }
    if (now - thinkingGlowTick >= 1000 / 30) {
      const t = now / 1000
      const nextDotPhase = Math.floor(Date.now() / 320) % 3
      if (nextDotPhase !== thinkingDotPhase) {
        const dots = bubble.querySelector(".nx-thinking-dots")
        resizeThinkingBubble(bubble,()=>{dots.textContent = ".".repeat(nextDotPhase + 1)})
        thinkingDotPhase = nextDotPhase
      }
      const liveMessage=messages.findLast(message=>message.role === "assistant" && message.live && !message.text)
      if (liveMessage?.sourceTopics?.length > 1 && now - thinkingSourceTick >= 920) {
        liveMessage.sourceIndex=((liveMessage.sourceIndex || 0) + 1) % liveMessage.sourceTopics.length
        const label=bubble.querySelector(".nx-thinking-text")
        resizeThinkingBubble(bubble,()=>{label.textContent=`Checking ${liveMessage.sourceTopics[liveMessage.sourceIndex]}`})
        thinkingSourceTick=now
      }
      bubble.style.setProperty("--nx-thinking-center-x",`${50 + Math.sin(t * .22) * 3.5}%`)
      bubble.style.setProperty("--nx-thinking-center-y",`${155 + Math.cos(t * .17) * 10}%`)
      bubble.style.setProperty("--nx-thinking-stop-a",`${16 + Math.sin(t * .19) * 2.5}%`)
      bubble.style.setProperty("--nx-thinking-stop-b",`${34 + Math.cos(t * .17) * 2}%`)
      bubble.style.setProperty("--nx-thinking-stop-c",`${50 + Math.sin((t * .23) + 1.2) * 2.5}%`)
      bubble.style.setProperty("--nx-thinking-stop-d",`${66 + Math.cos((t * .21) + .6) * 2}%`)
      bubble.style.setProperty("--nx-thinking-stop-e",`${84 + Math.sin((t * .18) + 2.1) * 2.5}%`)
      thinkingGlowTick = now
    }
    thinkingGlowFrame = requestAnimationFrame(animateThinkingGlow)
  }
  const render = () => {
    intro.hidden = introDismissed
    welcome.hidden = impactCompact && introDismissed
    thread.innerHTML = messages.map(message => `<article class="${message.role}"><label>${message.role === "assistant" ? "Nyx" : "You"}</label>${message.live && !message.text ? `<div class="nx-activity"><span class="nx-thinking-text">${escape(message.sourceTopics?.length ? `Checking ${message.sourceTopics[message.sourceIndex || 0]}` : "Finding sources")}</span><span class="nx-thinking-dots" aria-hidden="true">.</span></div>` : `<p>${message.role === "assistant" ? formatAssistantText(message.text) : escape(message.text)}</p>`}</article>`).join("")
    if (thread.querySelector(".nx-activity")) {
      thinkingDotPhase = -1
      if (thinkingGlowFrame === null) thinkingGlowFrame = requestAnimationFrame(animateThinkingGlow)
    }
    requestAnimationFrame(() => feed.scrollTo({top:introExiting || Date.now() < impactMovingUntil ? 0 : feed.scrollHeight,behavior:"auto"}))
  }
  const ask = async question => {
    if (!base || busy || status !== "online") return
    const routed = routeQuestion(question)
    const assistant = {role:"assistant",text:"",live:true,refs:[],sourceTopics:[],sourceIndex:0}
    if (!messages.length) { setImpactCompact(true);dismissIntro() }
    impactResponseValues = {electricityWh:0,emissionsG:0}
    messages.push({role:"user",text:question},assistant); busy = true; updateImpact(impactValues,"measuring"); render(); controller?.abort(); controller = new AbortController()
    try {
      const response = await fetch(`${base}/v1/chat`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"text/event-stream"},body:JSON.stringify({message:question,...routed,history:messages.filter(item=>item.text).slice(-9,-1).map(item=>({role:item.role,content:item.text.slice(0,1400)}))}),signal:controller.signal})
      if (!response.ok || !response.body) throw new Error("offline")
      const reader=response.body.getReader(),decoder=new TextDecoder();let buffer=""
      const consume=block=>{let event="",raw="";block.split("\n").forEach(line=>{if(line.startsWith("event:"))event=line.slice(6).trim();if(line.startsWith("data:"))raw+=line.slice(5).trimStart()});let data;try{data=JSON.parse(raw)}catch{return}if(event==="token"&&typeof data?.text==="string"){assistant.text+=data.text;render()}if(event==="citations"&&Array.isArray(data)){assistant.refs=data.filter(item=>typeof item?.id==="string");assistant.sourceTopics=shortSourceTopics(assistant.refs);assistant.sourceIndex=0;thinkingSourceTick=performance.now();render()}if(event==="impact")consumeImpact(data);if(event==="error")throw new Error(data?.message||"offline")}
      while(true){const chunk=await reader.read();buffer+=decoder.decode(chunk.value||new Uint8Array(),{stream:!chunk.done}).replace(/\r\n/g,"\n");let boundary;while((boundary=buffer.indexOf("\n\n"))>=0){consume(buffer.slice(0,boundary));buffer=buffer.slice(boundary+2)}if(chunk.done)break}if(buffer.trim())consume(buffer)
      assistant.live=false;render()
    } catch(error) {
      if(error.name!=="AbortError"){setStatus("offline");assistant.live=false;assistant.text=assistant.text||"I can’t reach the local Nyx edge right now. Your message was not sent to a hosted model.";render()}
    } finally { busy=false;controller=null;if(!impactValues)updateImpact(null,"pending");refreshGlobalImpact() }
  }
  $(".nx-launcher").addEventListener("click",open);$(".nx-close").addEventListener("click",close)
  impact.addEventListener("mouseenter",openImpactDetail)
  impact.addEventListener("mouseleave",scheduleImpactDetailClose)
  impact.addEventListener("focus",openImpactDetail)
  impact.addEventListener("blur",scheduleImpactDetailClose)
  impactDetail.addEventListener("mouseenter",openImpactDetail)
  impactDetail.addEventListener("mouseleave",scheduleImpactDetailClose)
  window.addEventListener("resize",positionImpactDetail)
  window.visualViewport?.addEventListener("resize",syncMobileViewport)
  window.visualViewport?.addEventListener("scroll",syncMobileViewport)
  window.addEventListener("orientationchange",()=>setTimeout(syncMobileViewport,120))
  const setComposerGlow = active => { composer.dataset.active = String(active) }
  const stopComposerGlow = () => { if(typingGlowTimer!==null)clearTimeout(typingGlowTimer);typingGlowTimer=null;setComposerGlow(false) }
  const pulseComposerGlow = () => { if(typingGlowTimer!==null)clearTimeout(typingGlowTimer);setComposerGlow(true);typingGlowTimer=setTimeout(()=>{typingGlowTimer=null;setComposerGlow(false)},400) }
  const syncComposer = ({typing=false}={}) => { if(typing)pulseComposerGlow();sendButton.disabled=busy||status!=="online"||!textarea.value.trim() }
  composer.addEventListener("submit",event=>{event.preventDefault();const question=textarea.value.trim();if(!question)return;textarea.value="";syncComposer();ask(question)})
  textarea.addEventListener("input",()=>syncComposer({typing:true}))
  textarea.addEventListener("pointerdown",lockMobileComposerScale,{passive:true})
  textarea.addEventListener("touchstart",lockMobileComposerScale,{passive:true})
  textarea.addEventListener("focus",()=>{lockMobileComposerScale();mobileComposerFocused=true;syncMobileViewport();setTimeout(syncMobileViewport,80);setTimeout(syncMobileViewport,260)})
  textarea.addEventListener("blur",()=>{mobileComposerFocused=false;setTimeout(syncMobileViewport,80)})
  textarea.addEventListener("keydown",event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();$(".nx-composer").requestSubmit()}})
  document.addEventListener("keydown",event=>{if(event.key==="Escape")close()})
  const probe = async path => { const aborter=new AbortController(),timeout=setTimeout(()=>aborter.abort(),3500);try{return (await fetch(`${base}${path}`,{cache:"no-store",signal:aborter.signal})).ok}catch{return false}finally{clearTimeout(timeout)}}
  const health = async () => {
    if(!base||healthInFlight)return
    healthInFlight=true
    try {
      if(await probe("/ready")){healthFailures=0;setStatus("online");return}
      if(await probe("/health")){healthFailures=0;setStatus("connecting");return}
      healthFailures+=1
      if(healthFailures>=3)setStatus("offline")
    } finally { healthInFlight=false }
  }
  const storedImpact = loadStoredImpact()
  if (storedImpact) {
    impactValues = storedImpact.values
    impactMethod = storedImpact.method
    impactScope = storedImpact.scope
    impactCompletedResponses = storedImpact.completedResponses
    impactEstimatedResponses = storedImpact.estimatedResponses
  }
  syncMobileViewport();updateImpact();syncComposer();setStatus(status);health();refreshGlobalImpact();if(base){setInterval(health,12000);setInterval(refreshGlobalImpact,15000)}
})()
