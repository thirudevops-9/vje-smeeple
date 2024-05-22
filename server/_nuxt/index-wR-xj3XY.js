import { mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc, u as useHead } from "../server.mjs";
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
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    height: "16",
    width: "16",
    viewBox: "0 0 16 16"
  }, _attrs))}><path d="M15,7H1C0.4,7,0,7.4,0,8s0.4,1,1,1h14c0.6,0,1-0.4,1-1S15.6,7,15,7z"></path></svg>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Minus.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    height: "16",
    width: "16",
    viewBox: "0 0 16 16"
  }, _attrs))}><path d="M15,7H9V1c0-0.6-0.4-1-1-1S7,0.4,7,1v6H1C0.4,7,0,7.4,0,8s0.4,1,1,1h6v6c0,0.6,0.4,1,1,1s1-0.4,1-1V9h6 c0.6,0,1-0.4,1-1S15.6,7,15,7z"></path></svg>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Plus.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const faqsConsumers = [
  {
    id: "c1",
    question: "What is Smeeple?",
    answer: "Smeeple is a platform that connects people to subject matter experts (SMEs), through video conferencing, to gain knowledge, skills, and insight."
  },
  {
    id: "c2",
    question: "What does Smeeple mean?",
    answer: "A SME is a subject matter expert who has built competencies in their field of expertise, through years of learning and experience. <strong>SME + PEOPLE = SMEEPLE</strong>"
  },
  {
    id: "c3",
    question: "How do I book a session with an expert?",
    answer: "Browse a category of interest, find an expert, and check their availability to find a time that works for you. Once payment is processed for the session, during checkout, you'll receive a confirmation email. Be sure to check your spam/junk folder, if you don't see it in your inbox shortly after booking."
  },
  {
    id: "c4",
    question: "What if I need to reschedule or cancel a session?",
    answer: "We understand, life happens. There's no charge if you cancel at least 4 hours before the start of the session. If you do have to cancel, you'll have the option to reschedule the same expert for a different time."
  },
  {
    id: "c5",
    question: "How do I prepare for an upcoming session?",
    answer: 'Only attachments will be able to be exchanged before the appointment. The expert may provide booking tips, which can be found in the "Meet" tab, within the mobile app.'
  },
  {
    id: "c6",
    question: "Can I communicate with the expert before a session?",
    answer: "Yes, it is important to ensure you are set up for your session. A few helpful hints:<ul class='list-disc'><li class='mb-3 indent-0'>SMEs will leave up to 5 booking tips which appear during the checkout flow.</li><li class='mb-3 indent-0'>You can leave notes during the checkout to better prepare the type of questions you will be asking the SME.</li><li class='mb-3 indent-0'>You will be able to type in a chat box and share attachments with the SME during the call.</li><li class='indent-0'>A history of the chat is available from the session once it has ended.</li></ul>"
  },
  {
    id: "c7",
    question: "Are there things I shouldn't discuss during a session?",
    answer: "Experts are here to provide you with expertise in their respective category. Stick to discussing the category you booked an appointment for, to get the most out of your session."
  },
  {
    id: "c8",
    question: "Do I need to be on WiFi?",
    answer: "To ensure a successful session, it's essential to have a stable connection over WiFi or cellular data. It's important to note that if you're using cellular data to connect, your service provider may charge you for data usage. So we recommend a WiFi connection, for the best experience and to avoid potential charges."
  },
  {
    id: "c9",
    question: "What if I run into technical issues before/during a session?",
    answer: "Verify your connection before the session starts, to ensure a smooth experience. If the call drops and you're still within your session time, you can sign back into the session."
  },
  {
    id: "c10",
    question: "Will I receive a recording or transcript of the session?",
    answer: "Video recordings, chat transcripts, and attachments will be available under the 'Past' tab of the 'Meet' section of the app."
  },
  {
    id: "c11",
    question: "How do I watch a previous session's recording?",
    answer: "For the best experience, you should download the video recording from the Smeeple App to your device."
  },
  {
    id: "c12",
    question: "What if I'm dissatisfied with a session?",
    answer: "You'll have the opportunity to review the expert after the call. We hope that each expert receives 5 stars, but we know that won't always be the case. Always be honest and fair, so that both Smeeple and consumers know more about the expert. You can also reach out to Smeeple at <a class='inline' href='mailto:support@smeeple.com'>support@smeeple.com</a>."
  },
  {
    id: "c13",
    question: "How are the experts verified?",
    answer: "Every expert goes through a vetting process, designed by Smeeple. We want to ensure the right experts are selected that can help you the best."
  },
  {
    id: "c14",
    question: "How do I refer an expert to Smeeple?",
    answer: "Send them to our <a class='inline' href='https://app.smeeple.com/experts/create-account'>expert sign-up</a> page, to create an account."
  },
  {
    id: "c15",
    question: "Can I be an expert if I live outside the United States?",
    answer: "Currently, we're not available outside the United States, but will expand platform availability to other countries in the future."
  },
  {
    id: "c16",
    question: "What payment types are accepted?",
    answer: "All standard forms of payment are accepted and processed through <a class='inline' href='https://www.stripe.com'>Stripe</a>, one of the largest online payment processing companies in the world. If an expert asks you to pay for future appointments via cash, check, or another website, please decline and let us know by emailing <a class='inline' href='mailto:support@smeeple.com'>support@smeeple.com</a>. We want to protect your privacy, and will contact the expert to resolve any confusion."
  },
  {
    id: "c17",
    question: "How is my privacy protected?",
    answer: "No private information, other than name, is shared between either party. Phone number, address, and credit card information is concealed from both sides. Our payment process is handled through <a class='inline' href='https://www.stripe.com'>Stripe</a>, one of the largest online payment processing companies in the world."
  },
  {
    id: "c18",
    question: "What are the safety guidelines?",
    answer: "Your safety is important to us, and so we ask our experts to be professional at all times. If anything makes you feel uncomfortable, email us right away at <a class='inline' href='support@smeeple.com'>support@smeeple.com</a>. We take safety very seriously, and have the ability to review all recorded sessions and written communication."
  }
];
const faqsExperts = [
  {
    id: "e1",
    question: "Is there a fee to join Smeeple?",
    answer: "Smeeple is <u>FREE</u> to join. We believe being fair is the only way to be, and so we only make money if our experts make money. We have a 10% commission fee, per booking. This rate is up to 40% lower than other industry marketplaces because we believe in building this community together. Help us by sharing Smeeple with other experts you know, so that we can win together."
  },
  {
    id: "e2",
    question: "How do I sign up as an expert?",
    answer: "Becoming an expert is very simple. We built a program that takes you step-by-step through the process. We'll only ask for details that are relevant to the platform, and ask you to agree to our <a class='inline' href='/terms-and-conditions'>terms & conditions</a>, and <a class='inline' href='/booking-policy-and-agreement'>expert agreement</a>. You'll be able to preview your profile once you build it, to ensure it's to your liking."
  },
  {
    id: "e3",
    question: "How does the verification process work?",
    answer: `As the founder once said, "Just because you played high school basketball doesn't make you an expert". We're requesting info during your profile build, to proves who you are. There are several ways to help prove you're an expert &mdash; work experience, business ownership, education, training, etc. We've simplified the verification process, and will expedite our response if you've met the necessary standards to have a profile.`
  },
  {
    id: "e4",
    question: "How long will it take for my account to be reviewed?",
    answer: "Our goal is to review your account, and have an answer, within 24-48 hours."
  },
  {
    id: "e5",
    question: "What is the difference between a private profile and a public profile?",
    answer: "We want everyone to be part of the Smeeple community. That's why all experts get access to a private profile. A select number of experts, in each category and that meet our top qualifications, have access to a public profile.<br /><br /><strong>Private</strong> - You'll be able to share your profile, book sessions, and get paid within your personal network. That means you can have video sessions with your current clients, and social media followers. We've made it easy by giving you a share feature on your profile. You can post on your social media, email, or website &mdash; helping you attract new clients too.<br /><br /><em>Example: Social media influencer connecting with followers, or a small business owner holding virtual sessions, instead of driving to the client.</em><br /><br /><strong>Public</strong> - This includes all the benefits of a private profile, but your profile is visible when customers search for experts within the Smeeple app.<br /><br /><em>Example: If someone needs a plumber and searches for listings in that category, they'll be able to find your profile.</em>"
  },
  {
    id: "e6",
    question: "What happens when someone books a session with me?",
    answer: "Once someone books a session with you, we'll send you an email notification immediately. Have your email notifications (and push notifications) on, so you don't miss any sessions. We're currently working on SMS/text notifications."
  },
  {
    id: "e7",
    question: "What if I need to reschedule or cancel a session?",
    answer: "We understand, life happens. There's no charge, to the consumer, if you cancel at least 4 hours before the start of the session. If you do have to cancel, send the consumer a message, asking them to reschedule for a different time."
  },
  {
    id: "e8",
    question: "Are there things I shouldn't discuss during a session?",
    answer: "You're there to provide expertise to the consumer. Stick to your field, to ensure the consumer (and you) get the most out of the session. We expect you to behave professionally, at all times. Those who don't will be subject to removal from our platform."
  },
  {
    id: "e9",
    question: "What happens if I'm unable to assist a consumer?",
    answer: "You have the option to refund the individual's money, and we encourage that. We started Smeeple to help others, and bring experts to people's fingertips (that's why our commission fee is the lowest in the industry). So, if you're unable to help them, offer to refund their money, and ask them to leave an honest, yet positive, review."
  },
  {
    id: "e10",
    question: "What advice do you have for receiving high ratings from consumers?",
    answer: "Treat others as you want to be treated. Give your best, prepare if necessary, and know the consumer has paid for your time. Treat it with value. Ask questions to ensure you're meeting the consumer's needs.  "
  },
  {
    id: "e11",
    question: "What if I run into technical issues before/during a session?",
    answer: "Verify your connection before the session starts, to ensure a smooth experience. If the call drops and you're still within your session time, you can sign back into the session. Offer a refund to the consumer, in the amount that seems fair for when the call dropped."
  },
  {
    id: "e12",
    question: "How do I get paid?",
    answer: `You'll receive payment every week for the sessions you've held, delivered directly to your bank account. We handle all billing and payment through <a class='inline' href='https://stripe.com'>Stripe</a>, to ensure you get paid securely and timely at no extra cost. This way you don't have to worry about accepting cash, checks, or any "I can't find my wallet." scenarios. If you don't have an account with Stripe, you'll create one during the profile building process. Stripe is used by over 3 million online websites &mdash; including Amazon, Apple, and Target.`
  },
  {
    id: "e13",
    question: "If a consumer doesn't show up, do I still get paid?",
    answer: "Yes, as long as you join the session during the scheduled time. The consumer may be running late. So don't assume they're not coming. The consumer must cancel at least 4 hours before the start of the session, to get a full refund."
  },
  {
    id: "e14",
    question: "How can I use my profile as both an expert and a consumer?",
    answer: "You can swap back and forth within the app."
  },
  {
    id: "e15",
    question: "Who can I reach out to for help with my account?",
    answer: "For Smeeple-related inquiries, contact us at <a class='inline' href='mailto:support@smeeple.com'>support@smeeple.com</a>. For payment-related inquiries, contact <a class='inline' href='https://support.stripe.com'>Stripe</a> directly."
  }
];
const __default__ = {
  data() {
    return {
      faqsConsumers,
      faqsExperts,
      openAccordion: null,
      tab: "consumers"
    };
  },
  methods: {
    toggleAccordion(id) {
      this.openAccordion = this.openAccordion === id ? null : id;
    }
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "FAQs",
      meta: [
        { name: "description", content: "What Smeeple consumers and experts have asked us? | Your Personalized Solution Hub with Expert Guidance for Every Challenge | FAQs" },
        { name: "keywords", content: "FAQ, FAQs, Expert advice, Personalized solutions, Tailored guidance, Live connection, Customized solutions, Human expert, Specific situation, Dependable advice, Wide variety of fields, User-friendly platform" },
        { property: "og:title", content: "" },
        { property: "og:description", content: "" },
        { property: "og:url", content: "" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon_Minus = __nuxt_component_0;
      const _component_Icon_Plus = __nuxt_component_1;
      _push(`<!--[--><section class="flex items-center bg-blue-dark bg-[url(&#39;/assets/img/bg-shapes-blue.png&#39;)] md-max:-mt-[92px] md-max:pt-[132px] lg:-mt-[141px] lg:pt-[221px]"><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="sm:col-span-12 xl:col-span-10 xl:col-start-2"><h1 class="mb-0">Frequently asked questions</h1></div></div></div></section><section><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="sm:col-span-12 lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3"><div class="cta-group mb-3 mt-0 flex justify-center"><button class="${ssrRenderClass([_ctx.tab === "consumers" ? "cta-tertiary" : "cta-tertiary-outline", "rounded-br-none rounded-tr-none"])}">For consumers</button><button class="${ssrRenderClass([_ctx.tab === "experts" ? "cta-tertiary" : "cta-tertiary-outline", "ml-0 mt-0 rounded-bl-none rounded-tl-none"])}">For experts</button></div><div class="${ssrRenderClass(_ctx.tab === "consumers" ? "" : "hidden")}"><h2 class="text-center">What consumers have asked us...</h2><ul class="mt-3 list-none overflow-hidden rounded-lg border border-gray"><!--[-->`);
      ssrRenderList(unref(faqsConsumers), (faq) => {
        _push(`<li class="${ssrRenderClass([{
          "border-l-[3px] border-l-green-light bg-white": _ctx.openAccordion === faq.id,
          "bg-gray-lighter": _ctx.openAccordion !== faq.id
        }, "mb-0 cursor-pointer border-t border-gray first:border-t-0 md-max:py-2 md-max:pl-[44px] md-max:pr-2 lg:py-3 lg:pl-[54px] lg:pr-3"])}"><div class="grid grid-cols-12"><div class="col-span-11"><h3 class="${ssrRenderClass([{
          "-ml-[3px]": _ctx.openAccordion === faq.id
        }, "mb-0 -indent-[24px] font-poppins text-20 font-normal text-black"])}"><span class="font-poppins text-orange-light">Q:</span> ${ssrInterpolate(faq.question)}</h3></div><div class="col-span-1 flex items-center justify-end">`);
        if (_ctx.openAccordion === faq.id) {
          _push(ssrRenderComponent(_component_Icon_Minus, null, null, _parent));
        } else {
          _push(ssrRenderComponent(_component_Icon_Plus, { w: "" }, null, _parent));
        }
        _push(`</div></div>`);
        if (_ctx.openAccordion === faq.id) {
          _push(`<div style="${ssrRenderStyle({ height: _ctx.openAccordion === faq.id ? "auto" : "0", opacity: _ctx.openAccordion === faq.id ? "1" : "0" })}" class="mt-2 transition-all duration-300"><p class="${ssrRenderClass([{
            "-ml-[3px]": _ctx.openAccordion === faq.id
          }, "-indent-[24px]"])}"><span class="font-poppins text-orange-light">A:</span> <span>${faq.answer}</span></p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div class="${ssrRenderClass(_ctx.tab === "experts" ? "" : "hidden")}"><h2 class="text-center">What experts have asked us...</h2><ul class="mt-3 list-none overflow-hidden rounded-lg border border-gray"><!--[-->`);
      ssrRenderList(unref(faqsExperts), (faq) => {
        _push(`<li class="${ssrRenderClass([{
          "border-l-[3px] border-l-green-light bg-white": _ctx.openAccordion === faq.id,
          "bg-gray-lighter": _ctx.openAccordion !== faq.id
        }, "mb-0 cursor-pointer border-t border-gray first:border-t-0 md-max:py-2 md-max:pl-[44px] md-max:pr-2 lg:py-3 lg:pl-[54px] lg:pr-3"])}"><div class="grid grid-cols-12"><div class="col-span-11"><h3 class="${ssrRenderClass([{
          "-ml-[3px]": _ctx.openAccordion === faq.id
        }, "mb-0 -indent-[24px] font-poppins text-20 font-normal text-black"])}"><span class="font-poppins text-orange-light">Q:</span> ${ssrInterpolate(faq.question)}</h3></div><div class="col-span-1 flex items-center justify-end">`);
        if (_ctx.openAccordion === faq.id) {
          _push(ssrRenderComponent(_component_Icon_Minus, null, null, _parent));
        } else {
          _push(ssrRenderComponent(_component_Icon_Plus, { w: "" }, null, _parent));
        }
        _push(`</div></div>`);
        if (_ctx.openAccordion === faq.id) {
          _push(`<div style="${ssrRenderStyle({ height: _ctx.openAccordion === faq.id ? "auto" : "0", opacity: _ctx.openAccordion === faq.id ? "1" : "0" })}" class="mt-2 transition-all duration-300"><p class="${ssrRenderClass([{
            "-ml-[3px]": _ctx.openAccordion === faq.id
          }, "-indent-[24px]"])}"><span class="font-poppins text-20 text-orange-light">A:</span> <span>${faq.answer}</span></p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div class="cta-group mt-4 flex justify-center"><button class="${ssrRenderClass([_ctx.tab === "consumers" ? "cta-tertiary" : "cta-tertiary-outline", "rounded-br-none rounded-tr-none"])}">For consumers</button><button class="${ssrRenderClass([_ctx.tab === "experts" ? "cta-tertiary" : "cta-tertiary-outline", "ml-0 mt-0 rounded-bl-none rounded-tl-none"])}">For experts</button></div></div></div></div></section><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/faqs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-wR-xj3XY.js.map
