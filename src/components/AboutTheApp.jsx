const About = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">
        About 2-Minute Habits
      </h1>
      <p className="text-lg mb-6">
        Inspired by James Clear's <em>Atomic Habits</em>,{" "}
        <b>
          "Every action you take is a vote for the type of person you wish to
          become."
        </b>{" "}
        Whether you're aiming to become fitter, calmer, good-sleeper, or more
        mindful of your diet — this app helps you cast those daily votes.
      </p>

      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        📋 How It Works
      </h2>
      <ul className="list-disc list-inside text-lg mb-6 space-y-2">
        <li>
          Focus on just <b>4 core habits</b> that really matter:
          <ul className="list-none ml-4 space-y-1 font-mono">
            <li>
              1. 🏋️ <strong>Fitness</strong>
            </li>
            <li>
              2. 🧘 <strong>Meditation</strong>
            </li>
            <li>
              3. 🌙 <strong>Wind Down for Sleep</strong>
            </li>
            <li>
              4. 🍵 <strong>No Sugar Drinks</strong>
            </li>
          </ul>
        </li>
        <li>
          Ask yourself the question: "Can I spend 2 minutes on this habit today,
          just 2 minutes?"
        </li>
        <li>
          Tap <em>Mark Complete</em> each day you follow through.
        </li>
        <li>
          Watch your streak grow and celebrate your progress — one day at a
          time.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        📨 Contact Me
      </h2>
      <p className="text-lg">
        Have feedback, ideas, or just want to say hi? Reach out to the creator
        on X:
        <a
          href="https://x.com/lvjian700"
          className="text-blue-600 underline ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          @lvjian700
        </a>
      </p>
    </div>
  );
};

export default About;
