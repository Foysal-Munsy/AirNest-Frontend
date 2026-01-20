export default function Hero() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(https://i.ibb.co.com/MDpLbTR3/airnest-hero.jpg)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">airNest</h1>
          <p className="mb-5">
            Discover unique homes and experiences around the world. Whether you
            are looking for a cozy apartment, a luxurious villa, or an
            unforgettable stay, Air Nest connects you with the perfect place to
            call home.
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
}
