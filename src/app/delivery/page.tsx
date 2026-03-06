export default function DeliveryLocationsPage() {
  const locations = [
    { name: "Ado Ekiti", price: 3500 },
    { name: "Ilesha", price: 3500 },
    { name: "Ondo Town", price: 4000 },
    { name: "Akure", price: 3500 },
    { name: "Owerri", price: 3500 },
    { name: "Onitsha", price: 3000 },
    { name: "Aba", price: 3500 },
    { name: "Enugu", price: 3500 },
    { name: "Abuja", price: 3500 },
    { name: "Oghara", price: 3500 },
    { name: "Ughelli", price: 3500 },
    { name: "Sapele", price: 3500 },
    { name: "Abraka", price: 3500 },
    { name: "Kwale", price: 4000 },
    { name: "Ozoro", price: 4000 },
    { name: "Kano", price: 4000 },
    { name: "Kaduna", price: 4000 },
    { name: "Jos", price: 4000 },
    { name: "Maiduguri", price: 4000 },
    { name: "Katsina", price: 4000 },
    { name: "Orlu", price: 4000 },
    { name: "Ile Ife", price: 4000 },
    { name: "Ikire", price: 4000 },
    { name: "Akungba", price: 4000 },
    { name: "Sango Ota", price: 3000 },
    { name: "Auchi", price: 3500 },
    { name: "Ekpoma", price: 3500 },
    { name: "Uromi", price: 4000 },
    { name: "Bayelsa", price: 4000 },
    { name: "Agbor", price: 3500 },
    { name: "Warri", price: 3500 },
    { name: "Ibadan", price: 3000 },
    { name: "Ijebu Ode", price: 3500 },
    { name: "Sagamu", price: 3000 },
    { name: "Ilorin", price: 3000 },
    { name: "Offa", price: 5000 },
    { name: "Ogbomosho", price: 3500 },
    { name: "Asaba", price: 3500 },
    { name: "Oleh", price: 4000 },
    { name: "Ijebu Igbo", price: 4000 },
    { name: "Port Harcourt", price: 3500 },
    { name: "Benin", price: 3000 },
    { name: "Abeokuta", price: 3500 },
    { name: "Ore", price: 4000 },
    { name: "Sapade (Ogun State)", price: 3000 },
    { name: "Abakaliki", price: 3500 },
    { name: "Calabar", price: 4000 },
    { name: "Oye Ekiti", price: 4000 },
    { name: "Lokoja", price: 4000 },
    { name: "Awka", price: 3500 },
    { name: "Uyo", price: 4000 },
    { name: "Makurdi", price: 4000 },
    { name: "Ede (Osun)", price: 4000 },
    { name: "Umuahia", price: 3500 },
    { name: "Challenge", price: 3500 },
    { name: "Nnewi", price: 3500 },
    { name: "Owode Ede", price: 4000 },
    { name: "Ago Iwoye", price: 3500 },
    { name: "Oju Ore", price: 3000 },
    { name: "Nsukka", price: 3500 },
    { name: "Ogwashi Uku", price: 4000 },
    { name: "Mowe", price: 3000 },
    { name: "Adamawa", price: 4000 },
    { name: "Ikom", price: 5000 },
    { name: "Oron", price: 5000 },
    { name: "Iwo (Osun)", price: 4000 },
    { name: "Nasarawa", price: 4000 },
    { name: "Minna", price: 4000 },
    { name: "Kogi", price: 4000 },
    { name: "Yola", price: 4000 },
    { name: "Oyo Town", price: 3500 },
  ];

  return (
    <div className="min-h-screen px-4 py-8 bg-tertiary">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-tertiary1">
          Delivery Locations & Prices
        </h1>

        {/* Responsive Grid: minimum 2 columns even on smallest screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="rounded-2xl p-4 shadow-sm transition hover:shadow-md bg-tertiary border border-secondary"
            >
              <p className="font-semibold text-sm md:text-base text-tertiary1">
                {location.name}
              </p>
              <p className="mt-1 text-lg font-bold text-tertiary1">
                ₦{location.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
