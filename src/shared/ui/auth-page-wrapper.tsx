export const AuthPageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div
    className="w-screen h-full m-0 p-0 pb-10"
    style={{
      background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
    }}
  >
    {children}
  </div>
);
