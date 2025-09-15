import "./HeroCard.css";
import Image from "next/image";

function HeroComponent() {
  return (
    <div className="hero-component">
      <div className="hero-component__left">
        <div className="hero-component__left__wrapper">
          <p className="hero-component__left__wrapper__main-text">
            Save big on your go-to picks
          </p>
          <p className="hero-component__left__wrapper__sub-text">
            Cool stuff, cooler prices
          </p>
          <a className="hero-component__left__wrapper__call-to-action" href="">
            Treat yourself today
          </a>
        </div>
      </div>
      <div className="hero-component__right">
        <Image
          width={1000}
          height={667}
          priority
          className="hero-component__right__hero-image"
          src="/images/hero-image.webp"
          alt="A woodslice and a bird scene from Naghshe Sang."
        />
      </div>
    </div>
  );
}

export default HeroComponent;
