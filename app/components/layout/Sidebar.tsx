const NAV_ITEMS = ["Overview", "Orders", "Menu", "Staff", "Settings"] as const;

export function Sidebar() {
  return (
    <aside className="w-48 bg-gray-100 p-4">
      <ul className="space-y-2">
        {NAV_ITEMS.map((item) => (
          <li
            key={item}
            className="cursor-pointer py-1 px-2 hover:bg-gray-200 rounded"
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
