export const Switch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-[28px] w-[52px] items-center rounded-full transition-colors ${
      checked ? "bg-[#2D6AE3]" : "bg-gray-300"
    }`}
    aria-pressed={checked}
  >
    <span
      className={`inline-block h-[24px] w-[24px] transform rounded-full bg-white transition ${
        checked ? "translate-x-[26px]" : "translate-x-[2px]"
      }`}
    />
  </button>
);
