import{D as d,j as c,s as r,h,k as s,A as i,T as E,L as C,S as m,H as p,B as u,r as F}from"./index.d6887742.js";class B extends d{constructor(e){super("wok-ui-drawer"),this.opts=e,this.el.addEventListener("click",()=>{const t=this.getChildren();t.length&&t[t.length-1].destroy()}),this.escapeCloseListener=t=>{if(t.key==="Escape"){const a=this.getChildren();a.length&&a[a.length-1].destroy()}},document.addEventListener("keydown",this.escapeCloseListener),this.docChangeCloseListener=()=>this.empty(),window.addEventListener("popstate",this.docChangeCloseListener)}addContent(e){e.onDestroy(()=>{this.getChildren().length===0&&this.destroy()}),this.addChild(e)}mount(e){super.mount(e),document.body.classList.add("wok-ui-drawer-lock-scroll")}destroy(){document.removeEventListener("keydown",this.escapeCloseListener),window.removeEventListener("popstate",this.docChangeCloseListener),document.body.classList.remove("wok-ui-drawer-lock-scroll"),super.destroy(),this.opts.onDestroy()}}class D extends d{constructor(e){if(super("wok-ui-drawer-content",c),this.opts=e,this.callbacked=!1,this.leaveAnimating=!1,this.el.addEventListener("click",t=>t.stopPropagation()),e.placement==="left"?this.el.classList.add("left"):e.placement==="top"?this.el.classList.add("top"):e.placement==="bottom"?this.el.classList.add("bottom"):this.el.classList.add("right"),this.enter().catch(r),e.replaceByBody){this.addChild(...h(e.body));return}e.title&&this.addChild({classNames:["header"],children:[{classNames:["title"],innerText:e.title},{classNames:["close"],innerHTML:"&times;",onClick:()=>this.destroy()}]}),this.addChild({classNames:["body"],children:e.body})}enter(){return this.opts.placement==="left"?s({el:this.el,animation:i.SLIDE_LEFT}):this.opts.placement==="top"?s({el:this.el,animation:i.SLIDE_TOP}):this.opts.placement==="bottom"?s({el:this.el,animation:i.SLIDE_BOTTOM}):s({el:this.el,animation:i.SLIDE_RIGHT})}async leave(){this.leaveAnimating=!0;try{this.opts.placement==="left"?await s({el:this.el,animation:i.SLIDE_LEFT,reverse:!0}):this.opts.placement==="top"?await s({el:this.el,animation:i.SLIDE_TOP,reverse:!0}):this.opts.placement==="bottom"?await s({el:this.el,animation:i.SLIDE_BOTTOM,reverse:!0}):await s({el:this.el,animation:i.SLIDE_RIGHT,reverse:!0})}finally{this.leaveAnimating=!1}}onDestroy(e){this.destroyListener=e}destroy(){this.leaveAnimating||this.leave().then(()=>{super.destroy(),this.destroyListener&&this.destroyListener(),this.opts.onClose&&!this.callbacked&&(this.opts.onClose(),this.callbacked=!0)})}}let l;function n(o){l||(l=new B({onDestroy:()=>l=void 0}),l.mount(document.body));const e=new D(o);return l.addContent(e),{close:()=>e.destroy()}}class y extends d{constructor(){super(),this.addChild(new C("\u62BD\u5C49"),new m(20),new p({gap:16,wrap:!0,children:[new u({text:"\u53F3\u4FA7\u5F39\u51FA\u62BD\u5C49",onClick(e){n({title:"\u53F3\u4FA7\u5F39\u51FA\u7684\u62BD\u5C49",placement:"right",body:"\u53F3\u4FA7\u5F39\u51FA\u7684\u62BD\u5C49",onClose(){r("\u62BD\u5C49\u5173\u95ED\u4E86")}})}}),new u({text:"\u5E95\u90E8\u5F39\u51FA\u62BD\u5C49",onClick(e){n({title:"\u5E95\u90E8\u5F39\u51FA\u7684\u62BD\u5C49",placement:"bottom",body:"\u5E95\u90E8\u5F39\u51FA\u7684\u62BD\u5C49"})}}),new u({text:"\u9876\u90E8\u5F39\u51FA\u62BD\u5C49",onClick(e){n({title:"\u9876\u90E8\u5F39\u51FA\u7684\u62BD\u5C49",placement:"top",body:"\u9876\u90E8\u5F39\u51FA\u7684\u62BD\u5C49"})}}),new u({text:"\u9876\u90E8\u5F39\u51FA\u65E0\u6807\u9898\u62BD\u5C49",onClick(e){n({placement:"top",body:"\u9876\u90E8\u5F39\u51FA\u65E0\u6807\u9898\u7684\u62BD\u5C49"})}}),new u({text:"\u5F00\u542F\u591A\u4E2A\u62BD\u5C49",onClick(e){n({title:"\u8FD9\u662F\u7B2C\u4E00\u4E2A",placement:"right",body:new u({text:"\u70B9\u51FB\u4ECE\u5DE6\u8FB9\u518D\u5F00\u4E00\u4E2A",onClick(t){n({title:"\u7B2C\u4E8C\u4E2A\u62BD\u5C49",placement:"left",body:"\u70B9\u51FB\u80CC\u666F\u4F1A\u6309\u7167\u5F00\u542F\u7684\u987A\u5E8F\u5012\u5E8F\u9010\u4E2A\u5173\u95ED\u62BD\u5C49"})}})})}}),new u({text:"\u81EA\u5B9A\u4E49\u5173\u95ED\u6309\u94AE",onClick(e){const t=n({title:"\u81EA\u5B9A\u4E49\u5173\u95ED\u6309\u94AE",placement:"right",body:new u({text:"\u70B9\u51FB\u5173\u95ED\u62BD\u5C49",type:"warning",onClick(a){t.close()}}),onClose(){r("\u62BD\u5C49\u5173\u95ED\u4E86")}})}}),new u({text:"\u5B8C\u5168\u81EA\u5B9A\u4E49",onClick(e){const t=n({title:"\u6807\u9898\u4E0D\u4F1A\u663E\u793A\u51FA\u6765",placement:"right",replaceByBody:!0,body:{style:{background:"white",height:"100%",display:"flex",flexDirection:"column",gap:"1rem",alignItems:"center",justifyContent:"center"},children:["\u8FD9\u91CC\u662F\u5B8C\u5168\u81EA\u5B9A\u4E49\u7684\u5185\u5BB9",F(1),new u({text:"\u70B9\u51FB\u5173\u95ED\u7A97\u53E3",onClick:()=>t.close()})]},onClose(){r("\u62BD\u5C49\u5173\u95ED\u4E86")}})}})]}),{style:{height:"1500px"}})}}function A(){return new E(new y)}export{A as drawerTest};
