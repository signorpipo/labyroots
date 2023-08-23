(()=>{var Vt=Object.create;var Ee=Object.defineProperty;var Kt=Object.getOwnPropertyDescriptor;var Xt=Object.getOwnPropertyNames;var Gt=Object.getPrototypeOf,Qt=Object.prototype.hasOwnProperty;var l=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Zt=(t,e,r,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Xt(e))!Qt.call(t,n)&&n!==r&&Ee(t,n,{get:()=>e[n],enumerable:!(i=Kt(e,n))||i.enumerable});return t};var xe=(t,e,r)=>(r=t!=null?Vt(Gt(t)):{},Zt(e||!t||!t.__esModule?Ee(r,"default",{value:t,enumerable:!0}):r,t));var V=l((un,Oe)=>{"use strict";Oe.exports=function(e,r){return function(){for(var n=new Array(arguments.length),s=0;s<n.length;s++)n[s]=arguments[s];return e.apply(r,n)}}});var f=l((cn,Ae)=>{"use strict";var Yt=V(),X=Object.prototype.toString,G=function(t){return function(e){var r=X.call(e);return t[r]||(t[r]=r.slice(8,-1).toLowerCase())}}(Object.create(null));function C(t){return t=t.toLowerCase(),function(r){return G(r)===t}}function Q(t){return Array.isArray(t)}function U(t){return typeof t>"u"}function er(t){return t!==null&&!U(t)&&t.constructor!==null&&!U(t.constructor)&&typeof t.constructor.isBuffer=="function"&&t.constructor.isBuffer(t)}var Re=C("ArrayBuffer");function tr(t){var e;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?e=ArrayBuffer.isView(t):e=t&&t.buffer&&Re(t.buffer),e}function rr(t){return typeof t=="string"}function nr(t){return typeof t=="number"}function Ce(t){return t!==null&&typeof t=="object"}function D(t){if(G(t)!=="object")return!1;var e=Object.getPrototypeOf(t);return e===null||e===Object.prototype}var ir=C("Date"),sr=C("File"),ar=C("Blob"),or=C("FileList");function Z(t){return X.call(t)==="[object Function]"}function ur(t){return Ce(t)&&Z(t.pipe)}function cr(t){var e="[object FormData]";return t&&(typeof FormData=="function"&&t instanceof FormData||X.call(t)===e||Z(t.toString)&&t.toString()===e)}var lr=C("URLSearchParams");function dr(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function fr(){return typeof navigator<"u"&&(navigator.product==="ReactNative"||navigator.product==="NativeScript"||navigator.product==="NS")?!1:typeof window<"u"&&typeof document<"u"}function Y(t,e){if(!(t===null||typeof t>"u"))if(typeof t!="object"&&(t=[t]),Q(t))for(var r=0,i=t.length;r<i;r++)e.call(null,t[r],r,t);else for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.call(null,t[n],n,t)}function K(){var t={};function e(n,s){D(t[s])&&D(n)?t[s]=K(t[s],n):D(n)?t[s]=K({},n):Q(n)?t[s]=n.slice():t[s]=n}for(var r=0,i=arguments.length;r<i;r++)Y(arguments[r],e);return t}function pr(t,e,r){return Y(e,function(n,s){r&&typeof n=="function"?t[s]=Yt(n,r):t[s]=n}),t}function hr(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function mr(t,e,r,i){t.prototype=Object.create(e.prototype,i),t.prototype.constructor=t,r&&Object.assign(t.prototype,r)}function yr(t,e,r){var i,n,s,a={};e=e||{};do{for(i=Object.getOwnPropertyNames(t),n=i.length;n-- >0;)s=i[n],a[s]||(e[s]=t[s],a[s]=!0);t=Object.getPrototypeOf(t)}while(t&&(!r||r(t,e))&&t!==Object.prototype);return e}function vr(t,e,r){t=String(t),(r===void 0||r>t.length)&&(r=t.length),r-=e.length;var i=t.indexOf(e,r);return i!==-1&&i===r}function wr(t){if(!t)return null;var e=t.length;if(U(e))return null;for(var r=new Array(e);e-- >0;)r[e]=t[e];return r}var gr=function(t){return function(e){return t&&e instanceof t}}(typeof Uint8Array<"u"&&Object.getPrototypeOf(Uint8Array));Ae.exports={isArray:Q,isArrayBuffer:Re,isBuffer:er,isFormData:cr,isArrayBufferView:tr,isString:rr,isNumber:nr,isObject:Ce,isPlainObject:D,isUndefined:U,isDate:ir,isFile:sr,isBlob:ar,isFunction:Z,isStream:ur,isURLSearchParams:lr,isStandardBrowserEnv:fr,forEach:Y,merge:K,extend:pr,trim:dr,stripBOM:hr,inherits:mr,toFlatObject:yr,kindOf:G,kindOfTest:C,endsWith:vr,toArray:wr,isTypedArray:gr,isFileList:or}});var ee=l((ln,qe)=>{"use strict";var q=f();function Te(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}qe.exports=function(e,r,i){if(!r)return e;var n;if(i)n=i(r);else if(q.isURLSearchParams(r))n=r.toString();else{var s=[];q.forEach(r,function(c,h){c===null||typeof c>"u"||(q.isArray(c)?h=h+"[]":c=[c],q.forEach(c,function(d){q.isDate(d)?d=d.toISOString():q.isObject(d)&&(d=JSON.stringify(d)),s.push(Te(h)+"="+Te(d))}))}),n=s.join("&")}if(n){var a=e.indexOf("#");a!==-1&&(e=e.slice(0,a)),e+=(e.indexOf("?")===-1?"?":"&")+n}return e}});var Ne=l((dn,Se)=>{"use strict";var br=f();function j(){this.handlers=[]}j.prototype.use=function(e,r,i){return this.handlers.push({fulfilled:e,rejected:r,synchronous:i?i.synchronous:!1,runWhen:i?i.runWhen:null}),this.handlers.length-1};j.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)};j.prototype.forEach=function(e){br.forEach(this.handlers,function(i){i!==null&&e(i)})};Se.exports=j});var Pe=l((fn,ke)=>{"use strict";var Er=f();ke.exports=function(e,r){Er.forEach(e,function(n,s){s!==r&&s.toUpperCase()===r.toUpperCase()&&(e[r]=n,delete e[s])})}});var A=l((pn,De)=>{"use strict";var _e=f();function S(t,e,r,i,n){Error.call(this),this.message=t,this.name="AxiosError",e&&(this.code=e),r&&(this.config=r),i&&(this.request=i),n&&(this.response=n)}_e.inherits(S,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}}});var Le=S.prototype,Be={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED"].forEach(function(t){Be[t]={value:t}});Object.defineProperties(S,Be);Object.defineProperty(Le,"isAxiosError",{value:!0});S.from=function(t,e,r,i,n,s){var a=Object.create(Le);return _e.toFlatObject(t,a,function(c){return c!==Error.prototype}),S.call(a,t.message,e,r,i,n),a.name=t.name,s&&Object.assign(a,s),a};De.exports=S});var te=l((hn,Ue)=>{"use strict";Ue.exports={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1}});var re=l((mn,je)=>{"use strict";var b=f();function xr(t,e){e=e||new FormData;var r=[];function i(s){return s===null?"":b.isDate(s)?s.toISOString():b.isArrayBuffer(s)||b.isTypedArray(s)?typeof Blob=="function"?new Blob([s]):Buffer.from(s):s}function n(s,a){if(b.isPlainObject(s)||b.isArray(s)){if(r.indexOf(s)!==-1)throw Error("Circular reference detected in "+a);r.push(s),b.forEach(s,function(c,h){if(!b.isUndefined(c)){var o=a?a+"."+h:h,d;if(c&&!a&&typeof c=="object"){if(b.endsWith(h,"{}"))c=JSON.stringify(c);else if(b.endsWith(h,"[]")&&(d=b.toArray(c))){d.forEach(function(v){!b.isUndefined(v)&&e.append(o,i(v))});return}}n(c,o)}}),r.pop()}else e.append(a,i(s))}return n(t),e}je.exports=xr});var Ie=l((yn,Fe)=>{"use strict";var ne=A();Fe.exports=function(e,r,i){var n=i.config.validateStatus;!i.status||!n||n(i.status)?e(i):r(new ne("Request failed with status code "+i.status,[ne.ERR_BAD_REQUEST,ne.ERR_BAD_RESPONSE][Math.floor(i.status/100)-4],i.config,i.request,i))}});var Me=l((vn,ze)=>{"use strict";var F=f();ze.exports=F.isStandardBrowserEnv()?function(){return{write:function(r,i,n,s,a,u){var c=[];c.push(r+"="+encodeURIComponent(i)),F.isNumber(n)&&c.push("expires="+new Date(n).toGMTString()),F.isString(s)&&c.push("path="+s),F.isString(a)&&c.push("domain="+a),u===!0&&c.push("secure"),document.cookie=c.join("; ")},read:function(r){var i=document.cookie.match(new RegExp("(^|;\\s*)("+r+")=([^;]*)"));return i?decodeURIComponent(i[3]):null},remove:function(r){this.write(r,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}()});var We=l((wn,$e)=>{"use strict";$e.exports=function(e){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)}});var Je=l((gn,He)=>{"use strict";He.exports=function(e,r){return r?e.replace(/\/+$/,"")+"/"+r.replace(/^\/+/,""):e}});var ie=l((bn,Ve)=>{"use strict";var Or=We(),Rr=Je();Ve.exports=function(e,r){return e&&!Or(r)?Rr(e,r):r}});var Xe=l((En,Ke)=>{"use strict";var se=f(),Cr=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];Ke.exports=function(e){var r={},i,n,s;return e&&se.forEach(e.split(`
`),function(u){if(s=u.indexOf(":"),i=se.trim(u.substr(0,s)).toLowerCase(),n=se.trim(u.substr(s+1)),i){if(r[i]&&Cr.indexOf(i)>=0)return;i==="set-cookie"?r[i]=(r[i]?r[i]:[]).concat([n]):r[i]=r[i]?r[i]+", "+n:n}}),r}});var Ze=l((xn,Qe)=>{"use strict";var Ge=f();Qe.exports=Ge.isStandardBrowserEnv()?function(){var e=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a"),i;function n(s){var a=s;return e&&(r.setAttribute("href",a),a=r.href),r.setAttribute("href",a),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:r.pathname.charAt(0)==="/"?r.pathname:"/"+r.pathname}}return i=n(window.location.href),function(a){var u=Ge.isString(a)?n(a):a;return u.protocol===i.protocol&&u.host===i.host}}():function(){return function(){return!0}}()});var L=l((On,et)=>{"use strict";var ae=A(),Ar=f();function Ye(t){ae.call(this,t??"canceled",ae.ERR_CANCELED),this.name="CanceledError"}Ar.inherits(Ye,ae,{__CANCEL__:!0});et.exports=Ye});var rt=l((Rn,tt)=>{"use strict";tt.exports=function(e){var r=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return r&&r[1]||""}});var oe=l((Cn,nt)=>{"use strict";var B=f(),Tr=Ie(),qr=Me(),Sr=ee(),Nr=ie(),kr=Xe(),Pr=Ze(),_r=te(),E=A(),Lr=L(),Br=rt();nt.exports=function(e){return new Promise(function(i,n){var s=e.data,a=e.headers,u=e.responseType,c;function h(){e.cancelToken&&e.cancelToken.unsubscribe(c),e.signal&&e.signal.removeEventListener("abort",c)}B.isFormData(s)&&B.isStandardBrowserEnv()&&delete a["Content-Type"];var o=new XMLHttpRequest;if(e.auth){var d=e.auth.username||"",v=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";a.Authorization="Basic "+btoa(d+":"+v)}var m=Nr(e.baseURL,e.url);o.open(e.method.toUpperCase(),Sr(m,e.params,e.paramsSerializer),!0),o.timeout=e.timeout;function ge(){if(o){var g="getAllResponseHeaders"in o?kr(o.getAllResponseHeaders()):null,T=!u||u==="text"||u==="json"?o.responseText:o.response,R={data:T,status:o.status,statusText:o.statusText,headers:g,config:e,request:o};Tr(function(J){i(J),h()},function(J){n(J),h()},R),o=null}}if("onloadend"in o?o.onloadend=ge:o.onreadystatechange=function(){!o||o.readyState!==4||o.status===0&&!(o.responseURL&&o.responseURL.indexOf("file:")===0)||setTimeout(ge)},o.onabort=function(){o&&(n(new E("Request aborted",E.ECONNABORTED,e,o)),o=null)},o.onerror=function(){n(new E("Network Error",E.ERR_NETWORK,e,o,o)),o=null},o.ontimeout=function(){var T=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded",R=e.transitional||_r;e.timeoutErrorMessage&&(T=e.timeoutErrorMessage),n(new E(T,R.clarifyTimeoutError?E.ETIMEDOUT:E.ECONNABORTED,e,o)),o=null},B.isStandardBrowserEnv()){var be=(e.withCredentials||Pr(m))&&e.xsrfCookieName?qr.read(e.xsrfCookieName):void 0;be&&(a[e.xsrfHeaderName]=be)}"setRequestHeader"in o&&B.forEach(a,function(T,R){typeof s>"u"&&R.toLowerCase()==="content-type"?delete a[R]:o.setRequestHeader(R,T)}),B.isUndefined(e.withCredentials)||(o.withCredentials=!!e.withCredentials),u&&u!=="json"&&(o.responseType=e.responseType),typeof e.onDownloadProgress=="function"&&o.addEventListener("progress",e.onDownloadProgress),typeof e.onUploadProgress=="function"&&o.upload&&o.upload.addEventListener("progress",e.onUploadProgress),(e.cancelToken||e.signal)&&(c=function(g){o&&(n(!g||g&&g.type?new Lr:g),o.abort(),o=null)},e.cancelToken&&e.cancelToken.subscribe(c),e.signal&&(e.signal.aborted?c():e.signal.addEventListener("abort",c))),s||(s=null);var H=Br(m);if(H&&["http","https","file"].indexOf(H)===-1){n(new E("Unsupported protocol "+H+":",E.ERR_BAD_REQUEST,e));return}o.send(s)})}});var st=l((An,it)=>{it.exports=null});var z=l((Tn,ct)=>{"use strict";var p=f(),at=Pe(),ot=A(),Dr=te(),Ur=re(),jr={"Content-Type":"application/x-www-form-urlencoded"};function ut(t,e){!p.isUndefined(t)&&p.isUndefined(t["Content-Type"])&&(t["Content-Type"]=e)}function Fr(){var t;return typeof XMLHttpRequest<"u"?t=oe():typeof process<"u"&&Object.prototype.toString.call(process)==="[object process]"&&(t=oe()),t}function Ir(t,e,r){if(p.isString(t))try{return(e||JSON.parse)(t),p.trim(t)}catch(i){if(i.name!=="SyntaxError")throw i}return(r||JSON.stringify)(t)}var I={transitional:Dr,adapter:Fr(),transformRequest:[function(e,r){if(at(r,"Accept"),at(r,"Content-Type"),p.isFormData(e)||p.isArrayBuffer(e)||p.isBuffer(e)||p.isStream(e)||p.isFile(e)||p.isBlob(e))return e;if(p.isArrayBufferView(e))return e.buffer;if(p.isURLSearchParams(e))return ut(r,"application/x-www-form-urlencoded;charset=utf-8"),e.toString();var i=p.isObject(e),n=r&&r["Content-Type"],s;if((s=p.isFileList(e))||i&&n==="multipart/form-data"){var a=this.env&&this.env.FormData;return Ur(s?{"files[]":e}:e,a&&new a)}else if(i||n==="application/json")return ut(r,"application/json"),Ir(e);return e}],transformResponse:[function(e){var r=this.transitional||I.transitional,i=r&&r.silentJSONParsing,n=r&&r.forcedJSONParsing,s=!i&&this.responseType==="json";if(s||n&&p.isString(e)&&e.length)try{return JSON.parse(e)}catch(a){if(s)throw a.name==="SyntaxError"?ot.from(a,ot.ERR_BAD_RESPONSE,this,null,this.response):a}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:st()},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};p.forEach(["delete","get","head"],function(e){I.headers[e]={}});p.forEach(["post","put","patch"],function(e){I.headers[e]=p.merge(jr)});ct.exports=I});var dt=l((qn,lt)=>{"use strict";var zr=f(),Mr=z();lt.exports=function(e,r,i){var n=this||Mr;return zr.forEach(i,function(a){e=a.call(n,e,r)}),e}});var ue=l((Sn,ft)=>{"use strict";ft.exports=function(e){return!!(e&&e.__CANCEL__)}});var mt=l((Nn,ht)=>{"use strict";var pt=f(),ce=dt(),$r=ue(),Wr=z(),Hr=L();function le(t){if(t.cancelToken&&t.cancelToken.throwIfRequested(),t.signal&&t.signal.aborted)throw new Hr}ht.exports=function(e){le(e),e.headers=e.headers||{},e.data=ce.call(e,e.data,e.headers,e.transformRequest),e.headers=pt.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),pt.forEach(["delete","get","head","post","put","patch","common"],function(n){delete e.headers[n]});var r=e.adapter||Wr.adapter;return r(e).then(function(n){return le(e),n.data=ce.call(e,n.data,n.headers,e.transformResponse),n},function(n){return $r(n)||(le(e),n&&n.response&&(n.response.data=ce.call(e,n.response.data,n.response.headers,e.transformResponse))),Promise.reject(n)})}});var de=l((kn,yt)=>{"use strict";var w=f();yt.exports=function(e,r){r=r||{};var i={};function n(o,d){return w.isPlainObject(o)&&w.isPlainObject(d)?w.merge(o,d):w.isPlainObject(d)?w.merge({},d):w.isArray(d)?d.slice():d}function s(o){if(w.isUndefined(r[o])){if(!w.isUndefined(e[o]))return n(void 0,e[o])}else return n(e[o],r[o])}function a(o){if(!w.isUndefined(r[o]))return n(void 0,r[o])}function u(o){if(w.isUndefined(r[o])){if(!w.isUndefined(e[o]))return n(void 0,e[o])}else return n(void 0,r[o])}function c(o){if(o in r)return n(e[o],r[o]);if(o in e)return n(void 0,e[o])}var h={url:a,method:a,data:a,baseURL:u,transformRequest:u,transformResponse:u,paramsSerializer:u,timeout:u,timeoutMessage:u,withCredentials:u,adapter:u,responseType:u,xsrfCookieName:u,xsrfHeaderName:u,onUploadProgress:u,onDownloadProgress:u,decompress:u,maxContentLength:u,maxBodyLength:u,beforeRedirect:u,transport:u,httpAgent:u,httpsAgent:u,cancelToken:u,socketPath:u,responseEncoding:u,validateStatus:c};return w.forEach(Object.keys(e).concat(Object.keys(r)),function(d){var v=h[d]||s,m=v(d);w.isUndefined(m)&&v!==c||(i[d]=m)}),i}});var fe=l((Pn,vt)=>{vt.exports={version:"0.27.2"}});var bt=l((_n,gt)=>{"use strict";var Jr=fe().version,O=A(),pe={};["object","boolean","number","function","string","symbol"].forEach(function(t,e){pe[t]=function(i){return typeof i===t||"a"+(e<1?"n ":" ")+t}});var wt={};pe.transitional=function(e,r,i){function n(s,a){return"[Axios v"+Jr+"] Transitional option '"+s+"'"+a+(i?". "+i:"")}return function(s,a,u){if(e===!1)throw new O(n(a," has been removed"+(r?" in "+r:"")),O.ERR_DEPRECATED);return r&&!wt[a]&&(wt[a]=!0,console.warn(n(a," has been deprecated since v"+r+" and will be removed in the near future"))),e?e(s,a,u):!0}};function Vr(t,e,r){if(typeof t!="object")throw new O("options must be an object",O.ERR_BAD_OPTION_VALUE);for(var i=Object.keys(t),n=i.length;n-- >0;){var s=i[n],a=e[s];if(a){var u=t[s],c=u===void 0||a(u,s,t);if(c!==!0)throw new O("option "+s+" must be "+c,O.ERR_BAD_OPTION_VALUE);continue}if(r!==!0)throw new O("Unknown option "+s,O.ERR_BAD_OPTION)}}gt.exports={assertOptions:Vr,validators:pe}});var At=l((Ln,Ct)=>{"use strict";var Ot=f(),Kr=ee(),Et=Ne(),xt=mt(),M=de(),Xr=ie(),Rt=bt(),N=Rt.validators;function k(t){this.defaults=t,this.interceptors={request:new Et,response:new Et}}k.prototype.request=function(e,r){typeof e=="string"?(r=r||{},r.url=e):r=e||{},r=M(this.defaults,r),r.method?r.method=r.method.toLowerCase():this.defaults.method?r.method=this.defaults.method.toLowerCase():r.method="get";var i=r.transitional;i!==void 0&&Rt.assertOptions(i,{silentJSONParsing:N.transitional(N.boolean),forcedJSONParsing:N.transitional(N.boolean),clarifyTimeoutError:N.transitional(N.boolean)},!1);var n=[],s=!0;this.interceptors.request.forEach(function(m){typeof m.runWhen=="function"&&m.runWhen(r)===!1||(s=s&&m.synchronous,n.unshift(m.fulfilled,m.rejected))});var a=[];this.interceptors.response.forEach(function(m){a.push(m.fulfilled,m.rejected)});var u;if(!s){var c=[xt,void 0];for(Array.prototype.unshift.apply(c,n),c=c.concat(a),u=Promise.resolve(r);c.length;)u=u.then(c.shift(),c.shift());return u}for(var h=r;n.length;){var o=n.shift(),d=n.shift();try{h=o(h)}catch(v){d(v);break}}try{u=xt(h)}catch(v){return Promise.reject(v)}for(;a.length;)u=u.then(a.shift(),a.shift());return u};k.prototype.getUri=function(e){e=M(this.defaults,e);var r=Xr(e.baseURL,e.url);return Kr(r,e.params,e.paramsSerializer)};Ot.forEach(["delete","get","head","options"],function(e){k.prototype[e]=function(r,i){return this.request(M(i||{},{method:e,url:r,data:(i||{}).data}))}});Ot.forEach(["post","put","patch"],function(e){function r(i){return function(s,a,u){return this.request(M(u||{},{method:e,headers:i?{"Content-Type":"multipart/form-data"}:{},url:s,data:a}))}}k.prototype[e]=r(),k.prototype[e+"Form"]=r(!0)});Ct.exports=k});var qt=l((Bn,Tt)=>{"use strict";var Gr=L();function P(t){if(typeof t!="function")throw new TypeError("executor must be a function.");var e;this.promise=new Promise(function(n){e=n});var r=this;this.promise.then(function(i){if(r._listeners){var n,s=r._listeners.length;for(n=0;n<s;n++)r._listeners[n](i);r._listeners=null}}),this.promise.then=function(i){var n,s=new Promise(function(a){r.subscribe(a),n=a}).then(i);return s.cancel=function(){r.unsubscribe(n)},s},t(function(n){r.reason||(r.reason=new Gr(n),e(r.reason))})}P.prototype.throwIfRequested=function(){if(this.reason)throw this.reason};P.prototype.subscribe=function(e){if(this.reason){e(this.reason);return}this._listeners?this._listeners.push(e):this._listeners=[e]};P.prototype.unsubscribe=function(e){if(this._listeners){var r=this._listeners.indexOf(e);r!==-1&&this._listeners.splice(r,1)}};P.source=function(){var e,r=new P(function(n){e=n});return{token:r,cancel:e}};Tt.exports=P});var Nt=l((Dn,St)=>{"use strict";St.exports=function(e){return function(i){return e.apply(null,i)}}});var Pt=l((Un,kt)=>{"use strict";var Qr=f();kt.exports=function(e){return Qr.isObject(e)&&e.isAxiosError===!0}});var Bt=l((jn,he)=>{"use strict";var _t=f(),Zr=V(),$=At(),Yr=de(),en=z();function Lt(t){var e=new $(t),r=Zr($.prototype.request,e);return _t.extend(r,$.prototype,e),_t.extend(r,e),r.create=function(n){return Lt(Yr(t,n))},r}var y=Lt(en);y.Axios=$;y.CanceledError=L();y.CancelToken=qt();y.isCancel=ue();y.VERSION=fe().version;y.toFormData=re();y.AxiosError=A();y.Cancel=y.CanceledError;y.all=function(e){return Promise.all(e)};y.spread=Nt();y.isAxiosError=Pt();he.exports=y;he.exports.default=y});var me=l((Fn,Dt)=>{Dt.exports=Bt()});var W=xe(me(),1);var x="https://zesty-storage-prod.s3.amazonaws.com/images/zesty",_={tall:{width:.75,height:1,style:{standard:`${x}/zesty-banner-tall.png`,minimal:`${x}/zesty-banner-tall-minimal.png`,transparent:`${x}/zesty-banner-tall-transparent.png`}},wide:{width:4,height:1,style:{standard:`${x}/zesty-banner-wide.png`,minimal:`${x}/zesty-banner-wide-minimal.png`,transparent:`${x}/zesty-banner-wide-transparent.png`}},square:{width:1,height:1,style:{standard:`${x}/zesty-banner-square.png`,minimal:`${x}/zesty-banner-square-minimal.png`,transparent:`${x}/zesty-banner-square-transparent.png`}}},Ut="square";var tn=xe(me(),1);var ye=()=>{let t=window.XRHand!=null&&window.XRMediaBinding!=null,e=navigator.userAgent.includes("OculusBrowser"),r=t&&e?"Full":t||e?"Partial":"None";return{match:r!=="None",confidence:r}},ve=()=>{let t=window.mozInnerScreenX!=null&&window.speechSynthesis==null,e=navigator.userAgent.includes("Mobile VR")&&!navigator.userAgent.includes("OculusBrowser"),r=t&&e?"Full":t||e?"Partial":"None";return{match:r!=="None",confidence:r}},jt=async()=>{let t=navigator.xr&&await navigator.xr.isSessionSupported("immersive-vr")&&await navigator.xr.isSessionSupported("immersive-ar"),e=navigator.userAgent.includes("Pico Neo 3 Link"),r=t&&e?"Full":t||e?"Partial":"None";return{match:r!=="None",confidence:r}},Ft=()=>{let t=navigator.maxTouchPoints===0||navigator.msMaxTouchPoints===0,e=!navigator.userAgent.includes("Android")&&!navigator.userAgent.includes("Mobile"),r=t&&e?"Full":t||e?"Partial":"None";return{match:r!=="None",confidence:r}},we=async()=>{let t={platform:"",confidence:""};return ye().match?t={platform:"Oculus",confidence:ye().confidence}:ve().match?t={platform:"Wolvic",confidence:ve().confidence}:await jt().match?t={platform:"Pico",confidence:await jt().confidence}:Ft().match?t={platform:"Desktop",confidence:Ft().confidence}:t={platform:"Unknown",confidence:"None"},t},It=t=>{if(t){if(ye().match){if(t.includes("https://www.oculus.com/experiences/quest/")){setTimeout(()=>{window.open(t,"_blank")},1e3);return}}else if(ve().match){let e=document.createElement("div"),r=document.createElement("div"),i=document.createElement("p"),n=document.createElement("button"),s=document.createElement("button");e.style.backgroundColor="rgb(0, 0, 0, 0.75)",e.style.color="white",e.style.textAlign="center",e.style.position="fixed",e.style.top="50%",e.style.left="50%",e.style.padding="5%",e.style.borderRadius="5%",e.style.transform="translate(-50%, -50%)",i.innerHTML=`<b>This billboard leads to ${t}. Continue?</b>`,n.innerText="Move cursor back into window.",n.style.width="100vw",n.style.height="100vh",n.onmouseenter=()=>{n.style.width="auto",n.style.height="auto",n.innerText="Yes"},n.onclick=()=>{window.open(t,"_blank"),e.remove()},s.innerText="No",s.onclick=()=>{e.remove()},e.append(r),r.append(i),r.append(n),r.append(s),document.body.append(e);return}window.open(t,"_blank")}};var zt="https://beacon2.zesty.market/zgraphql",rn="https://api.zesty.market/api";var Mt=async(t,e="tall",r="standard")=>{try{let i=encodeURI(window.top.location.href).replace(/\/$/,"");return(await W.default.get(`${rn}/ad?ad_unit_id=${t}&url=${i}`)).data}catch{return console.warn("No active campaign banner could be located. Displaying default banner."),{Ads:[{asset_url:_[e].style[r],cta_url:"https://www.zesty.market"}],CampaignId:"TestCampaign"}}},$t=async(t,e=null)=>{let{platform:r,confidence:i}=await we();try{await W.default.post(zt,{query:`mutation { increment(eventType: visits, spaceId: "${t}", campaignId: "${e}", platform: { name: ${r}, confidence: ${i} }) { message } }`},{headers:{"Content-Type":"application/json"}})}catch(n){console.log("Failed to emit onload event",n.message)}},Wt=async(t,e=null)=>{let{platform:r,confidence:i}=await we();try{await W.default.post(zt,{query:`mutation { increment(eventType: clicks, spaceId: "${t}", campaignId: "${e}", platform: { name: ${r}, confidence: ${i} }) { message } }`},{headers:{"Content-Type":"application/json"}})}catch(n){console.log("Failed to emit onclick event",n.message)}};var Ht="2.1.0";console.log(`Zesty SDK Version: ${Ht} (compatibility)`);var sn="https://cdn.zesty.xyz/sdk/zesty-formats.js",an="https://cdn.zesty.xyz/sdk/zesty-networking.js";WL.registerComponent("zesty-banner",{adUnit:{type:WL.Type.String},format:{type:WL.Type.Enum,values:Object.keys(_),default:Ut},style:{type:WL.Type.Enum,values:["standard","minimal","transparent"],default:"transparent"},scaleToRatio:{type:WL.Type.Bool,default:!0},textureProperty:{type:WL.Type.String,default:"auto"},beacon:{type:WL.Type.Bool,default:!0},dynamicFormats:{type:WL.Type.Bool,default:!0},createAutomaticCollision:{type:WL.Type.Bool,default:!0},dynamicNetworking:{type:WL.Type.Bool,default:!0}},{init:function(){this.formats=Object.values(_),this.formatKeys=Object.keys(_),this.styleKeys=["standard","minimal","transparent"]},start:function(){if(this.mesh=this.object.getComponent("mesh"),!this.mesh)throw new Error("'zesty-banner ' missing mesh component");if(this.createAutomaticCollision&&(this.collision=this.object.getComponent("collision")||this.object.addComponent("collision",{collider:WL.Collider.Box,group:2}),this.cursorTarget=this.object.getComponent("cursor-target")||this.object.addComponent("cursor-target"),this.cursorTarget.addClickFunction(this.onClick.bind(this))),this.dynamicFormats){let t=document.createElement("script");t.onload=()=>{this.formatsOverride=zestyFormats.formats},t.setAttribute("src",sn),t.setAttribute("crossorigin","anonymous"),document.body.appendChild(t)}this.dynamicNetworking?import(an).then(t=>{this.zestyNetworking=Object.assign({},t),this.startLoading()}).catch(()=>{console.error("Failed to dynamically retrieve networking code, falling back to bundled version."),this.dynamicNetworking=null,this.startLoading()}):this.startLoading()},startLoading:function(){this.loadBanner(this.adUnit,this.formatKeys[this.format],this.styleKeys[this.style]).then(t=>{this.banner=t,this.scaleToRatio&&(this.height=this.object.scalingLocal[1],this.object.resetScaling(),this.createAutomaticCollision&&(this.collision.extents=[this.formats[this.format].width*this.height,this.height,.1]),this.object.scale([this.formats[this.format].width*this.height,this.height,1]));let e=this.mesh.material;if(this.textureProperty==="auto"){let r=e.pipeline||e.shader;if(r==="Phong Opaque Textured Blend")e.diffuseTexture=t.texture,e.alphaMaskThreshold=.3;else if(r==="Flat Opaque Textured")e.flatTexture=t.texture,e.alphaMaskThreshold=.8;else throw Error("'zesty-banner ' unable to apply banner texture: unsupported pipeline "+e.shader);this.mesh.material=e}else this.mesh.material[this.textureProperty]=t.texture;this.beacon&&(this.dynamicNetworking?this.zestyNetworking.sendOnLoadMetric(this.adUnit,this.banner.campaignId):$t(this.adUnit,this.banner.campaignId))})},onClick:function(){this.banner?.url&&(WL.xrSession?WL.xrSession.end().then(this.executeClick.bind(this)):this.executeClick())},executeClick:function(){this.beacon&&(this.dynamicNetworking?this.zestyNetworking.sendOnClickMetric(this.adUnit,this.banner.campaignId):Wt(this.adUnit,this.banner.campaignId))},loadBanner:async function(t,e,r){let i=this.dynamicNetworking?await this.zestyNetworking.fetchCampaignAd(t,e,r):await Mt(t,e,r),{asset_url:n,cta_url:s}=i.Ads[0];return WL.textures.load(n,"").then(a=>({texture:a,imageSrc:n,url:s,campaignId:i.CampaignId}))}});})();
//# sourceMappingURL=zesty-wonderland-sdk-compat.js.map
