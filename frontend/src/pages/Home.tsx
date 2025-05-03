import { useState, useEffect } from "react";
import { CircularGallery } from "@/ui/CircularGallery/CircularGallery";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "motion/react";
import { Meteors } from "@/components/ui/meteors";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import TrueFocus from "@/ui/TrueFocus/TrueFocus";
const Home = () => {
  interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    createdAt: string;
    organizer: {
      name: string;
    };
  }

  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://eventflow-1wso.onrender.com/api/events"
        );
        const data = await response.json();

        // Get current date (without time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter events where date is greater than today
        const futureEvents = data.filter((event: Event) => {
          const eventDate = new Date(event.date);
          return eventDate > today;
        });

        console.log("Fetched future events:", futureEvents);
        console.log("Number of future events:", futureEvents.length);
        setEvents(futureEvents);
      }
      catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Error fetching events");
      }
    }
    fetchEvents();
  }, []);

  return (
    <>
      <section className="h-screen text-white snap-start flex items-center justify-center">
        <LampContainer>
          <motion.div
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="text-center space-y-6"
          >
            <h1 className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-4xl font-medium tracking-tight text-transparent md:text-7xl">
              Streamline Your <br /> Event Planning
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              The ultimate platform for creating, managing, and attending
              unforgettable events
            </p>
          </motion.div>
        </LampContainer>
      </section>

      <section className="h-full py-6 w-full bg-slate-950 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Upcoming Events
        </h2>

        <div className="mt-13 flex items-center justify-center">
          {events.length == 0 ? (
            <p className="text-muted-foreground">No upcoming events found</p>
          ) : (
            events.map((event) => (
              <div className="max-w-xs w-full group/card" key={event.id}>
                <div
                  className={cn(
                    " cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
                    "bg-[url(https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80)] bg-cover"
                  )}
                >
                  <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
                  <div className="flex flex-row items-center space-x-4 z-10">
                    <img
                      height="100"
                      width="100"
                      alt="Avatar"
                      src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
                      className="h-10 w-10 rounded-full border-2 object-cover"
                    />
                    <div className="flex flex-col text-start">
                      <p className="font-normal text-base text-gray-50 relative z-10">
                        {event.organizer.name}
                      </p>
                      <p className="text-sm text-gray-400">                  {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text content">
                    <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
                      {event.title}
                    </h1>
                    <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
                      {event.description}
                    </p>
                    <h6 className="text-white">
                      {new Date(event.date).toLocaleDateString()}

                    </h6>
                  </div>
                </div>
              </div>
            ))
          )
          }
        </div>
      </section>


      <section className="h-screen w-full relative snap-start bg-gradient-to-br from-slate-950 to-black flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Amazing Events
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Explore a rotating carousel of upcoming events in your area or
            around the world
          </p>
        </div>
      </section>

      <section className="h-screen w-full relative snap-start bg-slate-950 flex items-center justify-center">
        <div className="w-full max-w-6xl px-4">
          <div className="relative w-full">
            <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl opacity-20" />
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-8 md:p-12 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Powerful Event Features
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Everything you need to create, manage and attend incredible
                  events
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: "Easy Creation",
                    desc: "Set up events in minutes with our intuitive interface",
                    icon: "✨",
                  },
                  {
                    title: "Real-time Analytics",
                    desc: "Track attendance and engagement as it happens",
                    icon: "📊",
                  },
                  {
                    title: "Seamless Integration",
                    desc: "Connect with popular calendar and payment apps",
                    icon: "🔗",
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="bg-gray-800 p-6 rounded-lg border border-gray-700"
                  >
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <button className="rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity">
                Get Started
              </button>

              <Meteors number={50} />
            </div>
          </div>
        </div>
      </section>

      <section className="h-screen bg-slate-950 overflow-hidden text-white snap-start flex items-center justify-center">
        <div className="flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-white dark:text-white">
                  Unleash the power of <br />
                  <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                    Event Management
                  </span>
                </h1>
              </>
            }
          >
            <img
              src={`/BG.png`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-fill h-full object-left-top"
              draggable={false}
            />
          </ContainerScroll>
        </div>
      </section>

      <section className="min-h-screen w-full relative snap-start bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="relative flex w-full flex-col items-center justify-center text-white overflow-hidden py-20">
          <TrueFocus
            sentence="Ready to Transform Your Events?"
            manualMode={false}
            groupedPhrases={[["Ready", "to", "Transform"], ["Your", "Events?"]]}
            blurAmount={5}
            borderColor="blue"
            animationDuration={1}
            pauseBetweenAnimations={.5}
          />
        
          <div className="mt-12 text-center">
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of event organizers and attendees who are already
              using our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity">
                Attend
              </button>
              <button className="px-8 py-3 rounded-lg border border-slate-600 text-white font-medium hover:bg-slate-800 transition-colors">
                Become Organizer
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
