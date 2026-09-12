// // // import { useState } from 'react'
// // // import heroImg from './assets/hero.png'
// // // import reactLogo from './assets/react.svg'
// // // import viteLogo from './assets/vite.svg'
// // // import './App.css'

// // // function App() {
// // //   const [count, setCount] = useState(0)

// // //   return (
// // //     <>
// // //       <section id="center">
// // //         <div className="hero">
// // //           <img src={heroImg} className="base" width="170" height="179" alt="" />
// // //           <img src={reactLogo} className="framework" alt="React logo" />
// // //           <img src={viteLogo} className="vite" alt="Vite logo" />
// // //         </div>
// // //         <div>
// // //           <h1>Get started</h1>
// // //           <p>
// // //             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
// // //           </p>
// // //         </div>
// // //         <button
// // //           type="button"
// // //           className="counter"
// // //           onClick={() => setCount((count) => count + 1)}
// // //         >
// // //           Count is {count}
// // //         </button>
// // //       </section>

// // //       <div className="ticks"></div>

// // //       <section id="next-steps">
// // //         <div id="docs">
// // //           <svg className="icon" role="presentation" aria-hidden="true">
// // //             <use href="/icons.svg#documentation-icon"></use>
// // //           </svg>
// // //           <h2>Documentation</h2>
// // //           <p>Your questions, answered</p>
// // //           <ul>
// // //             <li>
// // //               <a href="https://vite.dev/" target="_blank">
// // //                 <img className="logo" src={viteLogo} alt="" />
// // //                 Explore Vite
// // //               </a>
// // //             </li>
// // //             <li>
// // //               <a href="https://react.dev/" target="_blank">
// // //                 <img className="button-icon" src={reactLogo} alt="" />
// // //                 Learn more
// // //               </a>
// // //             </li>
// // //           </ul>
// // //         </div>
// // //         <div id="social">
// // //           <svg className="icon" role="presentation" aria-hidden="true">
// // //             <use href="/icons.svg#social-icon"></use>
// // //           </svg>
// // //           <h2>Connect with us</h2>
// // //           <p>Join the Vite community</p>
// // //           <ul>
// // //             <li>
// // //               <a href="https://github.com/vitejs/vite" target="_blank">
// // //                 <svg
// // //                   className="button-icon"
// // //                   role="presentation"
// // //                   aria-hidden="true"
// // //                 >
// // //                   <use href="/icons.svg#github-icon"></use>
// // //                 </svg>
// // //                 GitHub
// // //               </a>
// // //             </li>
// // //             <li>
// // //               <a href="https://chat.vite.dev/" target="_blank">
// // //                 <svg
// // //                   className="button-icon"
// // //                   role="presentation"
// // //                   aria-hidden="true"
// // //                 >
// // //                   <use href="/icons.svg#discord-icon"></use>
// // //                 </svg>
// // //                 Discord
// // //               </a>
// // //             </li>
// // //             <li>
// // //               <a href="https://x.com/vite_js" target="_blank">
// // //                 <svg
// // //                   className="button-icon"
// // //                   role="presentation"
// // //                   aria-hidden="true"
// // //                 >
// // //                   <use href="/icons.svg#x-icon"></use>
// // //                 </svg>
// // //                 X.com
// // //               </a>
// // //             </li>
// // //             <li>
// // //               <a href="https://bsky.app/profile/vite.dev" target="_blank">
// // //                 <svg
// // //                   className="button-icon"
// // //                   role="presentation"
// // //                   aria-hidden="true"
// // //                 >
// // //                   <use href="/icons.svg#bluesky-icon"></use>
// // //                 </svg>
// // //                 Bluesky
// // //               </a>
// // //             </li>
// // //           </ul>
// // //         </div>
// // //       </section>

// // //       <div className="ticks"></div>
// // //       <section id="spacer"></section>
// // //     </>
// // //   )
// // // }

