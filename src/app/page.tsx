import Timer from "@/components/Timer";

export default function Home() {
  const imageUrl = "/pomodoro-wellness-image.png";

  return (
    <div className="flex-grow bg-gray-900 p-4 flex flex-col items-center justify-center font-mono min-h-[100dvh]">
      <h1 className="text-4xl font-bold mb-8 text-green-400 pixelated">
        TomZeit
      </h1>
      <Timer imageUrl={imageUrl} />
    </div>
  );
}
