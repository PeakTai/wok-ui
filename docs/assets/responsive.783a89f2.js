import{M as a,C as d,T as c,L as o,S as r,a as t,P as l,l as h,r as _,c as C,d as F}from"./index.d6887742.js";import{G as p}from"./grid.fad24c2b.js";class w extends a{constructor(u){super(u||document.createElement("div")),this.__respSize="xs",this.__pendingRender=!1,this.__cache=new d,this.__resizeListener=()=>this.render(!1),window.addEventListener("resize",this.__resizeListener)}render(u=!0,e=!1){if(e){this.__render(u);return}this.__pendingRender=!0,setTimeout(()=>{if(!!this.__pendingRender){this.__pendingRender=!1;try{this.__render(u)}catch(s){console.error(s)}}},0)}__render(u){let e="xs";const s=window.innerWidth;s>=1400?e="xxl":s>=1200?e="xl":s>=992?e="lg":s>=768?e="md":s>=576?e="sm":e="xs",(u||this.__respSize!==e)&&(this.__respSize=e,this.empty(),this.buildContent({respSize:e,windowWidth:s}))}cacheModule(u){return this.__cache.cache(u)}removeCache(u){this.__cache.remove(u)}clearCaches(){this.__cache.clear()}destroy(){window.removeEventListener("resize",this.__resizeListener),this.clearCaches(),super.destroy()}}class m extends w{constructor(){super(),this.renderCount=0,this.render()}buildContent(u){let e=2;switch(u.respSize){case"xs":e=2;break;case"sm":e=3;break;case"md":e=4;break;case"lg":e=5;break;case"xl":e=6;break;case"xxl":e=7;break}this.renderCount++,this.addChild(new o("\u54CD\u5E94\u5F0F\u6E32\u67D3"),new r("lg"),new t("\u62D6\u52A8\u6539\u53D8\u7A97\u53E3\u5927\u5C0F\u6765\u8FDB\u884C\u6D4B\u8BD5\uFF0C\u6BCF\u5F53\u9875\u9762\u5BBD\u5EA6\u8FBE\u5230\u4E00\u4E2A\u5206\u9694\u70B9\u7684\u4E34\u754C\u503C\uFF0C\u5185\u5BB9\u5C31\u4F1A\u91CD\u65B0\u6E32\u67D3"),new r,new l(`\u5F53\u524D\u662F\u7B2C ${this.renderCount} \u6B21\u6E32\u67D3\uFF0C`),new h({content:"\u7ACB\u5373\u5F3A\u5236\u6E32\u67D3\u4E00\u6B21",onClick:()=>this.render(!0,!0)}),new r,new t(`\u5F53\u524D\u7684\u54CD\u5E94\u5F0F\u5C3A\u5BF8\u4FE1\u606F\uFF1A${u.respSize}\uFF0C\u4E0B\u9762\u7F51\u7EDC\u663E\u793A\u4E3A\u6BCF\u884C ${e} \u5217`),new r,new p({cols:e,gap:_(.5),cells:[...new Array(36)].map((s,n)=>C({style:{border:`1px solid ${F().border}`,minHeight:"80px",display:"flex",alignItems:"center",justifyContent:"center"},innerText:`${u.respSize}-${n}`}))}))}}function x(){return new c(new m)}export{x as responsiveTest};
