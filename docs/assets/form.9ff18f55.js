import{g as a,m as g,F as C,H as f,r as o,n as w,c as d,M as S,b as F,T as y,L as k,S as s,l as L,B as v}from"./index.3ebb4097.js";import{s as _}from"./index.2bb64b63.js";import{F as B}from"./form.27f4039e.js";import{F as u}from"./form-input.e4e70b88.js";import{C as h,B as c}from"./bool-checkbox.a0f65aa9.js";import{T as m}from"./text.912c2090.js";import{H as D}from"./split-box.5187aede.js";function r(l){const e=l.getFullYear(),t=l.getMonth()+1,i=l.getDate(),n=`${t}`.padStart(2,"0"),E=`${i}`.padStart(2,"0");return`${e}-${n}-${E}`}function p(l){const e=new Date(l);return isNaN(e.getTime())?void 0:e}class M extends m{constructor(e){super({required:e.required,value:e.value?r(e.value):void 0,disabled:e.disabled,placeholder:e.placeholder,size:e.size,validator(t){const i=p(t);if(!i)return e.required?{valid:!1,msg:typeof e.required=="string"?e.required:a().buildMsg("form-err-required")}:{valid:!0};if(e.min instanceof Date){if(i.getTime()<e.min.getTime())return{valid:!1,msg:a().buildMsg("form-err-min",`${r(e.min)}`)}}else if(e.min&&i.getTime()<e.min.min.getTime())return{valid:!1,msg:e.min.errMsg};if(e.max instanceof Date){if(i.getTime()>e.max.getTime())return{valid:!1,msg:a().buildMsg("form-err-max",`${r(e.max)}`)}}else if(e.max&&i.getTime()>e.max.max.getTime())return{valid:!1,msg:e.max.errMsg};return{valid:!0}},onChange(t){if(!!e.onChange){if(!t){e.onChange(void 0);return}e.onChange(p(t))}},onBlur:e.onBlur}),this.input.type="date",e.min instanceof Date?this.input.min=r(e.min):e.min&&(this.input.min=r(e.min.min)),e.max instanceof Date?this.input.max=r(e.max):e.max&&(this.input.max=r(e.max.max))}}class z extends m{constructor(e){super(e),this.input.type="color"}}class $ extends m{constructor(e){super({required:e.required,placeholder:e.placeholder,value:typeof e.value=="number"?`${e.value}`:void 0,disabled:e.disabled,size:e.size,validator(t){if(!t)return e.required?{valid:!1,msg:typeof e.required=="string"?e.required:a().buildMsg("form-err-required")}:{valid:!0};const i=parseFloat(t);if(isNaN(i))return{valid:!1,msg:a().buildMsg("form-err-number")};if(typeof e.max=="number"){if(i>e.max)return{valid:!1,msg:a().buildMsg("form-err-max",`${e.max}`)}}else if(e.max&&i>e.max.max)return{valid:!1,msg:e.max.errMsg};if(typeof e.min=="number"){if(i<e.min)return{valid:!1,msg:a().buildMsg("form-err-min",`${e.min}`)}}else if(e.min&&i<e.min.min)return{valid:!1,msg:e.min.errMsg};return e.validator?e.validator(i):{valid:!0}},onChange(t){e.onChange&&(t?e.onChange(parseFloat(t)):e.onChange(void 0))},onBlur:e.onBlur}),this.input.type="number",typeof e.max=="number"?this.input.max=`${e.max}`:e.max&&(this.input.max=`${e.max.max}`),typeof e.min=="number"?this.input.min=`${e.min}`:e.min&&(this.input.min=`${e.min.min}`)}}class q extends u{constructor(e){super(document.createElement("div")),this.textAreaopts=e,this.composing=!1,this.paddingY=0,this.textareaEl=document.createElement("textarea"),this.textareaEl.classList.add("wok-ui-input");const t=g();switch(e.size){case"lg":this.paddingY=t.textLg*.375,this.textareaEl.style.setProperty("--input-font-size",`${t.textLg}px`);break;case"sm":this.paddingY=t.textSm*.375,this.textareaEl.style.setProperty("--input-font-size",`${t.textSm}px`);break;default:this.paddingY=t.text*.375,this.textareaEl.style.setProperty("--input-font-size",`${t.text}px`);break}if(this.addChild(this.textareaEl),this.textareaEl.rows=e.rows&&e.rows>0?e.rows:3,typeof e.minLength=="number"?this.textareaEl.minLength=e.minLength:e.minLength&&(this.textareaEl.minLength=e.minLength.minLength),typeof e.maxLength=="number"?this.textareaEl.maxLength=e.maxLength:e.maxLength&&(this.textareaEl.maxLength=e.maxLength.maxLength),e.required&&(this.textareaEl.required=!0),e.value&&(this.textareaEl.value=e.value),e.disabled&&(this.textareaEl.disabled=!0),e.placeholder&&(this.textareaEl.placeholder=e.placeholder),this.textareaEl.addEventListener("compositionstart",()=>this.composing=!0),this.textareaEl.addEventListener("compositionend",()=>{this.composing=!1,this.handleChange()}),this.textareaEl.addEventListener("input",()=>{this.composing||this.handleChange()}),e.onBlur){const{onBlur:i}=e;this.textareaEl.addEventListener("blur",()=>i())}}mount(e){super.mount(e),this.textAreaopts.autoHeight&&this.textareaEl.value.trim()&&setTimeout(()=>{this.textareaEl.style.height=this.textareaEl.scrollHeight+this.paddingY*2+"px"},0),this.textAreaopts.autofocus&&setTimeout(()=>this.textareaEl.focus(),0)}focus(){this.textareaEl.focus()}setValue(e){this.textareaEl.value=e,this.handleChange()}handleChange(){this.textAreaopts.autoHeight&&this.textareaEl.value.trim()&&(this.textareaEl.style.height="auto",this.textareaEl.style.height=this.textareaEl.scrollHeight+this.paddingY*2+"px"),this.textAreaopts.onChange&&this.textAreaopts.onChange(this.textareaEl.value),this.validate()}__validate(e){if(this.textAreaopts.required&&!e)return{valid:!1,msg:typeof this.textAreaopts.required=="string"?this.textAreaopts.required:a().buildMsg("form-err-required")};if(!e)return{valid:!0};if(typeof this.textAreaopts.minLength=="number"){if(e.length<this.textAreaopts.minLength)return{valid:!1,msg:a().buildMsg("form-err-min-length",`${this.textAreaopts.minLength}`)}}else if(this.textAreaopts.minLength&&e.length<this.textAreaopts.minLength.minLength)return{valid:!1,msg:this.textAreaopts.minLength.errMsg};if(typeof this.textAreaopts.maxLength=="number"){if(e.length>this.textAreaopts.maxLength)return{valid:!1,msg:a().buildMsg("form-err-max-length",`${this.textAreaopts.maxLength}`)}}else if(this.textAreaopts.maxLength&&e.length>this.textAreaopts.maxLength.maxLength)return{valid:!1,msg:this.textAreaopts.maxLength.errMsg};return this.textAreaopts.validator?this.textAreaopts.validator(e):{valid:!0}}validate(){const e=this.__validate(this.textareaEl.value);return e.valid?(this.textareaEl.classList.remove("invalid"),this.hideInvalidFeedback()):(this.textareaEl.classList.add("invalid"),this.showInvalidFeedback(e.msg)),e.valid}setDisabled(e){this.textareaEl.disabled=e}}class A extends w{constructor(){super('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>')}}class T extends C{constructor(e){super(),this.input=e,this.el.style.overflow="hidden",this.el.style.textOverflow="ellipsis",this.el.style.wordBreak="keep-all",this.el.style.whiteSpace="nowrap",e.addEventListener("change",()=>this.render()),this.buildContent()}buildContent(){if(!this.input.files||!this.input.files.length){this.el.title="",this.addChild(new f({gap:o(.5),align:"center",children:[new A,a().buildMsg("choose-file")]}));return}const e=Array.from(this.input.files).map(t=>t.name).join(",");this.el.title=e,this.addChild(e)}}class I extends u{constructor(e){super(document.createElement("div")),this.opts=e,this.input=document.createElement("input"),this.input.type="file",this.input.accept=e.accept||"*",this.input.multiple=!!e.multiple,this.input.style.display="none",this.input.addEventListener("change",()=>this.handleChange()),this.addChild({tag:"label",classNames:"wok-ui-input",style:{cursor:"pointer"},preHandle:t=>{const i=g();switch(this.opts.size){case"lg":t.style.setProperty("--input-font-size",`${i.textLg}px`);break;case"sm":t.style.setProperty("--input-font-size",`${i.textSm}px`);break;default:t.style.setProperty("--input-font-size",`${i.text}px`);break}},children:[new T(this.input),this.input]})}__validate(){const{files:e}=this.input;if(this.opts.required&&(!e||!e.length))return{valid:!1,msg:typeof this.opts.required=="string"?this.opts.required:a().buildMsg("form-err-required")};if(!e||!e.length)return{valid:!0};if(typeof this.opts.minSelected=="number"){if(e.length<this.opts.minSelected)return{valid:!1,msg:a().buildMsg("form-err-min-files-select",`${this.opts.minSelected}`)}}else if(this.opts.minSelected&&e.length<this.opts.minSelected.minSelected)return{valid:!1,msg:this.opts.minSelected.errMsg};if(this.opts.multiple){if(typeof this.opts.maxSelected=="number"){if(e.length>this.opts.maxSelected)return{valid:!1,msg:a().buildMsg("form-err-max-files-select",`${this.opts.maxSelected}`)}}else if(this.opts.maxSelected&&e.length>this.opts.maxSelected.maxSelected)return{valid:!1,msg:this.opts.maxSelected.errMsg}}let t=0;for(const i of e)t+=i.size;if(typeof this.opts.minSize=="number"){if(t<this.opts.minSize)return{valid:!1,msg:a().buildMsg("form-err-min-size",this.formatFileSize(this.opts.minSize))}}else if(this.opts.minSize&&t<this.opts.minSize.minSize)return{valid:!1,msg:this.opts.minSize.errMsg};if(typeof this.opts.maxSize=="number"){if(t>this.opts.maxSize)return{valid:!1,msg:a().buildMsg("form-err-max-size",this.formatFileSize(this.opts.maxSize))}}else if(this.opts.maxSize&&t>this.opts.maxSize.maxSize)return{valid:!1,msg:this.opts.maxSize.errMsg};return this.opts.validator?this.opts.validator(e):{valid:!0}}handleChange(){this.opts.onChange&&this.opts.onChange(this.input.files),this.validate()}validate(){const e=this.__validate();return e.valid?(this.input.classList.remove("invalid"),this.hideInvalidFeedback()):(this.input.classList.add("invalid"),this.showInvalidFeedback(e.msg)),e.valid}formatFileSize(e){return e<1024?`${this.formatSizeNumber(e)}B`:e<1024*1024?`${this.formatSizeNumber(e/1024)}KB`:e<1024*1024*1024?`${this.formatSizeNumber(e/(1024*1024))}MB`:`${this.formatSizeNumber(e/(1024*1024*1024))}GB`}formatSizeNumber(e){const t=e.toFixed(2);return t.endsWith(".00")?t.substring(0,t.length-3):t.endsWith("0")?t.substring(0,t.length-1):t}}class H extends u{constructor(e){super(),this.opts=e,this.__values=[],this.__disabled=!1,e.value&&(this.__values=[...e.value]),e.disabled&&(this.__disabled=!0),this.addChild({classNames:["wok-ui-checkbox-group",e.inline?"inline":""],children:e.options.map(t=>d({tag:"label",classNames:["item"],children:[new h({value:t.value,status:this.__values.includes(t.value)?"checked":"unchecked",disabled:this.__disabled,onChange:i=>{if(i==="checked")this.__values.includes(t.value)||(this.__values.push(t.value),this.handleChange()),this.updateCheckboxStatus();else{const n=this.__values.indexOf(t.value);n!==-1&&(this.__values.splice(n,1),this.handleChange()),this.updateCheckboxStatus()}}}),t.label]}))}),this.updateCheckboxStatus()}updateCheckboxStatus(){if(!this.opts.maxSelected)return;const e=typeof this.opts.maxSelected=="number"?this.opts.maxSelected:this.opts.maxSelected.maxSelected;this.__values.length>=e?this.find(t=>t instanceof h).forEach(t=>{t.isChecked()||t.setDisabled(!0)}):this.find(t=>t instanceof h).forEach(t=>{t.isChecked()||t.setDisabled(!1)})}handleChange(){this.opts.onChange&&this.opts.onChange(this.__values),this.validate()}__validate(){if(!this.__values.length)return this.opts.required?{valid:!1,msg:typeof this.opts.required=="string"?this.opts.required:a().buildMsg("form-err-must-check")}:{valid:!0};if(typeof this.opts.minSelected=="number"){if(this.__values.length<this.opts.minSelected)return{valid:!1,msg:a().buildMsg("form-err-min-select",`${this.opts.minSelected}`)}}else if(this.opts.minSelected&&this.__values.length<this.opts.minSelected.minSelected)return{valid:!1,msg:this.opts.minSelected.errMsg};if(typeof this.opts.maxSelected=="number"){if(this.__values.length>this.opts.maxSelected)return{valid:!1,msg:a().buildMsg("form-err-max-select",`${this.opts.maxSelected}`)}}else if(this.opts.maxSelected&&this.__values.length>this.opts.maxSelected.maxSelected)return{valid:!1,msg:this.opts.maxSelected.errMsg};return{valid:!0}}validate(){const e=this.__validate();return e.valid?this.hideInvalidFeedback():this.showInvalidFeedback(e.msg),e.valid}setDisabled(e){this.__disabled!==e&&(this.__disabled=e,this.find(t=>t instanceof h).map(t=>t).forEach(t=>t.setDisabled(this.__disabled)))}}function N(){const l=new Date().getTime(),e=Math.floor(Math.random()*1e8);return`${l.toString(36)}${e.toString(36)}`}class x extends S{constructor(e){const t=document.createElement("input");t.type="radio",t.name=e.name,t.value=e.value,t.classList.add("wok-ui-radio"),super(t),this.input=t,e.checked&&(t.checked=!0),e.disabled&&(t.disabled=!0),e.onChecked&&(t.onchange=()=>{t.checked&&e.onChecked&&e.onChecked()})}isChecked(){return this.input.checked}setChecked(e){this.input.checked!==e&&(this.input.checked=e)}getValue(){return this.input.value}setDisabled(e){this.input.disabled=e}}class P extends u{constructor(e){super(document.createElement("div")),this.opts=e,this.value="",this.el.classList.add("wok-ui-radio-group"),this.name=N(),e.inline&&this.el.classList.add("inline"),this.addChild(...e.options.map(t=>d({tag:"label",children:[new x({name:this.name,value:t.value,checked:e.value===t.value,disabled:e.disabled,onChecked:()=>{this.value=t.value,this.opts.onChange&&this.opts.onChange(this.value),this.validate()}}),t.label]})))}__validate(){return this.value?{valid:!0}:this.opts.required?{valid:!1,msg:typeof this.opts.required=="string"?this.opts.required:a().buildMsg("form-err-must-check")}:{valid:!0}}validate(){const e=this.__validate();return e.valid?this.hideInvalidFeedback():this.showInvalidFeedback(e.msg),e.valid}setDisabled(e){this.find(t=>t instanceof x).map(t=>t).forEach(t=>t.setDisabled(e))}}class b extends u{constructor(e){super(document.createElement("div")),this.opts=e,this.addChild({tag:"select",classNames:["wok-ui-select"],postHandle:i=>{this.select=i,e.value&&(this.select.value=e.value),this.select.addEventListener("change",n=>{this.opts.onChange&&this.opts.onChange(this.select.value),this.validate()})},children:e.options.map(i=>({tag:"option",innerText:i.label,attrs:{value:i.value}}))});const t=g();switch(e.size){case"lg":this.select.style.setProperty("--select-font-size",`${t.textLg}px`);break;case"sm":this.select.style.setProperty("--select-font-size",`${t.textSm}px`);break;default:this.select.style.setProperty("--select-font-size",`${t.text}px`);break}}__validate(e){return this.opts.required&&!e?{valid:!1,msg:typeof this.opts.required=="string"?this.opts.required:a().buildMsg("form-err-required")}:{valid:!0}}validate(){const e=this.__validate(this.select.value);return e.valid?(this.select.classList.remove("invalid"),this.hideInvalidFeedback()):(this.select.classList.add("invalid"),this.showInvalidFeedback(e.msg)),e.valid}setDisabled(e){this.select.disabled=e}}class V extends u{constructor(e){if(super(document.createElement("div")),this.input=document.createElement("input"),this.input.classList.add("wok-ui-range"),this.input.type="range",this.input.min=`${e.min}`,this.input.max=`${e.max}`,typeof e.step=="number"?this.input.step=`${e.step}`:this.input.step="1",this.input.value=`${e.value}`,!e.showValue){this.addChild(this.input),this.input.addEventListener("change",()=>{this.input.title=this.input.value,e.onChange&&e.onChange(parseInt(this.input.value))});return}const t=e.showValue?new F(`${e.value}`):void 0;this.input.addEventListener("change",()=>{this.input.title=this.input.value,t&&t.setText(this.input.value),e.onChange&&e.onChange(parseInt(this.input.value))}),t?this.addChild(new D({left:this.input,right:t,gap:o(.5),fixedSide:"right"})):this.addChild(this.input)}validate(){return!0}setDisabled(e){this.input.disabled=e}}class J extends C{constructor(){super(),this.setting={autoComplete:!1,feedbackTooltip:!1},this.form={name:"",age:30,district:"\u5F90\u5BB6\u6C47",street:"",edudition:"",skills:["Java","Html","Css","Javascript"],aggree:!1,score:5,color:"",files:[]},this.nameAutoFocus=!0,this.render()}buildContent(){this.addChild(new k("\u8868\u5355"),new s(20),new f({gap:o(1),children:[new c({label:"\u81EA\u52A8\u5B8C\u6210",value:this.setting.autoComplete,onChange:e=>{this.setting.autoComplete=e,this.render()}}),new c({label:"\u60AC\u6D6E\u663E\u793A\u53CD\u9988\u4FE1\u606F",value:this.setting.feedbackTooltip,onChange:e=>{this.setting.feedbackTooltip=e,this.render()}})]}),d({tag:"hr"}),new s(20),new B({autocomplete:this.setting.autoComplete,feedbackMode:this.setting.feedbackTooltip?"tooltip":"inline",onSubmit:()=>this.handleSubmit(),children:e=>{e("\u59D3\u540D",new s("sm"),new m({autofocus:this.nameAutoFocus,required:!0,value:this.form.name,placeholder:"\u8BF7\u8F93\u5165\u59D3\u540D,2-32\u5B57\u7B26",minLength:2,maxLength:32,validator:this.checkName,onChange:t=>{const i=!!this.form.name;this.form.name=t;const n=!!this.form.name;i!==n&&(this.nameAutoFocus=!0,this.render())}}),new s,"\u5E74\u9F84",new s("sm"),new $({value:this.form.age,placeholder:"\u8BF7\u8F93\u5165\u5E74\u9F84,6-60",min:{min:6,errMsg:"\u4E0D\u80FD\u5C0F\u4E8E6\u5C81\u54E6"},max:60,required:!0,onChange:t=>this.form.age=t}),new s,"\u5165\u804C\u65E5\u671F (\u5FC5\u987B\u5148\u8F93\u5165\u59D3\u540D) ",new s("sm"),new M({value:this.form.entryDate,placeholder:"\u8BF7\u8F93\u5165\u5165\u804C\u65F6\u95F4, 90 \u5E74\u5230 23 \u5E74\u4E4B\u95F4",disabled:!this.form.name,min:new Date("1990/01/01"),max:new Date("2023/12/12"),required:!0,onChange:t=>this.form.entryDate=t}),new s,"\u4E2A\u4EBA\u4ECB\u7ECD\uFF0C100-500\u5B57",new s("sm"),new q({value:this.form.intro,minLength:100,maxLength:500,autoHeight:!0,placeholder:"\u8BF7\u8F93\u5165\u4ECB\u7ECD\u4FE1\u606F",rows:3,onChange:t=>{this.form.intro=t}}),new s,"\u884C\u653F\u533A",new s("sm"),new b({value:this.form.district,required:!0,options:[{label:"-- \u8BF7\u9009\u62E9 --",value:""},{label:"\u5F90\u5BB6\u6C47",value:"\u5F90\u5BB6\u6C47"},{label:"\u957F\u5B81\u533A",value:"\u957F\u5B81\u533A"},{label:"\u9646\u5BB6\u5634",value:"\u9646\u5BB6\u5634"}],onChange:t=>{this.form.district=t,this.render()}}),new s),this.form.district&&e("\u8857\u9053",new s("sm"),new b({value:this.form.street,options:this.form.district?[{label:"-- \u8BF7\u9009\u62E9 --",value:""},{label:`${this.form.district}-\u8857\u9053\u4E00`,value:"\u8857\u9053\u4E00"},{label:`${this.form.district}-\u8857\u9053\u4E8C`,value:"\u8857\u9053\u4E8C"},{label:`${this.form.district}-\u8857\u9053\u4E09`,value:"\u8857\u9053\u4E09"}]:[{label:"-- \u8BF7\u9009\u62E9 --",value:""}],onChange:t=>{t&&(this.form.street=t)}}),new s),e("\u989C\u8272\u504F\u597D",new s("sm"),new z({value:this.form.color,required:!0,onChange:t=>this.form.color=t}),new s,"\u53D7\u6559\u80B2\u7A0B\u5EA6",new s("sm"),new P({value:this.form.edudition,inline:!0,options:[{label:"\u5C0F\u5B66",value:"primary school"},{label:"\u521D\u4E2D",value:"junior high school"},{label:"\u9AD8\u4E2D",value:"high school"},{label:"\u4E13\u79D1",value:"junior college"},{label:"\u672C\u79D1",value:"bachelor"}],onChange:t=>this.form.edudition=t}),new s,"\u6280\u80FD\uFF08\u9009\u62E91-3\u4E2A\uFF09",new s("sm"),new H({value:this.form.skills,inline:!0,minSelected:2,maxSelected:3,options:[{label:"Java",value:"Java"},{label:"Html",value:"Html"},{label:"Css",value:"Css"},{label:"Javascript",value:"Javascript"},{label:"Nodejs",value:"Nodejs"},{label:"golang",value:"golang"},{label:"python",value:"python"},{label:"rust",value:"rust"},{label:"c",value:"c"},{label:"c++",value:"c++"},{label:"c#",value:"c#"}],onChange:t=>this.form.skills=t}),new s,"\u670D\u52A1\u8BC4\u5206",new s("sm"),new V({min:1,max:10,showValue:!0,value:this.form.score}),new s,"\u5165\u804C\u8D44\u6599\uFF08\u76F8\u5173\u8BC1\u4EF6\u626B\u63CF\u6587\u4EF6\uFF09",new s("sm"),new I({multiple:!0,minSize:1024*1024,maxSize:1024*1024*10,minSelected:2,maxSelected:5,onChange:t=>{t?this.form.files=Array.from(t).map(i=>i.name):this.form.files=[]}}),new s,new c({required:!0,value:this.form.aggree,label:{children:["\u540C\u610F\u9690\u79C1\u534F\u8BAE\u6761\u6B3E\uFF0C ",new L({content:"\u67E5\u770B\u9690\u79C1\u534F\u8BAE"})]},onChange:t=>this.form.aggree=t}),new s,new f({gap:o(1),children:[new v({type:"primary",formType:"submit",text:"\u63D0\u4EA4"}),new v({text:"\u8FD4\u56DE",onClick:()=>history.back()})]}))}})),this.nameAutoFocus&&(this.nameAutoFocus=!1)}handleSubmit(){_({title:"\u8868\u5355\u63D0\u4EA4\u6570\u636E",body:d({tag:"pre",style:{overflow:"auto"},innerText:JSON.stringify(this.form,void 0,2)})})}checkName(e){return e.match(/\s/)?{valid:!1,msg:"\u540D\u79F0\u91CC\u4E0D\u80FD\u6709\u7A7A\u683C"}:{valid:!0}}}function Q(){return new y(new J)}export{Q as formTest};
