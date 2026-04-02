(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{3837:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return r(7595)}])},972:function(e,t,r){"use strict";r.d(t,{t:function(){return m},x:function(){return h}});let n=e=>{let t;let r=new Set,n=(e,n)=>{let o="function"==typeof e?e(t):e;if(!Object.is(o,t)){let e=t;t=(null!=n?n:"object"!=typeof o||null===o)?o:Object.assign({},t,o),r.forEach(r=>r(t,e))}},o=()=>t,i={setState:n,getState:o,getInitialState:()=>a,subscribe:e=>(r.add(e),()=>r.delete(e)),destroy:()=>{console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),r.clear()}},a=t=e(n,o,i);return i},o=e=>e?n(e):n;var i=r(7294),a=r(2798);let{useDebugValue:s}=i,{useSyncExternalStoreWithSelector:l}=a,u=!1,c=e=>e,d=e=>{"function"!=typeof e&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");let t="function"==typeof e?o(e):e,r=(e,r)=>(function(e,t=c,r){r&&!u&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),u=!0);let n=l(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,r);return s(n),n})(t,e,r);return Object.assign(r,t),r},f=e=>e?d(e):d;var p=r(1955);let m=f(e=>({user:null,token:null,setAuth:(t,r)=>{p.Z.set("user",JSON.stringify(t)),p.Z.set("token",r),e({user:t,token:r})},logout:()=>{p.Z.remove("user"),p.Z.remove("token"),e({user:null,token:null})},restoreAuth:()=>{let t=p.Z.get("user"),r=p.Z.get("token");t&&r&&e({user:JSON.parse(t),token:r})}})),h=f((e,t)=>({items:[],addItem:r=>{let n=t().items;n.find(e=>e.product._id===r._id)?e({items:n.map(e=>e.product._id===r._id?{...e,quantity:e.quantity+1}:e)}):e({items:[...n,{product:r,quantity:1}]})},removeItem:r=>{e({items:t().items.filter(e=>e.product._id!==r)})},updateQuantity:(r,n)=>{if(n<=0){t().removeItem(r);return}e({items:t().items.map(e=>e.product._id===r?{...e,quantity:n}:e)})},clearCart:()=>{e({items:[]})},getTotalPrice:()=>t().items.reduce((e,t)=>e+t.product.price*(1-(t.product.discount||0)/100)*t.quantity,0),getTotalItems:()=>t().items.reduce((e,t)=>e+t.quantity,0)}))},8199:function(e,t){"use strict";var r,n,o,i;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ACTION_FAST_REFRESH:function(){return d},ACTION_NAVIGATE:function(){return s},ACTION_PREFETCH:function(){return c},ACTION_REFRESH:function(){return a},ACTION_RESTORE:function(){return l},ACTION_SERVER_ACTION:function(){return f},ACTION_SERVER_PATCH:function(){return u},PrefetchCacheEntryStatus:function(){return n},PrefetchKind:function(){return r},isThenable:function(){return p}});let a="refresh",s="navigate",l="restore",u="server-patch",c="prefetch",d="fast-refresh",f="server-action";function p(e){return e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}(o=r||(r={})).AUTO="auto",o.FULL="full",o.TEMPORARY="temporary",(i=n||(n={})).fresh="fresh",i.reusable="reusable",i.expired="expired",i.stale="stale",("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7195:function(e,t,r){"use strict";function n(e,t,r,n){return!1}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getDomainLocale",{enumerable:!0,get:function(){return n}}),r(8337),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8342:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return x}});let n=r(8754),o=r(5893),i=n._(r(7294)),a=r(6075),s=r(3955),l=r(8041),u=r(9903),c=r(5490),d=r(1928),f=r(257),p=r(4229),m=r(7195),h=r(9470),y=r(8199),b=new Set;function g(e,t,r,n,o,i){if(i||(0,s.isLocalURL)(t)){if(!n.bypassPrefetchedCheck){let o=t+"%"+r+"%"+(void 0!==n.locale?n.locale:"locale"in e?e.locale:void 0);if(b.has(o))return;b.add(o)}(async()=>i?e.prefetch(t,o):e.prefetch(t,r,n))().catch(e=>{})}}function v(e){return"string"==typeof e?e:(0,l.formatUrl)(e)}let x=i.default.forwardRef(function(e,t){let r,n;let{href:l,as:b,children:x,prefetch:E=null,passHref:w,replace:j,shallow:C,scroll:_,locale:O,onClick:k,onMouseEnter:S,onTouchStart:N,legacyBehavior:I=!1,...P}=e;r=x,I&&("string"==typeof r||"number"==typeof r)&&(r=(0,o.jsx)("a",{children:r}));let T=i.default.useContext(d.RouterContext),A=i.default.useContext(f.AppRouterContext),R=null!=T?T:A,D=!T,M=!1!==E,L=null===E?y.PrefetchKind.AUTO:y.PrefetchKind.FULL,{href:U,as:$}=i.default.useMemo(()=>{if(!T){let e=v(l);return{href:e,as:b?v(b):e}}let[e,t]=(0,a.resolveHref)(T,l,!0);return{href:e,as:b?(0,a.resolveHref)(T,b):t||e}},[T,l,b]),F=i.default.useRef(U),z=i.default.useRef($);I&&(n=i.default.Children.only(r));let H=I?n&&"object"==typeof n&&n.ref:t,[q,Z,V]=(0,p.useIntersection)({rootMargin:"200px"}),K=i.default.useCallback(e=>{(z.current!==$||F.current!==U)&&(V(),z.current=$,F.current=U),q(e),H&&("function"==typeof H?H(e):"object"==typeof H&&(H.current=e))},[$,H,U,V,q]);i.default.useEffect(()=>{R&&Z&&M&&g(R,U,$,{locale:O},{kind:L},D)},[$,U,Z,O,M,null==T?void 0:T.locale,R,D,L]);let B={ref:K,onClick(e){I||"function"!=typeof k||k(e),I&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(e),R&&!e.defaultPrevented&&function(e,t,r,n,o,a,l,u,c){let{nodeName:d}=e.currentTarget;if("A"===d.toUpperCase()&&(function(e){let t=e.currentTarget.getAttribute("target");return t&&"_self"!==t||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!c&&!(0,s.isLocalURL)(r)))return;e.preventDefault();let f=()=>{let e=null==l||l;"beforePopState"in t?t[o?"replace":"push"](r,n,{shallow:a,locale:u,scroll:e}):t[o?"replace":"push"](n||r,{scroll:e})};c?i.default.startTransition(f):f()}(e,R,U,$,j,C,_,O,D)},onMouseEnter(e){I||"function"!=typeof S||S(e),I&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),R&&(M||!D)&&g(R,U,$,{locale:O,priority:!0,bypassPrefetchedCheck:!0},{kind:L},D)},onTouchStart:function(e){I||"function"!=typeof N||N(e),I&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),R&&(M||!D)&&g(R,U,$,{locale:O,priority:!0,bypassPrefetchedCheck:!0},{kind:L},D)}};if((0,u.isAbsoluteUrl)($))B.href=$;else if(!I||w||"a"===n.type&&!("href"in n.props)){let e=void 0!==O?O:null==T?void 0:T.locale,t=(null==T?void 0:T.isLocaleDomain)&&(0,m.getDomainLocale)($,e,null==T?void 0:T.locales,null==T?void 0:T.domainLocales);B.href=t||(0,h.addBasePath)((0,c.addLocale)($,e,null==T?void 0:T.defaultLocale))}return I?i.default.cloneElement(n,B):(0,o.jsx)("a",{...P,...B,children:r})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4229:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useIntersection",{enumerable:!0,get:function(){return l}});let n=r(7294),o=r(4474),i="function"==typeof IntersectionObserver,a=new Map,s=[];function l(e){let{rootRef:t,rootMargin:r,disabled:l}=e,u=l||!i,[c,d]=(0,n.useState)(!1),f=(0,n.useRef)(null),p=(0,n.useCallback)(e=>{f.current=e},[]);return(0,n.useEffect)(()=>{if(i){if(u||c)return;let e=f.current;if(e&&e.tagName)return function(e,t,r){let{id:n,observer:o,elements:i}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},n=s.find(e=>e.root===r.root&&e.margin===r.margin);if(n&&(t=a.get(n)))return t;let o=new Map;return t={id:r,observer:new IntersectionObserver(e=>{e.forEach(e=>{let t=o.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e),elements:o},s.push(r),a.set(r,t),t}(r);return i.set(e,t),o.observe(e),function(){if(i.delete(e),o.unobserve(e),0===i.size){o.disconnect(),a.delete(n);let e=s.findIndex(e=>e.root===n.root&&e.margin===n.margin);e>-1&&s.splice(e,1)}}}(e,e=>e&&d(e),{root:null==t?void 0:t.current,rootMargin:r})}else if(!c){let e=(0,o.requestIdleCallback)(()=>d(!0));return()=>(0,o.cancelIdleCallback)(e)}},[u,r,t,c,f.current]),[p,c,(0,n.useCallback)(()=>{d(!1)},[])]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7595:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return p}});var n=r(5893);r(3434);var o=r(1664),i=r.n(o),a=r(972),s=r(7294),l=r(1163);function u(e){let{user:t,cartItems:r,onLogout:o}=e,a=(0,l.useRouter)();return(0,n.jsx)("nav",{className:"bg-white shadow-md",children:(0,n.jsxs)("div",{className:"container py-4 flex flex-col sm:flex-row justify-between items-center gap-4",children:[(0,n.jsx)(i(),{href:"/",className:"text-2xl font-bold text-blue-600",children:"SwiftCart"}),(0,n.jsx)("div",{className:"flex flex-wrap justify-center gap-2 sm:gap-4 items-center",children:t?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i(),{href:"/products",className:"btn-secondary",children:"Products"}),(0,n.jsx)(i(),{href:"/order-history",className:"btn-secondary",children:"Orders"}),"admin"===t.role&&(0,n.jsx)(i(),{href:"/admin",className:"btn-secondary",children:"Admin"}),(0,n.jsxs)(i(),{href:"/cart",className:"btn-secondary relative",children:["Cart (",r,")"]}),(0,n.jsxs)("span",{className:"text-sm",children:["Hello, ",t.name]}),(0,n.jsx)("button",{onClick:()=>{o(),a.push("/")},className:"btn-danger",children:"Logout"})]}):(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i(),{href:"/login",className:"btn-primary",children:"Login"}),(0,n.jsx)(i(),{href:"/register",className:"btn-secondary",children:"Register"})]})})]})})}var c=r(6501);function d(){return(0,n.jsx)(c.x7,{position:"top-right",reverseOrder:!1,toastOptions:{duration:4e3,style:{background:"#fff",color:"#000"},success:{style:{background:"#10b981",color:"#fff"}},error:{style:{background:"#ef4444",color:"#fff"}}}})}function f(e){let{children:t}=e,{user:r,logout:o}=(0,a.t)(),i=(0,a.x)(e=>e.getTotalItems());return(0,s.useEffect)(()=>{let{restoreAuth:e}=a.t.getState();e()},[]),(0,n.jsxs)("div",{className:"min-h-screen flex flex-col bg-gray-50",children:[(0,n.jsx)(u,{user:r,cartItems:i,onLogout:o}),(0,n.jsx)("main",{className:"flex-1 container py-8",children:t}),(0,n.jsx)(d,{}),(0,n.jsx)("footer",{className:"bg-gray-900 text-white py-8 mt-12",children:(0,n.jsx)("div",{className:"container text-center",children:(0,n.jsx)("p",{children:"\xa9 2024 SwiftCart. All rights reserved."})})})]})}function p(e){let{Component:t,pageProps:r}=e;return(0,n.jsx)(f,{children:(0,n.jsx)(t,{...r})})}},3434:function(){},1664:function(e,t,r){e.exports=r(8342)},1163:function(e,t,r){e.exports=r(3079)},83:function(e,t,r){"use strict";var n=r(7294),o="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},i=n.useState,a=n.useEffect,s=n.useLayoutEffect,l=n.useDebugValue;function u(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!o(e,r)}catch(e){return!0}}var c="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var r=t(),n=i({inst:{value:r,getSnapshot:t}}),o=n[0].inst,c=n[1];return s(function(){o.value=r,o.getSnapshot=t,u(o)&&c({inst:o})},[e,r,t]),a(function(){return u(o)&&c({inst:o}),e(function(){u(o)&&c({inst:o})})},[e]),l(r),r};t.useSyncExternalStore=void 0!==n.useSyncExternalStore?n.useSyncExternalStore:c},6251:function(e,t,r){"use strict";var n=r(7294),o=r(1688),i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=o.useSyncExternalStore,s=n.useRef,l=n.useEffect,u=n.useMemo,c=n.useDebugValue;t.useSyncExternalStoreWithSelector=function(e,t,r,n,o){var d=s(null);if(null===d.current){var f={hasValue:!1,value:null};d.current=f}else f=d.current;var p=a(e,(d=u(function(){function e(e){if(!l){if(l=!0,a=e,e=n(e),void 0!==o&&f.hasValue){var t=f.value;if(o(t,e))return s=t}return s=e}if(t=s,i(a,e))return t;var r=n(e);return void 0!==o&&o(t,r)?(a=e,t):(a=e,s=r)}var a,s,l=!1,u=void 0===r?null:r;return[function(){return e(t())},null===u?void 0:function(){return e(u())}]},[t,r,n,o]))[0],d[1]);return l(function(){f.hasValue=!0,f.value=p},[p]),c(p),p}},1688:function(e,t,r){"use strict";e.exports=r(83)},2798:function(e,t,r){"use strict";e.exports=r(6251)},1955:function(e,t,r){"use strict";function n(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)e[n]=r[n]}return e}r.d(t,{Z:function(){return o}});var o=function e(t,r){function o(e,o,i){if("undefined"!=typeof document){"number"==typeof(i=n({},r,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),e=encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var a="";for(var s in i)i[s]&&(a+="; "+s,!0!==i[s]&&(a+="="+i[s].split(";")[0]));return document.cookie=e+"="+t.write(o,e)+a}}return Object.create({set:o,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var r=document.cookie?document.cookie.split("; "):[],n={},o=0;o<r.length;o++){var i=r[o].split("="),a=i.slice(1).join("=");try{var s=decodeURIComponent(i[0]);if(n[s]=t.read(a,s),e===s)break}catch(e){}}return e?n[e]:n}},remove:function(e,t){o(e,"",n({},t,{expires:-1}))},withAttributes:function(t){return e(this.converter,n({},this.attributes,t))},withConverter:function(t){return e(n({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(r)},converter:{value:Object.freeze(t)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})},6501:function(e,t,r){"use strict";let n,o;r.d(t,{x7:function(){return ef},ZP:function(){return ep}});var i,a=r(7294);let s={data:""},l=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||s},u=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,f=(e,t)=>{let r="",n="",o="";for(let i in e){let a=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+a+";":n+="f"==i[1]?f(a,i):i+"{"+f(a,"k"==i[1]?"":t)+"}":"object"==typeof a?n+=f(a,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=a&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=f.p?f.p(i,a):i+":"+a+";")}return r+(t&&o?t+"{"+o+"}":o)+n},p={},m=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+m(e[r]);return t}return e},h=(e,t,r,n,o)=>{var i;let a=m(e),s=p[a]||(p[a]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(a));if(!p[s]){let t=a!==e?e:(e=>{let t,r,n=[{}];for(;t=u.exec(e.replace(c,""));)t[4]?n.shift():t[3]?(r=t[3].replace(d," ").trim(),n.unshift(n[0][r]=n[0][r]||{})):n[0][t[1]]=t[2].replace(d," ").trim();return n[0]})(e);p[s]=f(o?{["@keyframes "+s]:t}:t,r?"":"."+s)}let l=r&&p.g?p.g:null;return r&&(p.g=p[s]),i=p[s],l?t.data=t.data.replace(l,i):-1===t.data.indexOf(i)&&(t.data=n?i+t.data:t.data+i),s},y=(e,t,r)=>e.reduce((e,n,o)=>{let i=t[o];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":f(e,""):!1===e?"":e}return e+n+(null==i?"":i)},"");function b(e){let t=this||{},r=e.call?e(t.p):e;return h(r.unshift?r.raw?y(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,l(t.target),t.g,t.o,t.k)}b.bind({g:1});let g,v,x,E=b.bind({k:1});function w(e,t){let r=this||{};return function(){let n=arguments;function o(i,a){let s=Object.assign({},i),l=s.className||o.className;r.p=Object.assign({theme:v&&v()},s),r.o=/ *go\d+/.test(l),s.className=b.apply(r,n)+(l?" "+l:""),t&&(s.ref=a);let u=e;return e[0]&&(u=s.as||e,delete s.as),x&&u[0]&&x(s),g(u,s)}return t?t(o):o}}var j=e=>"function"==typeof e,C=(e,t)=>j(e)?e(t):e,_=(n=0,()=>(++n).toString()),O=()=>{if(void 0===o&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");o=!e||e.matches}return o},k="default",S=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:n}=t;return S(e,{type:e.toasts.find(e=>e.id===n.id)?1:0,toast:n});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},N=[],I={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},P={},T=(e,t=k)=>{P[t]=S(P[t]||I,e),N.forEach(([e,r])=>{e===t&&r(P[t])})},A=e=>Object.keys(P).forEach(t=>T(e,t)),R=e=>Object.keys(P).find(t=>P[t].toasts.some(t=>t.id===e)),D=(e=k)=>t=>{T(t,e)},M={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},L=(e={},t=k)=>{let[r,n]=(0,a.useState)(P[t]||I),o=(0,a.useRef)(P[t]);(0,a.useEffect)(()=>(o.current!==P[t]&&n(P[t]),N.push([t,n]),()=>{let e=N.findIndex(([e])=>e===t);e>-1&&N.splice(e,1)}),[t]);let i=r.toasts.map(t=>{var r,n,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(n=e[t.type])?void 0:n.duration)||(null==e?void 0:e.duration)||M[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...r,toasts:i}},U=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||_()}),$=e=>(t,r)=>{let n=U(t,e,r);return D(n.toasterId||R(n.id))({type:2,toast:n}),n.id},F=(e,t)=>$("blank")(e,t);F.error=$("error"),F.success=$("success"),F.loading=$("loading"),F.custom=$("custom"),F.dismiss=(e,t)=>{let r={type:3,toastId:e};t?D(t)(r):A(r)},F.dismissAll=e=>F.dismiss(void 0,e),F.remove=(e,t)=>{let r={type:4,toastId:e};t?D(t)(r):A(r)},F.removeAll=e=>F.remove(void 0,e),F.promise=(e,t,r)=>{let n=F.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?C(t.success,e):void 0;return o?F.success(o,{id:n,...r,...null==r?void 0:r.success}):F.dismiss(n),e}).catch(e=>{let o=t.error?C(t.error,e):void 0;o?F.error(o,{id:n,...r,...null==r?void 0:r.error}):F.dismiss(n)}),e};var z=1e3,H=(e,t="default")=>{let{toasts:r,pausedAt:n}=L(e,t),o=(0,a.useRef)(new Map).current,i=(0,a.useCallback)((e,t=z)=>{if(o.has(e))return;let r=setTimeout(()=>{o.delete(e),s({type:4,toastId:e})},t);o.set(e,r)},[]);(0,a.useEffect)(()=>{if(n)return;let e=Date.now(),o=r.map(r=>{if(r.duration===1/0)return;let n=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(n<0){r.visible&&F.dismiss(r.id);return}return setTimeout(()=>F.dismiss(r.id,t),n)});return()=>{o.forEach(e=>e&&clearTimeout(e))}},[r,n,t]);let s=(0,a.useCallback)(D(t),[t]),l=(0,a.useCallback)(()=>{s({type:5,time:Date.now()})},[s]),u=(0,a.useCallback)((e,t)=>{s({type:1,toast:{id:e,height:t}})},[s]),c=(0,a.useCallback)(()=>{n&&s({type:6,time:Date.now()})},[n,s]),d=(0,a.useCallback)((e,t)=>{let{reverseOrder:n=!1,gutter:o=8,defaultPosition:i}=t||{},a=r.filter(t=>(t.position||i)===(e.position||i)&&t.height),s=a.findIndex(t=>t.id===e.id),l=a.filter((e,t)=>t<s&&e.visible).length;return a.filter(e=>e.visible).slice(...n?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+o,0)},[r]);return(0,a.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=o.get(e.id);t&&(clearTimeout(t),o.delete(e.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:u,startPause:l,endPause:c,calculateOffset:d}}},q=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Z=E`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=E`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,K=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Z} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${V} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,B=E`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,W=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${B} 1s linear infinite;
`,J=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,X=E`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Y=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${J} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${X} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,G=w("div")`
  position: absolute;
