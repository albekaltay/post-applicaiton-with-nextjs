import AppController from "./app-controller";

// ----------------------------------------------------------------------------

interface AppControllerProps {
  children: React.ReactNode;
  title?: string;
  isController?: boolean;
}
// ----------------------------------------------------------------------------

const AppContainer = ({
  children,
  title,
  isController = true,
}: AppControllerProps) => {
  return (
    <div className="container py-5 md:py-12">
      {isController && <AppController title={title} />}
      {children}
    </div>
  );
};

export default AppContainer;