// // // export default App
// // import React from "react";
// // import { FiltersProvider, useFilters } from "./context/FiltersContext";
// // import Header from "./components/Header";
// // import KpiCards from "./components/KpiCards";
// // // import DynamicsChart from "./components/DynamicsChart";
// // // import TopEvents from "./components/TopEvents";
// // // import AgePie from "./components/AgePie";
// // import Heatmap from "./components/Heatmap";
// // import DataTable from "./components/DataTable";
// // import { useOverview, useDynamics, useTop, useBreakdown, useHeatmap, useTable } from "./api/hooks";
// // import "./App.css";

// // function Dashboard() {
// //   const { selectedIds } = useFilters();

// //   const overview = useOverview(selectedIds);
// //   const dynamics = useDynamics(selectedIds);
// //   const top = useTop(10, selectedIds);
// //   const breakdown = useBreakdown("form", selectedIds);
// //   const heatmap = useHeatmap("z_score", selectedIds);
// //   const table = useTable("fact_2026", "desc", "", 20, 0, selectedIds);

// //   // собираем KPI из overview
// //   const kpiData = overview.data
// //     ? [
// //         { label: "Резиденты", value: overview.data.kpi.residents, unit: "чел.", delta: 0 },
// //         { label: "Продукты", value: overview.data.kpi.products, unit: "шт.", delta: 0 },
// //         { label: "Услуги", value: overview.data.kpi.services_rub, unit: "₽", delta: overview.data.plan_vs_fact.delta_pct },
// //         { label: "Ср. отклонение", value: overview.data.kpi.avg_deviation_pct, unit: "%", delta: 0 },
// //       ]
// //     : [];

// //   return (
// //     <div className="app-container">
// //       <Header />

// //       {overview.error && <div className="r5-error">API: {overview.error}</div>}

// //       {overview.loading ? (
// //         <div className="r5-loading">Загрузка KPI…</div>
// //       ) : (
// //         <KpiCards data={kpiData} />
// //       )}

// //       {dynamics.loading ? (
// //         <div className="r5-loading">Загрузка динамики…</div>
// //       ) : (
// //         <DynamicsChart
// //           data={(dynamics.data || []).map((d) => ({
// //             x: d.institution_id,
// //             "План 2025": d.plan_2025,
// //             "Факт 2026": d.fact_2026,
// //           }))}
// //           title="План 2025 vs Факт 2026 по учреждениям"
// //         />
// //       )}

// //       {!top.loading && (
// //         <TopEvents
// //           data={(top.data || []).map((d) => ({ name: d.name, value: d.fact_2026 }))}
// //           title="Топ-10 показателей"
// //         />
// //       )}

// //       {!breakdown.loading && (
// //         <AgePie
// //           data={(breakdown.data || []).map((d) => ({ name: d.form, value: d.fact_2026 }))}
// //           title="Разбивка по формам"
// //         />
// //       )}

// //       {!heatmap.loading && heatmap.data && (
// //         <Heatmap
// //           rows={heatmap.data.rows}
// //           cols={heatmap.data.cols}
// //           values={Object.fromEntries(
// //             heatmap.data.rows.map((r, i) => [
// //               r,
// //               Object.fromEntries(heatmap.data.cols.map((c, j) => [c, heatmap.data.values[i][j]])),
// //             ])
// //           )}
// //           title="Матрица (z-score)"
// //         />
// //       )}

// //       {!table.loading && table.data && (
// //         <DataTable
// //           data={table.data.items}
// //           columns={[
// //             { key: "institution_id", label: "Учреждение" },
// //             { key: "code", label: "Код" },
// //             { key: "name", label: "Показатель" },
// //             { key: "fact_2026", label: "Факт", format: (v) => new Intl.NumberFormat("ru-RU").format(v ?? 0) },
// //           ]}
// //           title="Все показатели (с API)"
// //           pageSize={20}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // export default function App() {
// //   return (
// //     <FiltersProvider>
// //       <Dashboard />
// //     </FiltersProvider>
// //   );
// // }

