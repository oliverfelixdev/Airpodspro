let svgStrokeAnimations = () => {
  const buttons = document.querySelectorAll(".parentsvg");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      const svgPaths = this.querySelectorAll(".mainsvg path");
      let tl = gsap.timeline({ repeat: 0 });
      tl.fromTo(
        svgPaths,
        { strokeDasharray: "80", strokeDashoffset: 100 },
        {
          strokeDasharray: "50, 100, 50, 100",
          strokeDashoffset: 0,
          duration: 2,
          ease: "slow(0.7,0.7,false)",
        }
      );
    });
  });
};
svgStrokeAnimations();
