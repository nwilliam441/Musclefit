import { siteData } from "@/lib/site-data";

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
          <div key={category.name} className="category-block">
            <h2>{category.name}</h2>
            <div className="menu-grid">
              {category.items.map((item) => (
                <article key={item.name} className="card smoothie-card">
                  <h3>{item.name}</h3>
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
