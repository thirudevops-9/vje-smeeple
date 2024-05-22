import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const _sfc_main$2 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "64",
    height: "64",
    viewBox: "0 0 64 64"
  }, _attrs))}><path d="M21.427,27.439 C20.464,25.41,18.395,24,16,24H8c-3.314,0-6,2.686-6,6v8l4,2l1,14h11"></path><circle cx="12" cy="12" r="6"></circle><path d="M42.573,27.439 C43.536,25.41,45.605,24,48,24h8c3.314,0,6,2.686,6,6v8l-4,2l-1,14H46"></path><circle cx="52" cy="12" r="6"></circle><path d="M38,62H26l-1-16l-5-1V32 c0-4.418,3.582-8,8-8h8c4.418,0,8,3.582,8,8v13l-5,1L38,62z"></path><circle cx="32" cy="10" r="8"></circle></svg>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_People.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "64",
    height: "64",
    viewBox: "0 0 64 64"
  }, _attrs))}><line x1="60" y1="23" x2="4" y2="23"></line><path d="M29,56H9c-2.761,0-5-2.239-5-5V14c0-2.761,2.239-5,5-5H55c2.761,0,5,2.239,5,5v20"></path><line x1="17" y1="3" x2="17" y2="15"></line><line x1="47" y1="3" x2="47" y2="15"></line><circle cx="47" cy="49" r="12"></circle><polyline points="47 42 47 49 54 49"></polyline></svg>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Calendar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "64",
    height: "64",
    viewBox: "0 0 64 64"
  }, _attrs))}><polygon points=" 62,2 28,2 28,30 38,22 62,22 "></polygon><circle cx="50" cy="36" r="6"></circle><circle cx="14" cy="36" r="6"></circle><path d="M26,60v-5.965 c0-1.42-0.745-2.726-1.967-3.449C22.088,49.435,18.716,48,14,48c-4.777,0-8.127,1.426-10.052,2.575C2.736,51.299,2,52.601,2,54.013 V60H26z"></path><path d="M62,60v-5.965 c0-1.42-0.745-2.726-1.967-3.449C58.088,49.435,54.716,48,50,48c-4.777,0-8.127,1.426-10.052,2.575 C38.736,51.299,38,52.601,38,54.013V60H62z"></path></svg>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Chat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __nuxt_component_4 as _,
  __nuxt_component_5 as a,
  __nuxt_component_6 as b
};
//# sourceMappingURL=Icon_Chat-DG_Df7u-.js.map
