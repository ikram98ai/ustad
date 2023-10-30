import Link from "next/link";
import React from "react";

interface Props {
  leftText?: string;
  leftLink?: string;
  rightText: string;
  rightLink: string;
}

const FormFooter = ({ leftText, leftLink, rightLink, rightText }: Props) => {
  return (
    <footer>
      {(leftText || leftLink) && (
        <Link
          className="text-indigo-700 hover:text-green-600 text-sm float-left"
          href={leftLink ? leftLink : ""}
        >
          {leftText}
        </Link>
      )}
      <Link
        className="text-indigo-700 hover:text-green-600 text-sm float-right"
        href={rightLink}
      >
        {rightText}
      </Link>
    </footer>
  );
};

export default FormFooter;
