import Ai from "shared/assets/icons/ai";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 right-8 flex pr-[40] pl-[40px] pb-[40px] bg-transparent">
      <button className="bg-[#008FF61A] flex p-[24px] items-center justify-center gap-[8px] rounded-full">
        <Ai />
      </button>
    </footer>
  );
};
