import{c as e,P as E,A as d,i as F,b as m,g as w,T as g,D as C,L as D,S as A,H as h,r as x,B as t,s as a,d as i,e as B}from"./index.936704ca.js";let s;function l(o){c(),s=e({classNames:["wok-ui-loading"],children(u){u(e({classNames:["loading-spinner"],innerHTML:'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>'})),o&&u(new E(o))}}),s.mount(document.body)}function c(){s&&(s.destroy(),s=void 0)}function y(o){return new Promise(u=>{const n=e({classNames:["wok-ui-dialog-box"],children:[e({classNames:["dialog-content",d.SLIDE_TOP],children:[e({classNames:["dialog-body"],innerText:o}),e({classNames:["dialog-footer"],children:[e({innerText:F("confirm"),onClick(r){u(),n.destroy()}})]})]})]});n.mount(document.body)})}function p(o){return new Promise(u=>{const n=e({classNames:["wok-ui-dialog-box"],children:[e({classNames:["dialog-content",d.SLIDE_TOP],children:[e({classNames:["dialog-body"],innerText:o}),e({classNames:["dialog-footer"],children:[e({innerText:F("cancel"),onClick(r){u(!1),n.destroy()}}),e({children:[new m({text:F("confirm"),color:w().primary})],onClick(r){u(!0),n.destroy()}})]})]})]});n.mount(document.body)})}class v extends C{constructor(){super(),this.addChild(new D("\u6D88\u606F\u63D0\u793A"),new A(20),new h({gap:x(1),wrap:!0,children:[new t({text:"\u5168\u5C4F loading",onClick(u){l(),setTimeout(()=>{c()},2e3)}}),new t({text:"\u5168\u5C4F loading \u5E26\u6587\u5B57",onClick(u){l("\u6B63\u5728\u52A0\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u7B49..."),setTimeout(()=>{c()},2e3)}}),new t({type:"warning",outline:!0,text:"\u5F39\u51FA\u5F0F\u8B66\u544A\u6D88\u606F",onClick(u){a("\u8FD9\u662F\u4E00\u6761\u8B66\u544A\u6D88\u606F")}}),new t({type:"success",outline:!0,text:"\u5F39\u51FA\u5F0F\u6210\u529F\u6D88\u606F",onClick(u){i("\u64CD\u4F5C\u6210\u529F\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01")}}),new t({type:"success",outline:!0,text:"\u81EA\u5B9A\u4E49\u5F39\u51FA\u5F0F\u6D88\u606F",onClick(u){B({type:"success",text:"\u6211\u8981 5s \u624D\u4F1A\u6D88\u5931\uFF0C\u548C\u522B\u7684\u6D88\u606F\u4E0D\u4E00\u6837",duration:5e3})}}),new t({type:"warning",outline:!0,text:"\u5F3A\u5236\u4EA4\u4E92\u8B66\u544A\u6D88\u606F",onClick(u){y("\u7A0B\u5E8F\u53D1\u751F\u9519\u8BEF\uFF0C\u662F\u5426\u7EE7\u7EED").then(()=>{i("\u597D\u7684\uFF0C\u8BA9\u6211\u4EEC\u5FD8\u6389 bug \uFF0C\u7EE7\u7EED\u5176\u5B83\u64CD\u4F5C")}).catch(a)}}),new t({type:"warning",outline:!0,text:"\u5F39\u7A97\u786E\u8BA4\u6D88\u606F",onClick(u){p("\u662F\u5426\u65E0\u89C6\u98CE\u9669\uFF0C\u7EE7\u7EED\u64CD\u4F5C\uFF1F").then(n=>{n?i("\u597D\u7684\uFF0C\u8BA9\u6211\u4EEC\u5F00\u59CB\u5192\u9669\uFF01"):i("\u653E\u5F03\u4E0D\u5931\u4E3A\u4E00\u4E2A\u597D\u7684\u9009\u62E9\u3002")}).catch(a)}})]}))}}function f(){return new g(new v)}export{f as messageTest};
