export const siteData = {
  businessName: "Muscle Fit Irwin",
  tagline: "Fuel your workouts with clean meals and smoothies.",
  phone: "7241234567",
  orderEmail: "orders@example.com",
  instagramUrl: "https://instagram.com/MuscleFit_IrwinSmoothies",
  locationBlurb: "Inside the gym. Fast pickup. Built for training days.",
  clover: {
    enabled: true,
    orderUrl: "",
    embedUrl: "",
    embedAllowedNote: "If Clover blocks embedding, use the external order link instead.",
  },
  mealPrep: {
    basePrice: 12.5,
    cutoffText: "Orders are due Wednesday at 5:00 PM (1700) for the following week.",
    proteins: ["Grilled Chicken", "Ground Turkey", "Steak", "Salmon"],
    carbs: ["White Rice", "Brown Rice", "Sweet Potato", "No Carb (Extra Veggies)"],
    veggies: ["Broccoli", "Green Beans", "Zucchini", "Mixed Veggies"],
    modifiers: {
      salmonUpcharge: 2,
      extraMeat: 2,
      extraVeggieOrCarb: 0.5,
    },
  },
  smoothies: {
    size: "16 oz",
    price: 7.5,
    categories: [
      {
        name: "Tropical",
        items: [
          {
            name: "Strawberry Banana",
            ingredients: ["Strawberries", "Banana", "Almond Milk", "Almond Butter", "Cinnamon", "Whey Protein"],
            calories: 350,
          },
          {
            name: "Tropical Fuel",
            ingredients: ["Mango", "Pineapple", "Turmeric", "Almond Milk", "Flaxseed", "Whey Protein"],
            calories: 350,
          },
          {
            name: "Berry Blast",
            ingredients: ["Strawberries", "Raspberries", "Blueberries", "Banana", "Lemon Juice", "Almond Milk", "Whey Protein"],
            calories: 350,
          },
          {
            name: "Choco-Banana",
            ingredients: ["Banana", "Almond Milk", "Cacao Powder", "Whey Protein"],
            calories: 350,
          },
        ],
      },
      {
        name: "Clean Fuel",
        items: [
          {
            name: "Sweet Potato Pie",
            ingredients: ["Sweet Potato", "Banana", "Almond Milk", "Cinnamon", "Whey Protein"],
            calories: 350,
          },
          {
            name: "The Green One",
            ingredients: ["Spinach", "Kale", "Green Apple", "Pineapple", "Banana", "Almond Milk", "Lemon Juice", "Jalapeno", "Whey Protein"],
            calories: 330,
          },
          {
            name: "Blueberry Peach",
            ingredients: ["Blueberries", "Peaches", "Almond Milk", "Chia Seeds", "Lemon Juice", "Whey Protein"],
            calories: 350,
          },
          {
            name: "Avocado Dream",
            ingredients: ["Avocado", "Banana", "Spinach", "Almond Milk", "Lime Juice", "Whey Protein"],
            calories: 380,
          },
        ],
      },
    ],
    addons: {
      oneDollar: ["Collagen", "Creatine", "Magnesium", "Vitamin C", "Calcium"],
      twoDollar: ["Almond Butter", "Protein", "Fruit"],
    },
  },
} as const;

export type PickupType = "asap" | "scheduled";
