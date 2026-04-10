export default function ResultsLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 rounded-full bg-white/70" />
        <div className="h-14 w-full max-w-3xl rounded-3xl bg-white/70" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64 rounded-[2rem] bg-white/70" />
          <div className="h-64 rounded-[2rem] bg-white/70" />
        </div>
      </div>
    </main>
  );
}
