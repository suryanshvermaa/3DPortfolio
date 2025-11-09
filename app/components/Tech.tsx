"use client";
import { technologyGroups } from "@/app/constants";
import { SectionWrapper } from "./HigherOrderComponents";
import Image from "next/image";
import { motion } from "framer-motion";

const Tech = () => {
	return (
		<div className="w-full flex flex-col gap-12">
			{technologyGroups.map((group) => (
				<section key={group.title} className="w-full">
					<h3 className="text-white text-xl font-semibold mb-6">{group.title}</h3>
					<div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
						{group.items.map((tech) => (
							<motion.div
								key={tech.name}
								whileHover={{ scale: 1.05, translateY: -2 }}
								whileTap={{ scale: 0.98 }}
								className="group bg-tertiary/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow"
							>
								<div className="relative w-14 h-14 flex items-center justify-center">
									<Image
										src={tech.icon}
										alt={tech.name}
										width={56}
										height={56}
										className="object-contain drop-shadow-sm"
									/>
								</div>
								<p className="mt-3 text-center text-sm text-secondary group-hover:text-white transition-colors">
									{tech.name}
								</p>
							</motion.div>
						))}
					</div>
				</section>
			))}
		</div>
	);
};

export default SectionWrapper(Tech, "tech");
