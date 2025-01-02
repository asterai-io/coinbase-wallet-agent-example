
export type CardProps = {
  value: string;
  name: string;
};

export const Card = ({value, name}: CardProps) => (
  <div className="w-full basis-full border-2 border-stone-400 my-2 rounded-xl">
    <div className="p-3 text-xl truncate text-center">
      {value}
    </div>
    <div
      className="bg-stone-400 p-4 text-sm text-stone-800 rounded-b text-center">
      {name}
    </div>
  </div>
);
