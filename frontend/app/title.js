"use client";

export default function Header({ title, as = "h1" }) {
  const Heading = as;
  return <Heading>{title ? title : "Default title"}</Heading>;
}
