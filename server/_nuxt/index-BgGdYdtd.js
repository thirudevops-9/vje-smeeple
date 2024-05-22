import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import { _ as _export_sfc, u as useHead } from "../server.mjs";
import { _ as __nuxt_component_4, a as __nuxt_component_5, b as __nuxt_component_6 } from "./Icon_Chat-DG_Df7u-.js";
import "#internal/nitro";
import "ofetch";
import "hookable";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "ufo";
import "defu";
import "klona";
import "devalue";
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<a${ssrRenderAttrs(mergeProps({
    class: "cta-primary",
    href: "https://app.smeeple.com/experts/create-account",
    target: "_blank"
  }, _attrs))}>Expert signup</a>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ctas/CTA_Expert_Signup.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _imports_0 = "" + __publicAssetsURL("assets/img/img-create-profile.png");
const _imports_1 = "" + __publicAssetsURL("assets/img/img-download-app.png");
const _imports_2 = "" + __publicAssetsURL("assets/img/img-expert-preview.png");
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Join Our Community of 250+ Vetted Experts",
      meta: [
        { name: "description", content: "Unlock a World of Opportunity with Smeeple: Connect with Clients Anywhere, Earn Extra Income, and Expand Your Network, All While Saving Time and Travel Expenses Through the Convenience of Virtual Meetings." },
        { name: "keywords", content: "smeeple, experts, people, knowledge, skills, insight, download, expert, book" },
        { property: "og:title", content: "" },
        { property: "og:description", content: "" },
        { property: "og:url", content: "" }
      ],
      bodyAttrs: {
        class: "bg-gray-darker"
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CTA_Expert_Signup = __nuxt_component_0;
      const _component_Icon_People = __nuxt_component_4;
      const _component_Icon_Calendar = __nuxt_component_5;
      const _component_Icon_Chat = __nuxt_component_6;
      _push(`<!--[--><section class="relative -mt-[141px] flex items-center bg-[#111111] bg-[url(&#39;/assets/img/bg-shapes-gray.png&#39;)] md-max:pb-0 lg:py-12"><div class="container sm-max:pb-6 sm-max:pt-10 md:py-12 md-max:mt-5 lg:mt-8"><div class="sm:grid sm:grid-cols-12 xl:items-center xl:gap-9 2xl:gap-12"><div class="sm:col-span-12 xl:col-span-6"><h1 class="mb-0 pb-2 text-white sm-max:text-40 sm-max:leading-[1.2] md:text-[60px] md:leading-none lg:text-[72px] xl:text-[60px] 2xl:text-[72px]">Join our community of <span class="font-medium text-blue-light">250+</span> <span class="font-medium text-green-light">vetted</span> <span class="font-medium text-orange-light">experts</span></h1><p class="mt-3 text-white">Connect with clients from anywhere. Earn extra income and grow your network, all while saving time and travel expenses. Experience the convenience of virtual meetings when you unlock a world of opportunity with Smeeple.</p><div class="mt-5 lg-max:hidden">`);
      _push(ssrRenderComponent(_component_CTA_Expert_Signup, null, null, _parent));
      _push(`</div></div><div class="sm:col-span-12 lg-max:mt-5 xl:col-span-6"><div class="embed-responsive embed-responsive-16by9 relative w-full overflow-hidden rounded-lg pt-[56.25%]"><iframe class="embed-responsive-item absolute bottom-0 left-0 right-0 top-0 h-full w-full" src="https://www.youtube-nocookie.com/embed/A2z_zUy9ats?mode=opaque&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;wmode=transparent" title="Signing up as an Expert is easy!" allowfullscreen></iframe></div><div class="mt-6 xl:hidden">`);
      _push(ssrRenderComponent(_component_CTA_Expert_Signup, null, null, _parent));
      _push(`</div></div></div></div><div class="scroll-indicator lg-max:hidden"><span class="scroll-mouse"><span class="scroll-wheel"></span></span></div></section><section class="sm-max:pb-2 sm:md-max:pt-6 lg:pb-0"><div class="container"><div class="grid text-center xs-max:gap-y-4 sm:grid-cols-12 sm:gap-y-6 lg:gap-6 2xl:gap-12"><div class="flex flex-col items-center sm:col-span-12 lg:col-span-4">`);
      _push(ssrRenderComponent(_component_Icon_People, { class: "mb-2 fill-transparent stroke-orange-light stroke-[3px]" }, null, _parent));
      _push(`<h3 class="mb-3">The platform</h3><p>Everything built into one platform, eliminating the need for multiple apps, payment systems, and calendars — allowing you to focus on sharing your expertise and earning, with ease.</p></div><div class="flex flex-col items-center sm:col-span-12 lg:col-span-4">`);
      _push(ssrRenderComponent(_component_Icon_Calendar, { class: "mb-2 fill-transparent stroke-orange-light stroke-[3px]" }, null, _parent));
      _push(`<h3 class="mb-3">Our community</h3><p>Maybe you&#39;re a Division 1 athlete, a retired plumber, or even a small business owner. With Smeeple, we can bring expertise to the consumers who need it — within reach of their mobile device.</p></div><div class="flex flex-col items-center sm:col-span-12 lg:col-span-4">`);
      _push(ssrRenderComponent(_component_Icon_Chat, { class: "mb-2 fill-transparent stroke-orange-light stroke-[3px]" }, null, _parent));
      _push(`<h3 class="mb-3">Your schedule</h3><p>Smeeple will never impose on your pricing or schedules with consumers. We ask that you maintain professionalism, and give your best effort. We aim to build a community, not just a business.</p></div></div></div></section><section class="sm-max:pb-3 sm-max:pt-6 md:pb-3"><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="col-span-12 text-center"><h2 class="mb-8 inline-block -rotate-3 -skew-x-6 rounded-lg bg-green-light px-2 text-white">How it works</h2></div></div><div class="mb-8 grid sm:grid-cols-12 lg:items-center lg:gap-6 2xl:gap-12"><div class="sm:col-span-12 md-max:order-2 lg:col-span-6 2xl:col-span-7"><img class="shadow-lg shadow-black/30 md-max:mt-4"${ssrRenderAttr("src", _imports_0)} alt="Expert signup page"></div><div class="sm:col-span-12 md-max:text-center lg:col-span-6 2xl:col-span-5"><h3 class="mb-3">Create a profile</h3><p>Our process to become an expert is streamlined and guides you through each step. We&#39;ve made the process straightforward, to facilitate a swift onboarding of our experts onto the Smeeple platform, integrating them promptly into our expert community.</p></div></div><div class="mb-8 grid sm:grid-cols-12 lg:items-center lg:gap-6 2xl:gap-12"><div class="sm:col-span-12 md-max:text-center lg:col-span-6 2xl:col-span-5"><h3 class="mb-3">Download the app</h3><p>Download Smeeple from either app store, to explore the wide variety of experts in our community. Share your profile and engage in video sessions without the need for additional software. Enjoy direct video connections with consumers right within the app.</p></div><div class="sm:col-span-12 md-max:order-2 lg:col-span-6 2xl:col-span-7"><img class="shadow-lg shadow-black/30 md-max:mt-4"${ssrRenderAttr("src", _imports_1)} alt="Smeeple app on the Apple App Store"></div></div><div class="mb-8 grid sm:grid-cols-12 lg:items-center lg:gap-6 2xl:gap-12"><div class="sm:col-span-12 md-max:order-2 lg:col-span-6 2xl:col-span-7"><img class="shadow-lg shadow-black/30 md-max:mt-4"${ssrRenderAttr("src", _imports_2)} alt="Expert profile preview"></div><div class="sm:col-span-12 md-max:text-center lg:col-span-6 2xl:col-span-5"><h3 class="mb-3">Share your profile</h3><p>Amplify the reach of your services by sharing your profile and our platform within your network. Join us in promoting Smeeple, to help extend our collective expertise across the world.</p></div></div></div></section><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/for-experts/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-BgGdYdtd.js.map
