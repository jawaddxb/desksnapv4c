# Chart Test Deck - Expected Output

Import `chart-test-deck.json` via the dashboard import feature.

## Expected Rendering Per Slide

### Slide 0: Q3 2024 Performance Overview
**Content Blocks:**
- 3x Statistics with up arrows:
  - `$4.2M` Total Revenue ↑
  - `23%` Year-over-Year Growth ↑
  - `847` New Customers Acquired ↑

**Expected Look:** Three stat cards/boxes showing big numbers with green up arrows

---

### Slide 1: Revenue by Quarter
**Content Blocks:**
- Bar Chart: 4 bars (Q1-Q4) showing $3.1M → $4.8M
- Bullet list: 3 items

**Expected Look:** Bar chart with 4 colored bars, bullet points below

---

### Slide 2: Market Share Distribution
**Content Blocks:**
- Pie Chart: 4 segments (Enterprise 45%, Mid-Market 28%, SMB 18%, Startup 9%)

**Expected Look:** Circular pie chart with colored segments and percentage labels

---

### Slide 3: Customer Growth Trend
**Content Blocks:**
- Line Chart: 9 data points (Jan-Sep) showing growth from 1200 → 2580
- Statistic: 115% Retention Rate ↑

**Expected Look:** Line graph showing upward trend, stat box below

---

### Slide 4: Product Mix Analysis
**Content Blocks:**
- Donut Chart: 4 segments with center hole
- Callout (success/green): "Add-ons revenue grew 45%..."

**Expected Look:** Donut chart (pie with hole in middle), green callout box

---

### Slide 5: Regional Performance
**Content Blocks:**
- Bar Chart: 4 regions (NA $2.1M, Europe $1.2M, APAC $0.6M, LATAM $0.3M)
- Quote block with attribution

**Expected Look:** Bar chart, quote in styled box with attribution

---

### Slide 6: Key Takeaways
**Content Blocks:**
- Numbered list: 4 items
- Callout (tip/blue): Q4 Focus message

**Expected Look:** 1-4 numbered items, blue tip callout box

---

### Slide 7: Mixed Content Demo
**Content Blocks:**
- Paragraph (flowing text)
- Bullet list: 4 items
- Statistic: "8" block types (neutral)

**Expected Look:** Prose paragraph, bullets, stat box

---

## What to Check

1. **Charts render** - Do you see actual bar/line/pie/donut charts?
2. **Statistics show** - Big numbers with trend arrows?
3. **Callouts styled** - Colored boxes for success/tip variants?
4. **Quotes attributed** - Quote text with name below?
5. **Mixed blocks** - Multiple types on same slide?

## If Charts Don't Render

Check browser console for errors. Common issues:
- Recharts not loaded (check `node_modules/recharts`)
- ContentBlockRenderer not finding ChartBlock
- Lazy loading failure

## Test Command

```bash
npm run dev
# Go to dashboard
# Click Import
# Select test-data/chart-test-deck.json
# Open the deck
# Navigate through slides
```
