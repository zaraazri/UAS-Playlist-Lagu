import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
        <p className="text-gray-400">
          Pilih artis atau playlist dari library.
        </p>
      </main>
    </div>
  );
}
