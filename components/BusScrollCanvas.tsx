"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface BusScrollCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function BusScrollCanvas({ containerRef }: BusScrollCanvasProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Opacity curves designed for beautiful cross-fades between the 5 custom cinematic scenes
  const opacity1 = useTransform(scrollYProgress, [0.0, 0.18, 0.23], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.18, 0.23, 0.44, 0.49], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.44, 0.49, 0.70, 0.75], [0, 1, 1, 0]);
  const opacity4 = useTransform(scrollYProgress, [0.70, 0.75, 0.84, 0.89], [0, 1, 1, 0]);
  const opacity5 = useTransform(scrollYProgress, [0.84, 0.89, 0.97, 1.0], [0, 1, 1, 0]);

  // Subtle zoom/scale effect on the active scene for dynamic visual energy
  const scale1 = useTransform(scrollYProgress, [0.0, 0.23], [1.0, 1.06]);
  const scale2 = useTransform(scrollYProgress, [0.18, 0.49], [1.0, 1.06]);
  const scale3 = useTransform(scrollYProgress, [0.44, 0.75], [1.0, 1.06]);
  const scale4 = useTransform(scrollYProgress, [0.70, 0.89], [1.0, 1.06]);
  const scale5 = useTransform(scrollYProgress, [0.84, 1.0], [1.0, 1.06]);

  const scenes = [
    { id: 1, src: "/images/bus/scene1.png", opacity: opacity1, scale: scale1, alt: "Kerala golden hour aerial view" },
    { id: 2, src: "/images/bus/scene2.png", opacity: opacity2, scale: scale2, alt: "Kerala glowing network GPS data trails" },
    { id: 3, src: "/images/bus/scene3.png", opacity: opacity3, scale: scale3, alt: "Bus at intersection with gold GPS ping concentric rings" },
    { id: 4, src: "/images/bus/scene4.png", opacity: opacity4, scale: scale4, alt: "Green KSRTC bus on Kerala highway" },
    { id: 5, src: "/images/bus/scene5.png", opacity: opacity5, scale: scale5, alt: "Bus interior smart timeline displays" },
  ];

  return (
    <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10 bg-black">
      {scenes.map((scene) => (
        <motion.div
          key={scene.id}
          style={{ opacity: scene.opacity, scale: scene.scale }}
          className="absolute inset-0 w-full h-full origin-center"
        >
          <Image
            src={scene.src}
            alt={scene.alt}
            fill
            className="object-cover"
            priority={scene.id === 1}
            unoptimized
          />
        </motion.div>
      ))}

      {/* Premium cinematic vignette overlay to guarantee contrast and text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/65 pointer-events-none" />
    </div>
  );
}
