/* ============================================================
   PROJECT PEEKS — a real screenshot of each prototype on the
   web and on a phone, slanted toward each other.

   The images in shots/ are genuine captures of demos.html taken
   at true device size (1280x820 and 440x956), with the demo
   page's own chrome stripped so each file holds only the app.
   The browser bar and the phone bezel are drawn in CSS here, so
   they stay crisp and pick up the page's own theme.

   Exposed on `window` on purpose. A top-level `const` is a
   lexical binding and never becomes a window property, which is
   exactly how the tech-logo marks came out blank.
   ============================================================ */
(function () {
  "use strict";

  const LABEL = {
    money:  "Manage My Money",
    quiz:   "Quizmetrix",
    shop:   "UniShop",
    chrono: "ChronoSync",
    flow:   "DocuFlow AI",
  };

  function peek(kind) {
    const name = LABEL[kind];
    if (!name) return "";

    return `
<div class="peek" aria-hidden="false">
  <div class="peek__desk">
    <span class="peek__bar"><i></i><i></i><i></i></span>
    <img src="shots/${kind}-desktop.jpg" width="680" height="436"
         alt="${name} running in a desktop browser" loading="lazy" decoding="async">
  </div>
  <div class="peek__phone">
    <img src="shots/${kind}-phone.jpg" width="300" height="652"
         alt="${name} running on a phone" loading="lazy" decoding="async">
    <span class="peek__island"></span>
  </div>
</div>`;
  }

  window.PEEK = peek;
})();
