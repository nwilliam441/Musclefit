import { Bolt, Cherry, Leaf } from "lucide-react";
import { siteData } from "@/lib/site-data";

function getSmoothieIcon(ingredients: readonly string[]) {
  const combined = ingredients.join(" ").toLowerCase();

  if (combined.includes("berry") || combined.includes("straw") || combined.includes("blue")) {
    return <Cherry size={16} aria-hidden="true" />;
  }

  if (combined.includes("kale") || combined.includes("spinach") || combined.includes("green")) {
    return <Leaf size={16} aria-hidden="true" />;
  }

  return <Bolt size={16} aria-hidden="true" />;
}

export default function SmoothiesPage() {
  return (
    <main className="page-shell">
      <section className="hero compact">
        <p className="eyebrow">Smoothies</p>
        <h1>
          {siteData.smoothies.size} Smoothies - ${siteData.smoothies.price.toFixed(2)}
        </h1>
        <p>Two focused menus: Tropical and Clean Fuel. Fast to scan between sets.</p>
      </section>

      <section className="section-grid">
        {siteData.smoothies.categories.map((category) => (
          <div
            key={category.name}
            className={`category-block ${
              category.name === "Tropical" ? "category-tropical" : "category-clean-fuel"
            }`}
          >
            <h2>{category.name}</h2>
            <div className="menu-grid">
              {category.items.map((item) => (
                <article key={item.name} className="card smoothie-card">
                  <h3>
                    <span className="item-icon">{getSmoothieIcon(item.ingredients)}</span>
                    {item.name}
                  </h3>
                  <p className="ingredients">{item.ingredients.join(", ")}</p>
                  <p className="calories">{item.calories} Cal</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="card addons">
        <h2>Add Ons</h2>
        <p>
          <strong>$1:</strong> {siteData.smoothies.addons.oneDollar.join(", ")}
        </p>
        <p>
          <strong>$2:</strong> {siteData.smoothies.addons.twoDollar.join(", ")}
        </p>
      </section>
    </main>
  );
}
