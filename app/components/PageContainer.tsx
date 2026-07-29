import cn from "classnames";

/** Centers page content now that the app shell is full-bleed for the map. */
const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("mx-auto w-full max-w-5xl", className)}>{children}</div>
);

export default PageContainer;
