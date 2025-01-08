type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <div className="container py-32 max-w-[550px]">{children}</div>;
}
