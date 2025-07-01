import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function WardBedAvailability() {
  const BaseUrl = "http://localhost:4000";

  const [beds, setBeds] = useState([]);
  const [wards, setWards] = useState([]);
  const [search, setSearch] = useState("");
  const [openWardId, setOpenWardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBeds = async () => {
    const res = await fetch(`${BaseUrl}/bed/all-beds`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch beds");
    return res.json();
  };

  const fetchWards = async () => {
    const res = await fetch(`${BaseUrl}/ward/all`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch wards");
    return res.json();
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bedsData, wardsData] = await Promise.all([fetchBeds(), fetchWards()]);
        setBeds(bedsData);
        setWards(wardsData);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getWardStats = () => {
    const wardMap = {};
    wards.forEach(w => {
      wardMap[w._id] = { name: w.name, capacity: w.capacity };
    });

    const stats = {};
    beds.forEach(bed => {
      const wardId = bed.ward;
      if (!stats[wardId]) {
        stats[wardId] = {
          beds: [],
          available: 0,
          occupied: 0,
          maintenance: 0,
          total: 0,
          name: wardMap[wardId]?.name || "Unknown",
          capacity: wardMap[wardId]?.capacity || 0,
        };
      }
      stats[wardId].beds.push(bed);
      stats[wardId].total++;
      const status = (bed.status || "").toLowerCase();
      if (status.startsWith("avail")) stats[wardId].available++;
      else if (status.startsWith("occup")) stats[wardId].occupied++;
      else stats[wardId].maintenance++;
    });

    return Object.values(stats).filter(w =>
      w.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const wardStats = getWardStats();

  return (
    <section className="p-6">
      <Toaster position="top-right" />

      <input
        type="text"
        placeholder="Search ward…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-sm focus:ring-2 focus:ring-indigo-500"
      />

      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Ward</th>
            <th className="px-4 py-2 text-right">Capacity</th>
            <th className="px-4 py-2 text-right">Available</th>
            <th className="px-4 py-2 text-right">Occupied</th>
            <th className="px-4 py-2 text-right">Maintenance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {wardStats.length > 0 ? (
            wardStats.map((ward) => (
              <React.Fragment key={ward.name}>
                <tr
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setOpenWardId(openWardId === ward.name ? null : ward.name)
                  }
                >
                  <td className="px-4 py-2 flex items-center gap-1">
                    <span className="mr-1">{openWardId === ward.name ? "▼" : "▶"}</span>
                    {ward.name}
                  </td>
                  <td className="px-4 py-2 text-right">{ward.capacity}</td>
                  <td className="px-4 py-2 text-right text-green-600">{ward.available}</td>
                  <td className="px-4 py-2 text-right text-red-600">{ward.occupied}</td>
                  <td className="px-4 py-2 text-right text-yellow-600">{ward.maintenance}</td>
                </tr>

                {openWardId === ward.name && (
                  <tr>
                    <td colSpan={5} className="bg-gray-50 px-4 py-2">
                      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {ward.beds.map((bed) => (
                          <li
                            key={bed._id}
                            className="border rounded px-3 py-1 flex justify-between items-center"
                          >
                            <span className="font-mono text-xs">{bed._id}</span>
                            <span
                              className={{
                                available: "text-green-600",
                                occupied: "text-red-600",
                                maintenance: "text-yellow-600",
                              }[(bed.status || "").toLowerCase()] || ""}
                            >
                              {bed.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No wards match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
