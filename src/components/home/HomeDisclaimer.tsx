import { AlertCircle } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { DISCLAIMER_TEXT } from "@/lib/constants";

export function HomeDisclaimer() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Alert>
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>娱乐声明</AlertTitle>
        <AlertDescription>{DISCLAIMER_TEXT}</AlertDescription>
      </Alert>
    </section>
  );
}
