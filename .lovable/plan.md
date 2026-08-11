Remove the "All" tab from the Menu filter

What
- Remove the "All" category tab from the searchable menu tab bar, keeping every other category tab (Tacos, Taco Plates, Mulitas, Quesadillas, Burritos, Loaded Nachos, Loaded Fries, Tortas, Grilled Cheese, Ramen, Extras & Sides, Dessert, Agua Fresca, Kids Meal).
- Default the menu view to the first category (Tacos) instead of showing all items at once.
- Preserve search behavior within the selected category.

How
1. Update `src/components/labomba/Menu.tsx`:
   - Remove `"All"` from the `Tab` type and `TABS` array.
   - Initialize the active tab to `MENU_CATEGORIES[0]` ("Tacos").
   - Remove the `tab !== "All"` branch in the filter logic so the selected category always applies.
   - Remove the `t === "All"` count special case so each tab only shows its own item count.

No other files need to change. `src/components/labomba/data.ts` and `src/components/labomba/ItemCustomizer.tsx` remain untouched.