// // import { useState } from 'react'
// // import heroImg from './assets/hero.png'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from './assets/vite.svg'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <section id="center">
// //         <div className="hero">
// //           <img src={heroImg} className="base" width="170" height="179" alt="" />
// //           <img src={reactLogo} className="framework" alt="React logo" />
// //           <img src={viteLogo} className="vite" alt="Vite logo" />
// //         </div>
// //         <div>
// //           <h1>Get started</h1>
// //           <p>
// //             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
// //           </p>
// //         </div>
// //         <button
// //           type="button"
// //           className="counter"
// //           onClick={() => setCount((count) => count + 1)}
// //         >
// //           Count is {count}
// //         </button>
// //       </section>

// //       <div className="ticks"></div>

// //       <section id="next-steps">
// //         <div id="docs">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#documentation-icon"></use>
// //           </svg>
// //           <h2>Documentation</h2>
// //           <p>Your questions, answered</p>
// //           <ul>
// //             <li>
// //               <a href="https://vite.dev/" target="_blank">
// //                 <img className="logo" src={viteLogo} alt="" />
// //                 Explore Vite
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://react.dev/" target="_blank">
// //                 <img className="button-icon" src={reactLogo} alt="" />
// //                 Learn more
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //         <div id="social">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#social-icon"></use>
// //           </svg>
// //           <h2>Connect with us</h2>
// //           <p>Join the Vite community</p>
// //           <ul>
// //             <li>
// //               <a href="https://github.com/vitejs/vite" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#github-icon"></use>
// //                 </svg>
// //                 GitHub
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://chat.vite.dev/" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#discord-icon"></use>
// //                 </svg>
// //                 Discord
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://x.com/vite_js" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#x-icon"></use>
// //                 </svg>
// //                 X.com
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://bsky.app/profile/vite.dev" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#bluesky-icon"></use>
// //                 </svg>
// //                 Bluesky
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //       </section>

// //       <div className="ticks"></div>
// //       <section id="spacer"></section>
// //     </>
// //   )
// // }

// // export default App
// import React from "react";
// import { FiltersProvider, useFilters } from "./context/FiltersContext";
// import Header from "./components/Header";
// import KpiCards from "./components/KpiCards";
// // import DynamicsChart from "./components/DynamicsChart";
// // import TopEvents from "./components/TopEvents";
// // import AgePie from "./components/AgePie";
// import Heatmap from "./components/Heatmap";
// import DataTable from "./components/DataTable";
// import { useOverview, useDynamics, useTop, useBreakdown, useHeatmap, useTable } from "./api/hooks";
// import "./App.css";

// function Dashboard() {
//   const { selectedIds } = useFilters();

//   const overview = useOverview(selectedIds);
//   const dynamics = useDynamics(selectedIds);
//   const top = useTop(10, selectedIds);
//   const breakdown = useBreakdown("form", selectedIds);
//   const heatmap = useHeatmap("z_score", selectedIds);
//   const table = useTable("fact_2026", "desc", "", 20, 0, selectedIds);

//   // собираем KPI из overview
//   const kpiData = overview.data
//     ? [
//         { label: "Резиденты", value: overview.data.kpi.residents, unit: "чел.", delta: 0 },
//         { label: "Продукты", value: overview.data.kpi.products, unit: "шт.", delta: 0 },
//         { label: "Услуги", value: overview.data.kpi.services_rub, unit: "₽", delta: overview.data.plan_vs_fact.delta_pct },
//         { label: "Ср. отклонение", value: overview.data.kpi.avg_deviation_pct, unit: "%", delta: 0 },
//       ]
//     : [];

//   return (
//     <div className="app-container">
//       <Header />

//       {overview.error && <div className="r5-error">API: {overview.error}</div>}

//       {overview.loading ? (
//         <div className="r5-loading">Загрузка KPI…</div>
//       ) : (
//         <KpiCards data={kpiData} />
//       )}

