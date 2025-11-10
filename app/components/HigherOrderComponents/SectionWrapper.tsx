"use client";
import { staggerContainer } from "@/app/utils/motion";
import { motion } from "framer-motion";
import type { FC } from "react";

const SectionWrapper = (Component: FC, idName: string) => {
	return function HOC() {
		return (
			<motion.div
				variants={staggerContainer()}
				initial="hidden"
				whileInView="show"
				exit="hidden"
				viewport={{ once: true, amount: 0.1 }}
				className="padding max-w-7xl mx-auto relative z-10 scroll-mt-[72px] sm:scroll-mt-24"
				id={idName}
			>
				<Component />
			</motion.div>
		);
	};
};

export default SectionWrapper;
