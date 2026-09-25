import type { Metadata } from "next";
import ImagePreview from "./ImagePreview";
import styles from "./page.module.css";
import CaseViewer from "./CaseViewer";

export const metadata: Metadata = {
  title: "Alejandro Cámara ⋅ I Build",
  robots: { index: false, follow: false },
  description:
    "A personal note to Adrián: custom hardware, a CLI, a playable game, and product design at EUIPO.",
};

const email =
  "mailto:hi@alejandrocamara.info?subject=Let%27s%20build%20something";
const imageSizes = "(max-width: 800px) calc(100vw - 48px), 750px";
const pairSizes =
  "(max-width: 540px) calc(100vw - 48px), (max-width: 800px) calc((100vw - 64px) / 2), 367px";

export default function IBuild() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Alejandro Cámara</p>
        <h1>I Build</h1>
      </header>

      <section className={styles.letter} aria-label="A note to Adrián">
        <p>Hi Adrián,</p>
        <p>
          <a
            href="https://x.com/adrianmg/status/2102919488299745319"
            target="_blank"
            rel="noopener noreferrer"
          >
            Your post about the team you’re building at XBOX
          </a>{" "}
          felt familiar. I’m a product designer, but I like to build outside the
          canvas too: a custom keyboard, a CLI tool, a playable game...
        </p>
        <p>
          At{" "}
          <abbr title="European Union Intellectual Property Office">EUIPO</abbr>
          , I work from research to final product design. Outside work, I learn
          whatever I need to make the thing myself. Here are a few examples.
        </p>
      </section>

      <nav className={styles.projectNav} aria-label="Projects">
        <div>
          <a href="#keyboard">Keyboard</a>
          <a href="#shask">CLI</a>
          <a href="#panepanic">Game</a>
          <a href="#euipo">Product work</a>
        </div>
        <div>
          <a href={email}>Let’s talk </a>
          <a href="https://alejandrocamara.info">My CV</a>
        </div>
      </nav>

      <section
        id="keyboard"
        className={styles.letter}
        aria-labelledby="keyboard-title"
      >
        <h2 id="keyboard-title">A keyboard, from cardboard to circuit board</h2>
        <p>
          I designed the PCB, had it fabricated, then modeled and 3D-printed the
          case. The result is a working split keyboard, built around my hands.
        </p>
        <figure>
          <ImagePreview
            src="/keyboard-built.jpeg"
            width={960}
            height={640}
            sizes={imageSizes}
            alt="Finished split keyboard with two angled halves and custom wrist rests"
          />
          <figcaption>
            The finished keyboard, with my PCB and printed case.
          </figcaption>
        </figure>
        <p>
          Before committing to a circuit board, I tested the key positions in
          cardboard. It let me check that my fingers rested comfortably on the
          layout before moving to fabrication.
        </p>
        <div className={styles.imagePair}>
          <figure>
            <ImagePreview
              src="/keyboard-prototype.jpg"
              width={1024}
              height={498}
              sizes={pairSizes}
              alt="Key switches arranged in a cardboard split-keyboard prototype"
            />
            <figcaption>
              Checking finger placement with a cardboard prototype.
            </figcaption>
          </figure>
          <figure>
            <ImagePreview
              src="/pcb-left.png"
              width={1479}
              height={886}
              sizes={pairSizes}
              alt="PCB layout for the left half of the keyboard"
            />
            <figcaption>Turning the layout into a circuit board.</figcaption>
          </figure>
        </div>
        <details className={styles.details}>
          <summary>Explore the case in 3D</summary>
          <CaseViewer />
          <p className={styles.caption}>
            Drag to rotate, or choose a view. Explode the model to see how the
            parts fit together.
          </p>
        </details>
        <p>
          <a href="https://github.com/alexcamlo/winsplit">
            Keyboard source on GitHub
          </a>
        </p>
      </section>

      <section
        id="shask"
        className={styles.letter}
        aria-labelledby="shask-title"
      >
        <h2 id="shask-title">shask: stay in the terminal</h2>
        <p>
          When I need help with a shell command, I don’t want to leave the
          command line. I built shask to turn a plain-language request into a
          command, right where I’m working.
        </p>
        <p>
          Getting an answer isn’t the end of the interaction: I can execute it,
          revise it, or ask shask to explain the command before I decide.
        </p>
        <figure>
          <video
            className={styles.cliDemo}
            controls
            playsInline
            preload="none"
            poster="/shask-poster.png"
            width={800}
            height={100}
            aria-label="Silent demonstration of shask in the terminal"
            aria-describedby="shask-caption"
          >
            <source src="/shask.mp4" type="video/mp4" />
            <a href="/shask.mp4">Watch the shask demonstration</a>
          </video>
          <figcaption id="shask-caption">
            A request, a suggested command, and the choice to run, revise, or
            explain it all inside the terminal. Silent demo; use fullscreen for
            a closer look.
          </figcaption>
        </figure>
        <p>
          <a href="https://github.com/alexcamlo/shask">shask on GitHub</a>
        </p>
      </section>

      <section
        id="panepanic"
        className={styles.letter}
        aria-labelledby="panepanic-title"
      >
        <h2 id="panepanic-title">
          Pane Panic: a little game you can play here
        </h2>
        <p>
          My take on the territory-capture games Qix and Gals Panic. Building
          the mechanics is one part; getting the difficulty right is another.
          Playing through it has led me to adjust the difficulty level by level.
        </p>
        <p id="game-instructions">
          <strong>
            Draw a loop to reveal the landscape. Avoid the frost wisp.
          </strong>
        </p>
        {/* Panepanic */}
        <figure>
          <iframe
            className={styles.panepanic}
            src="/panepanic/index.html"
            title="Play Pane Panic"
            aria-describedby="game-instructions game-controls"
            loading="lazy"
          />
          <figcaption id="game-controls">
            Arrow keys or WASD to move; release to stop. On touch screens, swipe
            and hold. Escape pauses the game.
          </figcaption>
        </figure>
        <p>
          <a href="https://github.com/alexcamlo/panepanic">
            Pane Panic on GitHub
          </a>
        </p>
      </section>

      <section
        id="euipo"
        className={styles.letter}
        aria-labelledby="euipo-title"
      >
        <h2 id="euipo-title">Making complex work easier</h2>
        <p>
          At the European Union Intellectual Property Office, I own research,
          product direction, interface design, and prototypes. Engineers own
          production implementation; I work with them on the interface details,
          including CSS.
        </p>
        <h3>Ten-plus databases, one review workflow</h3>
        <p>
          Users had to check more than ten databases separately. For a new
          product, we had the freedom to rethink that process and bring the
          search results into one place to review.
        </p>
        <p className={styles.outcome}>
          Users reported spending roughly half as much time on the task.
        </p>
        <figure>
          <ImagePreview
              src="/imas.png"
              width={1440}
              height={960}
              sizes={imageSizes}
              alt="Database matches and review actions brought together in a single EUIPO interface"
            />
          <figcaption>
            Results from separate sources, brought into one review. Open the
            image for a closer look.
          </figcaption>
        </figure>
        <h3>Modernizing within real constraints</h3>
        <p>
          I also work on an intellectual property operations platform used
          across EU member countries. Unlike a new product, it comes with
          existing workflows and backend constraints. Some improvements can’t be
          made in the interface alone; the design has to account for what the
          system can actually support.
        </p>
        <div className={styles.imagePair}>
          <figure>
            <ImagePreview
                src="/bo-before.png"
                width={1669}
                height={1185}
                sizes={pairSizes}
                alt="Previous interface of the intellectual property operations platform"
              />
            <figcaption>Before: the existing platform.</figcaption>
          </figure>
          <figure>
            <ImagePreview
                src="/bo-after.png"
                width={1440}
                height={1024}
                sizes={pairSizes}
                alt="Updated intellectual property operations interface with grouped case information"
              />
            <figcaption>
              After: the updated interface. Open either image to inspect it.
            </figcaption>
          </figure>
        </div>
        <details className={styles.details}>
          <summary>Another example: document creation</summary>
          <p>
            I designed tools that help users create documents from templates and
            questionnaires instead of writing them by hand.
          </p>
          <figure>
            <ImagePreview
                src="/dd-letter.png"
                width={1440}
                height={960}
                sizes={imageSizes}
                alt="Decision Desktop letter creation interface with a document preview"
              />
            <figcaption>
              Decision Desktop: from structured answers to a document.
            </figcaption>
          </figure>
        </details>
      </section>

      <section className={styles.letter} aria-labelledby="more-title">
        <h2 id="more-title">And I keep making things</h2>
        <p>
          Colorami turns photos into coloring pages, with age and style controls
          to adjust the difficulty. It works, but isn’t public yet. At home, I
          learn networking and automation with Linux and Proxmox and designed
          and printed the rack they live in.
        </p>
        <div className={styles.imagePair}>
          <div>
            <figure>
              <ImagePreview
                src="/colorami.png"
                width={1639}
                height={774}
                sizes={pairSizes}
                alt="Colorami photo-to-coloring-page tool introduction"
              />
              <figcaption>
                Colorami: coloring pages tailored to a child’s age.
              </figcaption>
            </figure>
            <figure>
              <ImagePreview
                src="/colorami-form.png"
                width={1106}
                height={1136}
                sizes={pairSizes}
                alt="Colorami’s age and style controls for generating a coloring page"
              />
              <figcaption>
                Colorami: coloring pages tailored to a child’s age.
              </figcaption>
            </figure>
          </div>
          <figure>
            <ImagePreview
              src="/home-lab.jpeg"
              width={720}
              height={960}
              sizes={pairSizes}
              alt="Home networking equipment in a custom 3D-printed rack"
            />
            <figcaption>
              A home lab in a rack I designed and printed.
            </figcaption>
          </figure>
        </div>
      </section>

      <footer>
        <p>
          As you can see, I’m a bit of a <i>culo inquieto</i>. I like learning
          enough to make an idea real and figuring out how to make it useful.
        </p>
        <p>I’d love to talk about the team and where I could contribute.</p>
        <div className={styles.signature}>
          <p>
            Thank you for your time,
            <br />
            Alejandro Cámara
          </p>
        </div>
      </footer>
    </main>
  );
}
