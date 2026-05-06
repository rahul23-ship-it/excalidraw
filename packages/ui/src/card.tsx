import { type CSSProperties, type JSX } from "react";

const baseClasses =
  "rounded-3xl border border-border bg-card/80 p-6 text-card-foreground shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg";

export function Card({
  className,
  title,
  children,
  href,
  style,
}: {
  className?: string;
  title?: string;
  children: React.ReactNode;
  href?: string;
  style?: CSSProperties;
}): JSX.Element {
  if (!title || !href) {
    return (
      <div className={[baseClasses, className].filter(Boolean).join(" ")} style={{ borderRadius: "24px", ...style }}>
        {children}
      </div>
    );
  }

  return (
    <a
      className={[baseClasses, className].filter(Boolean).join(" ")}
      style={{ borderRadius: "24px", ...style }}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title} <span className="inline-block transition-transform duration-200">-&gt;</span>
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{children}</p>
    </a>
  );
}
