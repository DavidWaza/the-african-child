'use client'
import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const Reason = () => {
  const sectionRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress into Y and X translations + rotation for images
  const yImage1 = useTransform(scrollYProgress, [0, 1], [100, -100]); // Top image moves up
  const xImage1 = useTransform(scrollYProgress, [0, 1], [50, -50]); // Top image shifts left-right
  const yImage2 = useTransform(scrollYProgress, [0, 1], [-100, 100]); // Bottom image moves down
  const xImage2 = useTransform(scrollYProgress, [0, 1], [-50, 50]); // Bottom image shifts right-left

  return (
    <section className="py-20 pattern-header" ref={sectionRef}>
      <div className="lg:min-w-28 mx-auto py-10 px-6 sm:px-12 md:px-20 lg:px-32 relative">
        <div className="rounded-lg bg-[#337463] lg:w-[60rem] mx-auto py-10 px-6 md:px-20 lg:p-32 pattern-bg relative">
          {/* Animated Image 1 (Top) */}
          <motion.div
            style={{
              y: yImage1,
              x: xImage1,
              rotate: 10,
              // transition: { ease: "easeOut", duration: 0.3 },
            }}
            className="absolute top-[-90px] left-10 z-10"
          >
            <Image
              src={"/assets/student.jpg"}
              alt="img"
              width={224}
              height={224}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="rounded-lg h-auto w-40 object-center object-contain hidden md:block"
            />
          </motion.div>
          {/* Animated Image 2 (Bottom) */}
          <motion.div
            style={{
              y: yImage2,
              x: xImage2,
              rotate: -10,
              // transition: { ease: "easeOut", duration: 0.3 },
            }}
            className="absolute bottom-[-50px] right-10 z-10"
          >
            <Image
              src={"/assets/smiling-kids.jpg"}
              alt="img"
              width={224}
              height={224}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="rounded-lg h-auto w-56 object-center object-contain hidden md:block"
            />
          </motion.div>
          <div className="flex justify-center">
            <h1 className="uppercase text-balance bg-[#ED8836] text-sm py-1 px-3.5 rounded-md font-medium">
              Why we do this?
            </h1>
          </div>
          <div className="text-center my-5">
            <p className="text-lg md:text-2xl lg:text-4xl font-bold">
              45 Million <span className="text-yellow-400">Children</span>{" "}
              Across 37 states are at Risk of{" "}
              <span className="text-yellow-400">Uneducation</span>
            </p>
          </div>
          <div className="py-10 text-balance">
            <p>
              Education is a fundamental right of every child. It is the
              foundation for a better future and a powerful tool for breaking
              the cycle of poverty. However, millions of children around the
              world are still denied this basic right. Understanding the reasons
              why children are not in school is the first step toward solving
              the problem—and as an NGO committed to change, we have a crucial
              role to play in ensuring every child has access to quality
              education.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="text-balance">
              <p>
                One of the most significant barriers to education is poverty.
                Many families simply cannot afford the costs associated with
                schooling, such as tuition fees, uniforms, books, and
                transportation. In households where survival is a daily
                struggle, children are often required to work or help at home,
                leaving little to no opportunity for formal education. The
                burden of poverty extends beyond finances; it creates
                environments where education is not prioritized because
                immediate needs take precedence.
              </p>
              <p className="py-5">
                In many rural and underserved areas, physical access to schools
                is a major issue. Some children live miles away from the nearest
                school, and the journey can be long, dangerous, or even
                impossible, especially for girls. Where schools do exist, they
                are often poorly funded, overcrowded, and lacking in basic
                facilities and trained teachers. The absence of safe and
                supportive learning environments discourages both children and
                their families from pursuing education.
              </p>
            </div>
            <div className="text-balance">
              <p>
                Despite these challenges, our NGO can play a vital role in
                making education accessible to every child. We can provide
                scholarships to cover tuition and related costs, easing the
                financial burden on families. By distributing school supplies
                and uniforms, we help remove the barriers that often prevent
                children from attending school regularly. Our efforts can also
                include building or renovating schools in remote communities,
                ensuring that every child has a safe and welcoming place to
                learn.
              </p>
              <p className="py-5">
                Beyond infrastructure, our work involves engaging with local
                communities to raise awareness about the value of education for
                all children, including girls and those with disabilities. We
                can challenge harmful cultural practices and advocate for equal
                opportunities through outreach and sensitization programs. In
                regions affected by conflict or displacement, we can offer
                alternative learning solutions such as mobile classrooms,
                radio-based lessons, or digital education platforms to ensure
                that learning continues in times of crisis. Our commitment to
                inclusive education can be reflected in the training we provide
                to teachers and the resources we invest in making classrooms
                accessible to children with diverse needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reason;