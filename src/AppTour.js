import { useEffect, useState } from "react";
import Joyride from "react-joyride";

export default function AppTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setRun(true);
      localStorage.setItem("hasSeenTour", "true");
    }
  }, []);

  const steps = [
    {
      target: "#upload-button",
      content: "📤 Upload the intel (Excel with headers as your guide)",
    },
    {
      target: "#sheets",
      content: "🎯 Select your target sheets for training",
    },
    {
      target: ".content",
      content:
        "🔢 Assign data to the front and back of your flashcards (only shared ones show up)",
    },
    {
      target: ".flashcard-container",
      content:
        "💥 Click (or use the up or down arrows) to flip, arrows (or keyboard arrows) to navigate",
    },
    {
      target: ".progress",
      content:
        "📈 Log your mastery with progress tracking (Your 1-5 number keys on keyboard also works!)",
    },
    {
      target: "#sort",
      content: "🔄 Sort your deck to keep things in order",
    },
    {
      target: ".random",
      content: "🎲 Scramble it for a real challenge",
    },
    {
      target: "#save-button",
      content: "💾 Save your mission progress before extraction",
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: "#9db2bf",
          textColor: "#252525",
          beaconSize: 70,
          zIndex: 100,
        },
        buttonNext: {
          color: "#252525",
        },
        buttonBack: {
          color: "#252525",
        },
      }}
    />
  );
}
