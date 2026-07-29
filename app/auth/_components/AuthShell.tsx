import Logo from "@/app/components/Logo";
import { PropsWithChildren, ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

const AuthShell = ({ title, subtitle, footer, children }: PropsWithChildren<Props>) => (
  <div className="flex min-h-[70dvh] items-center justify-center">
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size={44} />
          <h1 className="mt-3 mb-1! text-2xl">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {children}
      </div>
      {footer && (
        <p className="mt-4 text-center text-sm text-gray-500">{footer}</p>
      )}
    </div>
  </div>
);

export default AuthShell;
