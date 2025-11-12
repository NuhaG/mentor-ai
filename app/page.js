import { personas } from "@/lib/personas";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-950">
      <div className="w-full max-w-4xl text-center">
        <h1 className="font-extrabold text-4xl mb-4">Choose Your AI Persona</h1>
        <p className="text-gray-500 mb-8 text-lg">Each persona has an identity and answers differently.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map(persona => (
            <Link key={persona.id} href={`/chat?personaId=${persona.id}`}
              className="block p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-400 border-2 border-gray-200 bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <img src={persona.avatar} className="w-16 h-16 rounded-full mb-3 ring-4 shadow-md"
                  alt={`${persona.name} Avatar`} />
                <h2 className="text-xl font-bold mb-1">{persona.name}</h2>
                <p className="text-sm text-gray-500">{persona.prompt}</p>
              </div>
            </Link>
          ))}
          <div
            className="block p-5 rounded-xl shadow-lg border-2 border-dashed border-gray-200 bg-gray-900"
          >
            <div className="flex flex-col items-center text-center">

              <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Random&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50" className="w-16 h-16 rounded-full mb-3 ring-4 shadow-md"
                alt="Avatar" />
              <h2 className="text-xl font-bold mb-1">Create Your Custom Persona</h2>
              <p className="text-sm text-gray-500">Coming Soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
