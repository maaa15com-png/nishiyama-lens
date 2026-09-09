type LensOptionCardProps = {
  id: string;
  name: string;
  value: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

export function LensOptionCard({
  id,
  name,
  value,
  label,
  description,
  checked,
  onChange,
}: LensOptionCardProps) {
  return (
    <div>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className={`group flex min-h-24 w-full cursor-pointer items-center gap-4 rounded-[1.25rem] border px-5 py-4 text-left transition duration-200 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-[#174a36] sm:min-h-28 sm:px-6 ${
          checked
            ? "border-[#174a36] bg-[#174a36] text-white shadow-[0_14px_36px_rgba(23,74,54,0.2)]"
            : "border-[#dfe3d8] bg-white text-[#173e30] hover:-translate-y-0.5 hover:border-[#8ca292] hover:shadow-[0_10px_28px_rgba(40,55,42,0.08)]"
        }`}
      >
        <span
          aria-hidden="true"
          className={`grid size-7 shrink-0 place-items-center rounded-full border transition-colors ${
            checked
              ? "border-white/45 bg-white text-[#174a36]"
              : "border-[#b8c4b9] bg-[#f5f1e7] text-transparent group-hover:border-[#6f8976]"
          }`}
        >
          <CheckIcon />
        </span>
        <span>
          <span className="block text-base font-semibold sm:text-lg">{label}</span>
          <span
            className={`mt-1 block text-xs leading-5 sm:text-sm ${
              checked ? "text-white/72" : "text-[#68736c]"
            }`}
          >
            {description}
          </span>
        </span>
      </label>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 fill-none stroke-current"
      strokeWidth="2"
    >
      <path d="m3.5 8 3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
