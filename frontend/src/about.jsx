import "./about.css";
import Navbar from "./navbar";
import Footer from "./footer";

export default function About({ onNavigate }) {
  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="about-page">
        <section className="about-container">
          <h1 className="about-heading">About Metric</h1>
          <p>
            Metric was built for athletes who refuse to settle. Every fabric choice, seam, and
            silhouette is engineered to move with you, so you can focus on pushing past your limits
            instead of fighting your gear. We started in a small garage gym, testing samples
            between heavy sets and logging every tweak like it was a training program. The premise
            was simple: if it could survive our sessions, it could survive yours.
          </p>
          <p>
            Today, our process still mirrors an athlete’s cycle—plan, test, measure, refine. We
            prototype fast, punish gear with repeat washes and hard training, gather data on stretch
            recovery and moisture response, then iterate until it meets a standard we trust in our
            own training. From weightroom staples to recovery layers, the goal is straightforward:
            deliver high-performance gymwear that feels effortless, session after session, so the
            only thing you’re conscious of is your next rep.
          </p>
          <p>
            Every product run begins with function. We map real movement patterns—hinge, squat,
            press, rotate—and stress-test seams for torque. We pair lightweight, abrasion-resistant
            fabrics with reinforced stitching where barbell knurling hits most, and we balance
            compression with breathability so you feel supported, not restricted. Small details
            matter: no harsh neck tags, smooth interior finishes, and silhouettes that stay put when
            you move quickly. If a panel rides up or a stitch rubs during testing, it gets rebuilt.
          </p>
          <p>
            Sustainability is a performance spec to us, not an afterthought. We prioritize mills
            that can trace yarn origins, use recycled or low-impact materials where possible, and
            minimize excess dye baths. Packaging is kept lean to reduce waste and carbon footprint.
            Quality also reduces environmental cost—gear that lasts longer means fewer replacements
            and less landfill over time.
          </p>
          <p>
            Headquartered in the UK and shipping globally, Metric is a team of designers, athletes,
            and engineers united by a shared obsession with measurable progress. Our studio sits
            beside our training space, so feedback loops are immediate: we test a prototype in the
            morning and redesign it by evening if it misses the mark. That proximity between design
            and use keeps us honest. If it doesn’t help you move better, it doesn’t make the cut.
          </p>
          <p>
            We also partner with coaches and everyday lifters to pressure-test fit across sizes and
            body types. Feedback from novices to seasoned competitors shapes our fits and grading,
            because gear that works for everyone builds a stronger community. We’re committed to
            inclusive sizing, clear size guidance, and responsive customer support—if something
            doesn’t feel right, we’ll work to make it right.
          </p>
          <p>
            Our promise is to stay curious and transparent. We’ll keep sharing what we’re testing,
            why we choose specific fabrics, and how each drop is built. We invite you to train with
            us, critique with us, and grow with us. Metric is more than a label—it’s a benchmark you
            can measure against, and a reminder that progress is earned rep by rep.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
