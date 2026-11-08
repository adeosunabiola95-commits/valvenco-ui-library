import { playScrollExample } from "../js/scroll.js";

export default {
  title: "Scroll",
  parameters: {
    docs: {
      description: {
        component:
          "The wheel eases with a catch-up of 0.08. Linked scenes take one second to follow, on an expo curve. The header and the reveals keep their own durations.",
      },
    },
  },
};

function scrollExample() {
  const stage = document.createElement("div");
  stage.className = "scroll-stage";
  stage.id = "scroll-example";
  stage.tabIndex = 0;
  stage.setAttribute("aria-label", "Scroll example");
  stage.innerHTML = `
    <div class="scroll-content" data-scroll-content>
      <div class="scroll-bar" data-module="header">
        <span>Sample header</span>
        <span>Scroll down and it tucks away. Scroll up and it returns.</span>
      </div>

      <section class="c-hero">
        <div class="c-hero__bg" data-module="parallax" data-parallax-amount="100" aria-hidden="true"></div>
        <div class="c-hero__content container">
          <div class="c-hero__lead">
            <h2>A global organisation.</h2>
          </div>
          <div class="c-hero__foot">
            <p class="c-hero__desc">The photograph drifts behind the headline as the section moves through the screen.</p>
          </div>
        </div>
      </section>

      <article class="specimen specimen--stack">
        <div class="specimen__head container">
          <h2 class="specimen__title">Reveal</h2>
          <p>Each block starts 24px lower and eases in over 0.9s once it crosses 82% of the screen. The line draws from the left.</p>
        </div>
        <div class="container" data-module="reveal">
          <h2 data-reveal>Sections fade up as they enter.</h2>
          <p class="lede" data-reveal>The blocks ease in together, in step with the rest of the page.</p>
          <div class="rule" data-reveal-line></div>
          <div class="reveal-list">
            <p data-reveal>Scrolling down past the top of the page tucks the sample header.</p>
            <p data-reveal>Scrolling up brings the header back.</p>
            <p data-reveal>Photographs and numbers drift at their own pace.</p>
          </div>
        </div>
      </article>

      <article class="specimen specimen--stack">
        <div class="specimen__head container">
          <h2 class="specimen__title">Parallax</h2>
          <p>The frame stays put. The photograph travels inside it.</p>
        </div>
        <div class="band">
          <div class="band__frame">
            <div class="band__photo" data-module="parallax" data-parallax-amount="120"></div>
          </div>
          <p class="photo-credit">Pipes and flanges: U.S. Department of Energy. Steel pipes: W.carter, CC BY-SA 4.0.</p>
        </div>
      </article>

      <article class="specimen specimen--stack">
        <div class="specimen__head container">
          <h2 class="specimen__title">Depth</h2>
          <p>The figures fade in together, then keep moving at different speeds while the section is on screen.</p>
        </div>
        <section class="section section--stats" data-module="stats-plx">
          <div class="container">
            <ul class="stats">
              <li data-stats-plx="item" data-stats-plx-depth="0.55">
                <strong>0.4s</strong>
                <span>header slide</span>
              </li>
              <li data-stats-plx="item" data-stats-plx-depth="1">
                <strong>0.5s</strong>
                <span>button hover</span>
              </li>
              <li data-stats-plx="item" data-stats-plx-depth="1.35">
                <strong>120</strong>
                <span>pixels before the header tucks</span>
              </li>
              <li data-stats-plx="item" data-stats-plx-depth="1.7">
                <strong>0.9s</strong>
                <span>reveal duration</span>
              </li>
            </ul>
          </div>
        </section>
      </article>

      <article class="specimen specimen--stack">
        <div class="specimen__head container">
          <h2 class="specimen__title">Step wipe</h2>
          <p>Each step, from 80% to 45% of the screen, wipes the next panel open. Scroll back and it closes.</p>
        </div>
        <div class="container steps" data-module="step-list">
          <div class="steps__copy">
            <ol class="steps__list">
              <li data-step-list="content-item">
                <span>01</span>
                <div>
                  <h3>A global organisation</h3>
                  <p>The first panel is already open.</p>
                </div>
              </li>
              <li data-step-list="content-item">
                <span>02</span>
                <div>
                  <h3>Product range</h3>
                  <p>This step wipes the next panel in.</p>
                </div>
              </li>
              <li data-step-list="content-item">
                <span>03</span>
                <div>
                  <h3>Clarity and transparency</h3>
                  <p>Reversing the page reverses the panel.</p>
                </div>
              </li>
            </ol>
          </div>
          <div class="steps__stage">
            <div class="steps__visual" data-step-list="visual-item">
              <p>01</p>
              <span>Open</span>
            </div>
            <div class="steps__visual steps__visual--b" data-step-list="visual-item">
              <p>02</p>
              <span>In progress</span>
            </div>
            <div class="steps__visual steps__visual--c" data-step-list="visual-item">
              <p>03</p>
              <span>Done</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  `;
  requestAnimationFrame(() => playScrollExample(stage));
  return stage;
}

export const Rules = {
  render: () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div class="panel__intro">
        <h1 class="panel__title">Scroll</h1>
        <p class="lede">The page eases after the wheel. Photographs, numbers, and step panels catch up over a second.</p>
      </div>
      <dl class="rule-list">
        <div><dt>Wheel</dt><dd>Lenis · smooth wheel · lerp 0.08</dd></div>
        <div><dt>Catch-up</dt><dd>Parallax, stat depth, and step wipes ease for 1s · expo.out</dd></div>
        <div><dt>Header</dt><dd>Past 120px, scrolling down adds is-scrolling-down. The bar slides up over 0.4s, power3.out.</dd></div>
        <div><dt>Reveal</dt><dd>y 24 → 0 · opacity 0 → 1 · 0.9s · stagger 0.09 · once, when the block crosses 82%</dd></div>
        <div><dt>Line</dt><dd>scaleX 0 → 1 from the left edge, in the same reveal</dd></div>
        <div><dt>Parallax</dt><dd>y travels from −amount/2 to amount/2, from edge to edge. Hero 100. Band 120.</dd></div>
        <div><dt>Depth</dt><dd>Figures fade in over 0.9s, stagger 0.08, at 80%. Then they drift ±40px × depth.</dd></div>
        <div><dt>Steps</dt><dd>clip-path inset from closed to open, while the step travels from 80% to 45% of the screen</dd></div>
      </dl>
      <section class="see-example">
        <h2 class="see-example__title">See example</h2>
        <p class="lede">Scroll inside the frame. The wheel eases, the header tucks after 120px, and the scenes follow.</p>
      </section>
    `;
    root.querySelector(".see-example").append(scrollExample());
    return root;
  },
};
