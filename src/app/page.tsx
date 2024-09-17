import Timer from "@/components/Timer";

export default function Home() {
  const imageUrl = "/pomodoro-wellness-image.png";

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center font-mono">
      <h1 className="text-4xl font-bold mb-8 text-green-400 pixelated">
        TomatenZeit
      </h1>
      <Timer imageUrl={imageUrl} />
    </div>
  );
}