//       {dynamics.loading ? (
//         <div className="r5-loading">Загрузка динамики…</div>
//       ) : (
//         <DynamicsChart
//           data={(dynamics.data || []).map((d) => ({
//             x: d.institution_id,
//             "План 2025": d.plan_2025,
//             "Факт 2026": d.fact_2026,
//           }))}
//           title="План 2025 vs Факт 2026 по учреждениям"
//         />
//       )}

//       {!top.loading && (
//         <TopEvents
//           data={(top.data || []).map((d) => ({ name: d.name, value: d.fact_2026 }))}
//           title="Топ-10 показателей"
//         />
//       )}

//       {!breakdown.loading && (
//         <AgePie
//           data={(breakdown.data || []).map((d) => ({ name: d.form, value: d.fact_2026 }))}
//           title="Разбивка по формам"
//         />
//       )}

//       {!heatmap.loading && heatmap.data && (
//         <Heatmap
//           rows={heatmap.data.rows}
//           cols={heatmap.data.cols}
//           values={Object.fromEntries(
//             heatmap.data.rows.map((r, i) => [
//               r,
//               Object.fromEntries(heatmap.data.cols.map((c, j) => [c, heatmap.data.values[i][j]])),
//             ])
//           )}
//           title="Матрица (z-score)"
//         />
//       )}

//       {!table.loading && table.data && (
//         <DataTable
//           data={table.data.items}
//           columns={[
//             { key: "institution_id", label: "Учреждение" },
//             { key: "code", label: "Код" },
//             { key: "name", label: "Показатель" },
//             { key: "fact_2026", label: "Факт", format: (v) => new Intl.NumberFormat("ru-RU").format(v ?? 0) },
//           ]}
//           title="Все показатели (с API)"
//           pageSize={20}
//         />
//       )}
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <FiltersProvider>
//       <Dashboard />
//     </FiltersProvider>
//   );
// }

import React from "react";
import { FiltersProvider, useFilters } from "./context/FiltersContext";
import Header from "./components/Header";
import KpiCards from "./components/KpiCards";
import Heatmap from "./components/Heatmap";
import DataTable from "./components/DataTable";
import { useOverview, useHeatmap, useTable } from "./api/hooks";
import "./App.css";

function Dashboard() {
  const { selectedIds } = useFilters();
  const overview = useOverview(selectedIds);
  const heatmap = useHeatmap("z_score", selectedIds);
  const table = useTable("fact_2026", "desc", "", 20, 0, selectedIds);

  const kpiData = overview.data
    ? [
        { label: "Резиденты", value: overview.data.kpi.residents, unit: "чел.", delta: 0 },
        { label: "Продукты", value: overview.data.kpi.products, unit: "шт.", delta: 0 },
        { label: "Услуги", value: overview.data.kpi.services_rub, unit: "₽", delta: overview.data.plan_vs_fact?.delta_pct ?? 0 },
        { label: "Ср. отклонение", value: overview.data.kpi.avg_deviation_pct, unit: "%", delta: 0 },
      ]
    : [];

  return (
    <div className="app-container">
      <Header />

      {overview.error && <div className="r5-error">API: {overview.error}</div>}

      {overview.loading ? (
        <div className="r5-loading">Загрузка KPI…</div>
      ) : (
        <KpiCards data={kpiData} />
      )}

      {!heatmap.loading && heatmap.data && heatmap.data.rows?.length > 0 && (
        <Heatmap
          rows={heatmap.data.rows}
          cols={heatmap.data.cols}
          matrix={heatmap.data.values}
          title="Матрица (z-score)"
        />
      )}

      {!table.loading && table.data && (
        <DataTable
          data={table.data.items}
          columns={[
            { key: "institution_id", label: "Учреждение" },
            { key: "code", label: "Код" },
            { key: "name", label: "Показатель" },
            { key: "fact_2026", label: "Факт", format: (v) => new Intl.NumberFormat("ru-RU").format(v ?? 0) },
          ]}
          title="Все показатели (с API)"
          pageSize={20}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <FiltersProvider>
      <Dashboard />
    </FiltersProvider>
  );
}