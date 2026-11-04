
export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>

        <h2 className="mt-5 text-xl font-bold">
          Loading BookNook...
        </h2>

        <p className="mt-2 text-sm text-base-content/60">
          Please wait while we prepare your page.
        </p>
      </div>
    </main>
  );
}
