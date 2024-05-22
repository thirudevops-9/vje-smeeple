import { l as useRequestEvent, m as useRoute, u as useHead, n as __nuxt_component_0, o as __nuxt_component_1 } from "../server.mjs";
import { getRequestURL } from "h3";
import { useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import "#internal/nitro";
import "ofetch";
import "hookable";
import "unctx";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "ufo";
import "defu";
import "klona";
import "devalue";
function useRequestURL() {
  {
    return getRequestURL(useRequestEvent());
  }
}
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const url = useRequestURL();
    const baseUrl = url.protocol + "//" + url.host;
    useHead({
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | Smeeple` : "Smeeple";
      },
      bodyAttrs: {
        class: "bg-blue-dark"
      },
      link: [
        {
          rel: "canonical",
          href: `${baseUrl + route.path}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = __nuxt_component_0;
      const _component_Footer = __nuxt_component_1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      _push(`<main class="bg-white bg-[url(&#39;/assets/img/bg-dot.png&#39;)]">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=default-PEXSSTOM.js.map
