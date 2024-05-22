import { u as useHead } from "../server.mjs";
import { useSSRContext } from "vue";
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
import "vue/server-renderer";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "About Smeeple",
      meta: [
        { name: "description", content: "Unlock Expertise: Say Goodbye to Generic Tutorials, Hello to Tailored Solutions with Smeeple!" },
        { name: "keywords", content: "about us, about smeeple, smeeple, experts, people, expert, book" },
        { property: "og:title", content: "" },
        { property: "og:description", content: "" },
        { property: "og:url", content: "" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><section class="flex items-center bg-blue-dark bg-[url(&#39;/assets/img/bg-shapes-blue.png&#39;)] md-max:-mt-[92px] md-max:pt-[132px] lg:-mt-[141px] lg:pt-[221px]"><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="sm:col-span-12 xl:col-span-10 xl:col-start-2"><h1 class="mb-0">About Smeeple</h1></div></div></div></section><section><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="sm:col-span-12 lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3"><h2>Introduction</h2><div class="embed-responsive embed-responsive-16by9 relative mb-6 w-full overflow-hidden rounded-lg pt-[56.25%]"><iframe class="embed-responsive-item absolute bottom-0 left-0 right-0 top-0 h-full w-full" src="https://www.youtube-nocookie.com/embed/k6UZPlgQg84?mode=opaque&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;wmode=transparent" title="Signing up as an Expert is easy!" allowfullscreen></iframe></div><h2>Need solutions to unique problems?</h2><p>You&#39;re not alone. We&#39;ve all found ourselves puzzled by various topics at different points in our lives. It could be something as seemingly simple as a leaky faucet that just won&#39;t stop dripping, no matter what you try. Or perhaps it&#39;s the elusive perfect golf swing that you&#39;ve been striving to master, spending countless hours at the driving range with little to no improvement. It could even be the quest for the ideal skincare routine that suits your unique skin type, a routine that balances hydration and oil control, and combats the signs of aging without causing breakouts.</p><p>While the internet is a vast resource filled with tutorials, articles, and advice, it can often be overwhelming and impersonal. The information available might not always be reliable or specific to your situation. Online resources, while helpful, can&#39;t always provide the tailored advice or the answers we need. They lack the personal touch of a human expert who can understand your specific situation, provide customized advice, and guide you through the process. This is where the value of personalized expert advice truly shines.</p><p>This is why Smeeple was created. Our expert community from a wide variety of fields, from DIY endeavors to sports coaching, home decoration, and more. With a few simple clicks, you can engage in a live connection with an expert capable of assisting you in resolving your issue. Say goodbye to infinite searches and generic guidance. Obtain customized solutions that cater to your needs with Smeeple.</p><p>At Smeeple, we believe everyone is entitled to dependable, personalized solutions for their distinct challenges. This is why we are dedicated to creating a community of experts, enabling you to find the assistance that best suits your needs. Our platform is user-friendly and accessible from any location, providing you with the answers you require at your convenience. Irrespective of your current knowledge level on the subject, our experts are ready to guide you through every stage. Become a part of Smeeple today and begin resolving your issues with the support of our exceptional community of experts.</p><h4 class="mt-2"> Thank you for being part of our story, <br> Calvin &amp; Josh </h4></div></div></div></section><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about-smeeple/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DszDKjuN.js.map
