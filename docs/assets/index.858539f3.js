import{D as f,k as y,l,A as c,c as t,s as n,B as h,i as u}from"./index.936704ca.js";class k extends f{constructor(e){super("wok-ui-modal"),this.opts=e}addDialog(e){e.onDestroy(()=>{this.getChildren().length===0&&this.destroy()}),this.addChild(e)}async closeAllModals(){const e=this.getChildren();for(const s of e)await s.close()}removeChild(e){const s=super.removeChild(e);return this.getChildren().length===0&&this.destroy(),s}destroy(){super.destroy(),this.opts.onDestroy()}}class w extends f{constructor(e){if(super("wok-ui-modal-dialog",y),this.opts=e,this.callbacked=!1,l({el:this.el,animation:c.SLIDE_TOP,duration:300}),e.fullscreen?this.el.classList.add("fullscreen"):e.dialogCentered&&this.el.classList.add("centered"),this.el.addEventListener("click",s=>{s.stopPropagation(),this.tryDestroy()}),e.replaceByBody){this.addChild(t({classNames:["wok-ui-modal-content"],children:[e.body]}));return}this.addChild(t({classNames:["wok-ui-modal-content","normal"],style:{borderRadius:e.borderRadius&&e.borderRadius>0?`${e.borderRadius}px`:void 0,width:e.fullscreen?void 0:e.width&&e.width>0?`${e.width}px`:"500px"},onClick(s){s.stopPropagation()},children:s=>{if(e.title&&s(t({classNames:["wok-ui-modal-header"],children:i=>{i(t({classNames:["title"],innerText:e.title})),e.closeBtn!==!1&&i(t({classNames:["close"],innerHTML:"&times;",onClick:()=>{this.close().catch(n)}}))}})),s(t({classNames:["wok-ui-modal-body"],children:[e.body]})),e.footer)s(e.footer);else if(e.buttons&&(e.buttons.cancel||e.buttons.confirm)){const{confirm:i,cancel:a}=e.buttons;s(t({classNames:["wok-ui-modal-footer"],children:d=>{i&&d(new h({text:typeof i=="string"?i:u("confirm"),type:"primary",onClick(m){e.onConfirm&&e.onConfirm()}})),a&&d(new h({text:typeof a=="string"?a:u("cancel"),onClick:m=>this.close().catch(n)}))}}))}}}))}tryDestroy(){if(this.opts.staticBackDrop){l({el:this.el,animation:c.SHAKE}).catch(n);return}this.close().catch(n)}onDestroy(e){this.destroyListener=e}async close(){await l({el:this.el,animation:c.SLIDE_TOP,duration:300,reverse:!0}),this.destroy(),this.destroyListener&&this.destroyListener(),this.opts.onClose&&!this.callbacked&&(this.opts.onClose(),this.callbacked=!0)}}let o;function g(r){o||(o=new k({onDestroy:()=>o=void 0}),o.mount(document.body));const e=new w(r);return o.addDialog(e),{close:()=>e.close()}}export{g as s};
