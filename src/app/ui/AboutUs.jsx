import styles from "./AboutUs.module.css";

export default function AboutUs() {
  return (
    <section className={styles.aboutUsSection}>
      <h2 className={styles.heading}>Who We Are at Handcrafted Haven</h2>

      <div className={styles.columns}>
        <div className={styles.column}>
          <h3>Building a better marketplace</h3>
          <p>
            Handcrafted Haven is a global platform where people connect to create, discover, and share one-of-a-kind goods.
          </p>
          <p>
            We're more than just a marketplace — we’re a collective that champions small businesses, supports artisans, and promotes sustainability.
          </p>
          <p>
            Together, we're shaping a space that values creativity, fairness, and positive change.
          </p>
        </div>

        <div className={styles.column}>
          <h3>Championing small creators</h3>
          <p>
            No factories here — just passionate individuals selling what they love to make.
          </p>
          <p>
            Our platform makes it simple to connect with original creators and discover something truly unique.
          </p>
        </div>

        <div className={styles.column}>
          <h3>Shop with confidence</h3>
          <p>
            We take your privacy seriously and work hard to protect it every step of the way.
          </p>
          <p>
            Need help? Our dedicated support team is always ready to assist whenever you need it.
          </p>
        </div>
      </div>

      <div className={styles.helpCenter}>
        <span>Got a question? We're here with answers when you need them.</span>
      </div>
    </section>
  );
}
