# Remove the "All" tab from the menu

## Goal
Remove the catch-all **All** tab from the menu category tabs while keeping every other category tab intact.

## Plan
1. In `src/components/labomba/Menu.tsx`:
   - Remove the `Tab` union type and the `TABS` array that prepends `"All"`.
   - Use `MENU_CATEGORIES` directly as the tab list.
   - Change the default `useState` from `"All"` to the first category (`MENU_CATEGORIES[0]`, which is `"Tacos"`).
   - Update the filter logic so it always compares `item.category === tab` instead of checking for `"All"` first.
   - Update the per-tab count logic to remove the special case for `"All"`.

2. Keep the search bar, menu cards, add-to-order flow, and category data unchanged.

3. Verify the menu still renders and tabs switch correctly after the change.
