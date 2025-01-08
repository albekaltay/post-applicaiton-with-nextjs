import DashboardLayout from "@/layout/dashboard-layout";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
