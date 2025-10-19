import Form from "next/form";

export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const email = formData.get("email")?.toString().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.error("Invalid email submitted:", email);
      return;
    }

    console.log("email submitted:", email);
  }

  const secondaryText = "text-gray-800 dark:text-white";

  return (
    <main className="flex flex-1 flex-col justify-center items-center text-center px-6">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Weekly / BiWeekly Digest for Developers
      </h1>

      <h2 className={`text-md ${secondaryText} mb-8`}>
        Handpicked in-depth articles and news condensed into quick 5-minute reads.
      </h2>

      <Form
        action={handleSubmit}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          className="w-full px-4 py-3 border bg-white rounded-md text-gray-800"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors w-full sm:w-auto"
        >
          Subscribe
        </button>
      </Form>

      <p className={`text-sm ${secondaryText} mt-2`}>
        Good reads from my learning journey every week or two.
      </p>
    </main>
  );
}
