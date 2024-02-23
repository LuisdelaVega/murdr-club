interface Props {
  room?: string;
}

export function Header({ room }: Props) {
  return (
    <h2 className="text-center bg-emerald-700 h-10">{room || "Murdr Club"}</h2>
  );
}
