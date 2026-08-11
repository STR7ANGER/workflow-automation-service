import "./styles.css";
import type { ReactNode } from "react";
export default function L({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
