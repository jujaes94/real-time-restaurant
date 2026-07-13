export function Topbar({ title }: { title: string }) {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <h1 className="text-lg font-semibold">{title}</h1>
    </nav>
  );
}
