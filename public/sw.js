if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise(async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()})),s.then(()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]})},s=(s,r)=>{Promise.all(s.map(e)).then(e=>r(1===e.length?e[0]:e))},r={require:Promise.resolve(s)};self.define=(s,a,i)=>{r[s]||(r[s]=Promise.resolve().then(()=>{let r={};const c={uri:location.origin+s.slice(1)};return Promise.all(a.map(s=>{switch(s){case"exports":return r;case"module":return c;default:return e(s)}})).then(e=>{const s=i(...e);return r.default||(r.default=s),r})}))}}define("./sw.js",["./workbox-7858865e"],(function(e){"use strict";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([{url:"App.test.tsx",revision:"6949ee46f7a3ece29f8e4ae57d1df008"},{url:"App.tsx",revision:"f5a7ce47389f28e408f720c9e3404dd2"},{url:"components/CategoryOptions.tsx",revision:"e130ee4f79d91333543a73fda6373a3a"},{url:"components/PWACard.tsx",revision:"4bb0d2a6dfc0e3983b030ed725571e9f"},{url:"data/AppContext.tsx",revision:"704a29c56e563bda32091ad99c3c568b"},{url:"data/combineReducers.ts",revision:"daadca3006fa82e3f3c30028f4db705f"},{url:"data/connect.tsx",revision:"0a8176359932fbf10b869e953a55014a"},{url:"data/dataApi.ts",revision:"3e6d5458f4cff5cc63cfb1c454ae6436"},{url:"data/env.ts",revision:"7753c1fc0144061efa03a047c6b4e0d7"},{url:"data/state.ts",revision:"ac3b8b749db318e51f81a00bc504c635"},{url:"data/user/user.actions.ts",revision:"039f6563bb90119e684db502430a6912"},{url:"data/user/user.reducer.ts",revision:"30617f535f0ca463de9feb7411f67905"},{url:"data/user/user.state.ts",revision:"68ef169843134505eee4e4a1d3b3a00e"},{url:"index.tsx",revision:"c9c4703789a049ba38167e6cf2ae9a43"},{url:"pages/LogIn.tsx",revision:"3fe959bb9b0fd2aeb81310234d4e0603"},{url:"pages/main.css",revision:"6212ec01e8e495c597e0697ee58d547e"},{url:"pages/MyPWA.tsx",revision:"ef75ce30f252b408d0f8cccf894718a9"},{url:"pages/Profile.tsx",revision:"ff66a7b87bda078ab548c6784e66967d"},{url:"pages/PWA.tsx",revision:"8a89532cf7d88403ea17638d622adc3d"},{url:"pages/PWAs.tsx",revision:"7079fd651e9837c20e7b6520435826f7"},{url:"pages/SignUp.tsx",revision:"9d23065c4679c58af7f60c3c0b3cacee"},{url:"pages/Tab2.css",revision:"1a7dfbe6b990d63eb277a09ecae73151"},{url:"pages/Tab2.tsx",revision:"26db4cd74b592fdc056c6d479a6f04a1"},{url:"react-app-env.d.ts",revision:"3b12a2a445e35988cd2eb9f73d12c500"},{url:"serviceWorker.ts",revision:"e10374828fa9c2f33d7fb0bc7c1e117f"},{url:"setupTests.ts",revision:"dea886be67ea6fa5cee27dba16786b90"},{url:"theme/variables.css",revision:"adfa7b27fe39570f3cd72b28bcdbc994"},{url:"util/types.ts",revision:"6cbd65393ded4f933f220420df92c36c"},{url:"util/utils.ts",revision:"67eccfdc7178a714df7ec58b2ddb0dfd"}],{})}));
//# sourceMappingURL=sw.js.map
