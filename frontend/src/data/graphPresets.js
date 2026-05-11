/**
 * Graph Presets — 5 predefined graph templates for demonstration
 */

export const graphPresets = [
  {
    id: 'small-campus',
    name: 'Small Campus',
    description: '8 locations, 12 paths — basic campus layout',
    icon: '🏫',
    nodes: [
      { id: 'Main Gate', label: 'Main Gate', x: 100, y: 300 },
      { id: 'Admin Block', label: 'Admin Block', x: 300, y: 100 },
      { id: 'Library', label: 'Library', x: 550, y: 100 },
      { id: 'Hostel', label: 'Hostel', x: 100, y: 550 },
      { id: 'Canteen', label: 'Canteen', x: 350, y: 400 },
      { id: 'Lab', label: 'Lab', x: 600, y: 400 },
      { id: 'Sports Ground', label: 'Sports Ground', x: 150, y: 750 },
      { id: 'Auditorium', label: 'Auditorium', x: 600, y: 700 }
    ],
    edges: [
      { source: 'Main Gate', target: 'Admin Block', weight: 3 },
      { source: 'Main Gate', target: 'Hostel', weight: 5 },
      { source: 'Admin Block', target: 'Library', weight: 2 },
      { source: 'Admin Block', target: 'Canteen', weight: 4 },
      { source: 'Library', target: 'Lab', weight: 1 },
      { source: 'Hostel', target: 'Canteen', weight: 6 },
      { source: 'Hostel', target: 'Sports Ground', weight: 7 },
      { source: 'Canteen', target: 'Lab', weight: 3 },
      { source: 'Lab', target: 'Auditorium', weight: 2 },
      { source: 'Sports Ground', target: 'Auditorium', weight: 4 },
      { source: 'Main Gate', target: 'Canteen', weight: 8 },
      { source: 'Library', target: 'Canteen', weight: 5 }
    ]
  },
  {
    id: 'large-campus',
    name: 'Large Campus',
    description: '15 locations, 22 paths — extended campus',
    icon: '🏛️',
    nodes: [
      { id: 'Main Gate', label: 'Main Gate', x: 80, y: 400 },
      { id: 'Admin Block', label: 'Admin Block', x: 250, y: 200 },
      { id: 'Library', label: 'Library', x: 450, y: 100 },
      { id: 'Hostel A', label: 'Hostel A', x: 80, y: 650 },
      { id: 'Hostel B', label: 'Hostel B', x: 250, y: 700 },
      { id: 'Canteen', label: 'Canteen', x: 400, y: 400 },
      { id: 'CS Lab', label: 'CS Lab', x: 600, y: 200 },
      { id: 'Physics Lab', label: 'Physics Lab', x: 700, y: 350 },
      { id: 'Auditorium', label: 'Auditorium', x: 550, y: 550 },
      { id: 'Sports Ground', label: 'Sports Ground', x: 200, y: 850 },
      { id: 'Parking', label: 'Parking', x: 100, y: 200 },
      { id: 'Gate 2', label: 'Gate 2', x: 750, y: 500 },
      { id: 'Workshop', label: 'Workshop', x: 650, y: 700 },
      { id: 'Seminar Hall', label: 'Seminar Hall', x: 350, y: 600 },
      { id: 'Medical Center', label: 'Medical Center', x: 500, y: 300 }
    ],
    edges: [
      { source: 'Main Gate', target: 'Admin Block', weight: 3 },
      { source: 'Main Gate', target: 'Parking', weight: 2 },
      { source: 'Main Gate', target: 'Hostel A', weight: 5 },
      { source: 'Admin Block', target: 'Library', weight: 4 },
      { source: 'Admin Block', target: 'Canteen', weight: 3 },
      { source: 'Parking', target: 'Admin Block', weight: 2 },
      { source: 'Library', target: 'CS Lab', weight: 2 },
      { source: 'Library', target: 'Medical Center', weight: 3 },
      { source: 'CS Lab', target: 'Physics Lab', weight: 2 },
      { source: 'Medical Center', target: 'Canteen', weight: 2 },
      { source: 'Medical Center', target: 'Physics Lab', weight: 3 },
      { source: 'Canteen', target: 'Auditorium', weight: 4 },
      { source: 'Canteen', target: 'Seminar Hall', weight: 3 },
      { source: 'Hostel A', target: 'Hostel B', weight: 2 },
      { source: 'Hostel B', target: 'Canteen', weight: 5 },
      { source: 'Hostel B', target: 'Seminar Hall', weight: 3 },
      { source: 'Hostel A', target: 'Sports Ground', weight: 4 },
      { source: 'Sports Ground', target: 'Workshop', weight: 6 },
      { source: 'Auditorium', target: 'Workshop', weight: 3 },
      { source: 'Physics Lab', target: 'Gate 2', weight: 2 },
      { source: 'Gate 2', target: 'Workshop', weight: 4 },
      { source: 'Seminar Hall', target: 'Auditorium', weight: 2 }
    ]
  },
  {
    id: 'city-grid',
    name: 'City Grid',
    description: '16 intersections, 24 roads — 4×4 grid layout',
    icon: '🏙️',
    nodes: [
      { id: 'A1', label: 'A1', x: 100, y: 100 },
      { id: 'A2', label: 'A2', x: 300, y: 100 },
      { id: 'A3', label: 'A3', x: 500, y: 100 },
      { id: 'A4', label: 'A4', x: 700, y: 100 },
      { id: 'B1', label: 'B1', x: 100, y: 300 },
      { id: 'B2', label: 'B2', x: 300, y: 300 },
      { id: 'B3', label: 'B3', x: 500, y: 300 },
      { id: 'B4', label: 'B4', x: 700, y: 300 },
      { id: 'C1', label: 'C1', x: 100, y: 500 },
      { id: 'C2', label: 'C2', x: 300, y: 500 },
      { id: 'C3', label: 'C3', x: 500, y: 500 },
      { id: 'C4', label: 'C4', x: 700, y: 500 },
      { id: 'D1', label: 'D1', x: 100, y: 700 },
      { id: 'D2', label: 'D2', x: 300, y: 700 },
      { id: 'D3', label: 'D3', x: 500, y: 700 },
      { id: 'D4', label: 'D4', x: 700, y: 700 }
    ],
    edges: [
      // Row A
      { source: 'A1', target: 'A2', weight: 2 },
      { source: 'A2', target: 'A3', weight: 3 },
      { source: 'A3', target: 'A4', weight: 1 },
      // Row B
      { source: 'B1', target: 'B2', weight: 4 },
      { source: 'B2', target: 'B3', weight: 2 },
      { source: 'B3', target: 'B4', weight: 5 },
      // Row C
      { source: 'C1', target: 'C2', weight: 1 },
      { source: 'C2', target: 'C3', weight: 3 },
      { source: 'C3', target: 'C4', weight: 2 },
      // Row D
      { source: 'D1', target: 'D2', weight: 2 },
      { source: 'D2', target: 'D3', weight: 4 },
      { source: 'D3', target: 'D4', weight: 3 },
      // Column 1
      { source: 'A1', target: 'B1', weight: 3 },
      { source: 'B1', target: 'C1', weight: 2 },
      { source: 'C1', target: 'D1', weight: 4 },
      // Column 2
      { source: 'A2', target: 'B2', weight: 1 },
      { source: 'B2', target: 'C2', weight: 5 },
      { source: 'C2', target: 'D2', weight: 2 },
      // Column 3
      { source: 'A3', target: 'B3', weight: 2 },
      { source: 'B3', target: 'C3', weight: 1 },
      { source: 'C3', target: 'D3', weight: 3 },
      // Column 4
      { source: 'A4', target: 'B4', weight: 4 },
      { source: 'B4', target: 'C4', weight: 3 },
      { source: 'C4', target: 'D4', weight: 1 }
    ]
  },
  {
    id: 'complex-network',
    name: 'Complex Network',
    description: '12 nodes, 25 connections — dense interconnected graph',
    icon: '🕸️',
    nodes: [
      { id: 'Hub', label: 'Hub', x: 400, y: 400 },
      { id: 'N1', label: 'N1', x: 200, y: 150 },
      { id: 'N2', label: 'N2', x: 400, y: 100 },
      { id: 'N3', label: 'N3', x: 600, y: 150 },
      { id: 'N4', label: 'N4', x: 700, y: 350 },
      { id: 'N5', label: 'N5', x: 650, y: 550 },
      { id: 'N6', label: 'N6', x: 500, y: 700 },
      { id: 'N7', label: 'N7', x: 300, y: 700 },
      { id: 'N8', label: 'N8', x: 150, y: 550 },
      { id: 'N9', label: 'N9', x: 100, y: 350 },
      { id: 'N10', label: 'N10', x: 300, y: 250 },
      { id: 'N11', label: 'N11', x: 500, y: 250 }
    ],
    edges: [
      { source: 'Hub', target: 'N1', weight: 5 },
      { source: 'Hub', target: 'N2', weight: 3 },
      { source: 'Hub', target: 'N3', weight: 4 },
      { source: 'Hub', target: 'N4', weight: 2 },
      { source: 'Hub', target: 'N5', weight: 6 },
      { source: 'Hub', target: 'N6', weight: 4 },
      { source: 'Hub', target: 'N7', weight: 5 },
      { source: 'Hub', target: 'N8', weight: 3 },
      { source: 'Hub', target: 'N9', weight: 2 },
      { source: 'N1', target: 'N2', weight: 2 },
      { source: 'N2', target: 'N3', weight: 3 },
      { source: 'N3', target: 'N4', weight: 2 },
      { source: 'N4', target: 'N5', weight: 4 },
      { source: 'N5', target: 'N6', weight: 3 },
      { source: 'N6', target: 'N7', weight: 2 },
      { source: 'N7', target: 'N8', weight: 4 },
      { source: 'N8', target: 'N9', weight: 3 },
      { source: 'N9', target: 'N1', weight: 5 },
      { source: 'N10', target: 'N1', weight: 2 },
      { source: 'N10', target: 'Hub', weight: 1 },
      { source: 'N11', target: 'N3', weight: 2 },
      { source: 'N11', target: 'Hub', weight: 1 },
      { source: 'N10', target: 'N11', weight: 3 },
      { source: 'N1', target: 'N9', weight: 5 },
      { source: 'N5', target: 'N11', weight: 4 }
    ]
  },
  {
    id: 'sparse-graph',
    name: 'Sparse Graph',
    description: '10 nodes, 11 connections — tree-like minimal paths',
    icon: '🌿',
    nodes: [
      { id: 'Root', label: 'Root', x: 400, y: 50 },
      { id: 'L1', label: 'L1', x: 200, y: 200 },
      { id: 'R1', label: 'R1', x: 600, y: 200 },
      { id: 'L2', label: 'L2', x: 100, y: 380 },
      { id: 'L3', label: 'L3', x: 300, y: 380 },
      { id: 'R2', label: 'R2', x: 500, y: 380 },
      { id: 'R3', label: 'R3', x: 700, y: 380 },
      { id: 'L4', label: 'L4', x: 50, y: 560 },
      { id: 'L5', label: 'L5', x: 200, y: 560 },
      { id: 'R4', label: 'R4', x: 650, y: 560 }
    ],
    edges: [
      { source: 'Root', target: 'L1', weight: 4 },
      { source: 'Root', target: 'R1', weight: 3 },
      { source: 'L1', target: 'L2', weight: 5 },
      { source: 'L1', target: 'L3', weight: 2 },
      { source: 'R1', target: 'R2', weight: 6 },
      { source: 'R1', target: 'R3', weight: 1 },
      { source: 'L2', target: 'L4', weight: 3 },
      { source: 'L2', target: 'L5', weight: 7 },
      { source: 'R3', target: 'R4', weight: 2 },
      { source: 'L3', target: 'R2', weight: 8 },
      { source: 'L5', target: 'L3', weight: 4 }
    ]
  }
];