`,Q=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ee=E`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,et=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ee} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,er=({toast:e})=>{let{icon:t,type:r,iconTheme:n}=e;return void 0!==t?"string"==typeof t?a.createElement(et,null,t):t:"blank"===r?null:a.createElement(Q,null,a.createElement(W,{...n}),"loading"!==r&&a.createElement(G,null,"error"===r?a.createElement(K,{...n}):a.createElement(Y,{...n})))},en=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,eo=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,ei=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ea=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,es=(e,t)=>{let r=e.includes("top")?1:-1,[n,o]=O()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[en(r),eo(r)];return{animation:t?`${E(n)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${E(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},el=a.memo(({toast:e,position:t,style:r,children:n})=>{let o=e.height?es(e.position||t||"top-center",e.visible):{opacity:0},i=a.createElement(er,{toast:e}),s=a.createElement(ea,{...e.ariaProps},C(e.message,e));return a.createElement(ei,{className:e.className,style:{...o,...r,...e.style}},"function"==typeof n?n({icon:i,message:s}):a.createElement(a.Fragment,null,i,s))});i=a.createElement,f.p=void 0,g=i,v=void 0,x=void 0;var eu=({id:e,className:t,style:r,onHeightUpdate:n,children:o})=>{let i=a.useCallback(t=>{if(t){let r=()=>{n(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,n]);return a.createElement("div",{ref:i,className:t,style:r},o)},ec=(e,t)=>{let r=e.includes("top"),n=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:O()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...n}},ed=b`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ef=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:n,children:o,toasterId:i,containerStyle:s,containerClassName:l})=>{let{toasts:u,handlers:c}=H(r,i);return a.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...s},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},u.map(r=>{let i=r.position||t,s=ec(i,c.calculateOffset(r,{reverseOrder:e,gutter:n,defaultPosition:t}));return a.createElement(eu,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?ed:"",style:s},"custom"===r.type?C(r.message,r):o?o(r):a.createElement(el,{toast:r,position:i}))}))},ep=F}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return t(3837),t(3079)}),_N_E=e.O()}]);