import { launch, prelaunch } from "@/config/site";

/** Hinweisleiste im Vorstart-Modus. Verschwindet, sobald launch.courseCertificate = true ist. */
export function PrelaunchBar() {
  if (!prelaunch) return null;
  return (
    <p className="prelaunch">
      <strong>Start am {launch.startLabel}.</strong> Terminanfragen für Dezember und 2027 nehme ich schon jetzt entgegen.
    </p>
  );
}
