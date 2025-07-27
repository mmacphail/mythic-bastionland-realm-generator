import RealmGenerator from "../components/RealmGenerator";

export function meta() {
  return [
    { title: "Mythic Bastionland Realm Maker" },
    { name: "description", content: "Create hex-based realms for Mythic Bastionland RPG" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-full mx-auto">
        <RealmGenerator rows={12} cols={12} />
      </div>
    </div>
  );
}
