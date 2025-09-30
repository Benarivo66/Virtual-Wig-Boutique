import { getRequests } from "@/app/lib/data";

export default async function AdminRequestsPage() {
  const requests = await getRequests();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin - Requests</h1>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req: any) => (
            <div key={req.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold text-lg">Request #{req.id}</h2>
              <p>Status: <span className="font-medium">{req.status}</span></p>
              <p>Total: ₦{Number(req.total_amount).toLocaleString()}</p>
              <p>Phone: {req.phone}</p>
              <p>Address: {req.address}</p>
              <p className="text-sm text-gray-500">
                Placed on {new Date(req.created_at).toLocaleString()}
              </p>

              <div className="mt-3">
                <h3 className="font-semibold">Products:</h3>
                <ul className="list-disc list-inside text-sm">
                  {req.products.map((prod: any) => (
                    <li key={prod.id}>
                      {prod.name} — {prod.quantity} × ₦{Number(prod.price).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
