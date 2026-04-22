"use client";

import { motion } from "motion/react";
import { Star, Award, ShieldCheck, MapPin } from "lucide-react";

const runners = [
  {
    id: 1,
    name: "Alex Johnson",
    university: "State University",
    rating: 4.9,
    tasks: 124,
    image: "https://i.pravatar.cc/150?u=alex",
    badge: "Elite Runner",
    color: "from-yellow-400 to-orange-500"
  },
  {
    id: 2,
    name: "Sarah Chen",
    university: "Tech Institute",
    rating: 5.0,
    tasks: 89,
    image: "https://i.pravatar.cc/150?u=sarah",
    badge: "Fastest Response",
    color: "from-blue-400 to-purple-500"
  },
  {
    id: 3,
    name: "Marcus Miller",
    university: "City College",
    rating: 4.8,
    tasks: 210,
    image: "https://i.pravatar.cc/150?u=marcus",
    badge: "Most Reliable",
    color: "from-green-400 to-emerald-600"
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    university: "Global Arts",
    rating: 4.9,
    tasks: 67,
    image: "https://i.pravatar.cc/150?u=elena",
    badge: "New Rising Star",
    color: "from-pink-400 to-rose-500"
  }
];

export const TopRunners = () => {
  return (
    <section className="py-20 bg-transparent relative overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-primary/5 blur-[10rem] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Meet Our <span className="text-primary">Top Runners</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our most trusted and efficient student runners who are making things happen across the city.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {runners.map((runner, index) => (
            <motion.div
              key={runner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-1 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/10"
            >
              <div className="p-6">
                <div className="relative mb-6">
                  <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${runner.color} opacity-20 blur group-hover:opacity-40 transition-opacity`} />
                  <img 
                    src={runner.image} 
                    alt={runner.name}
                    className="relative w-24 h-24 rounded-full mx-auto object-cover border-2 border-white/10"
                  />
                  <div className="absolute bottom-0 right-1/2 translate-x-6 bg-primary rounded-full p-1 border-2 border-black">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">{runner.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> {runner.university}
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <span className="font-bold text-white">{runner.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Rating</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-white">{runner.tasks}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Tasks</span>
                    </div>
                  </div>

                  <div className={`text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-full bg-gradient-to-r ${runner.color} text-white shadow-lg`}>
                    {runner.badge}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
            View All Runners
          </button>
        </div>
      </div>
    </section>
  );
};
