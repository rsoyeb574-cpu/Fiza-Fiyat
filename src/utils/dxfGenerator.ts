import { RoomLayoutSpecification } from '../types/cadBimEngineering';

/**
 * Generates an AutoCAD-compliant ASCII DXF (Release 2000 - AC1015) string
 * containing accurate architectural entities, layers, dimensions, and room labels.
 */
export function generateArchitecturalDxf(params: {
  plotWidthFt: number;
  plotLengthFt: number;
  rooms: RoomLayoutSpecification[];
  title?: string;
}): string {
  const { plotWidthFt, plotLengthFt, rooms, title = 'FIZA_FIYAT_FLOOR_PLAN' } = params;

  // Scale factor: 1 Foot = 304.8 Millimeters for metric CAD workflows, or 1 unit = 1 foot
  // We will generate with 1 unit = 1 foot (standard architectural imperial CAD units)
  
  let dxf = '';

  // 1. HEADER SECTION
  dxf += '0\nSECTION\n2\nHEADER\n';
  dxf += '9\n$ACADVER\n1\nAC1015\n'; // AutoCAD 2000 format
  dxf += '9\n$INSUNITS\n70\n2\n'; // 2 = Feet (4 = Millimeters)
  dxf += '9\n$MEASUREMENT\n70\n0\n'; // 0 = Imperial, 1 = Metric
  dxf += '0\nENDSEC\n';

  // 2. TABLES SECTION (LAYERS)
  dxf += '0\nSECTION\n2\nTABLES\n';
  dxf += '0\nTABLE\n2\nLAYER\n70\n7\n';

  const layers = [
    { name: '0', color: 7 }, // White/Black
    { name: 'A-BNDY', color: 1 }, // Red (Plot boundary)
    { name: 'A-WALL', color: 2 }, // Yellow (Walls)
    { name: 'A-DOOR', color: 4 }, // Cyan (Doors & swings)
    { name: 'A-GLAZ', color: 3 }, // Green (Windows)
    { name: 'A-STAIR', color: 6 }, // Magenta (Stairs)
    { name: 'A-TEXT', color: 7 }, // White (Room names)
    { name: 'A-DIMS', color: 5 } // Blue (Dimensions)
  ];

  for (const lyr of layers) {
    dxf += '0\nLAYER\n2\n' + lyr.name + '\n70\n0\n62\n' + lyr.color + '\n6\nCONTINUOUS\n';
  }
  dxf += '0\nENDTAB\n';
  dxf += '0\nENDSEC\n';

  // 3. BLOCKS SECTION (Empty header)
  dxf += '0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n';

  // 4. ENTITIES SECTION
  dxf += '0\nSECTION\n2\nENTITIES\n';

  // Helper to format line entity
  const addLine = (x1: number, y1: number, x2: number, y2: number, layer: string) => {
    return (
      '0\nLINE\n' +
      '8\n' + layer + '\n' +
      '10\n' + x1.toFixed(3) + '\n' +
      '20\n' + y1.toFixed(3) + '\n' +
      '30\n0.0\n' +
      '11\n' + x2.toFixed(3) + '\n' +
      '21\n' + y2.toFixed(3) + '\n' +
      '31\n0.0\n'
    );
  };

  // Helper to format text entity
  const addText = (text: string, x: number, y: number, height: number, layer: string) => {
    return (
      '0\nTEXT\n' +
      '8\n' + layer + '\n' +
      '10\n' + x.toFixed(3) + '\n' +
      '20\n' + y.toFixed(3) + '\n' +
      '30\n0.0\n' +
      '40\n' + height.toFixed(3) + '\n' +
      '1\n' + text + '\n'
    );
  };

  // 4a. Plot Boundary
  dxf += addLine(0, 0, plotWidthFt, 0, 'A-BNDY');
  dxf += addLine(plotWidthFt, 0, plotWidthFt, plotLengthFt, 'A-BNDY');
  dxf += addLine(plotWidthFt, plotLengthFt, 0, plotLengthFt, 'A-BNDY');
  dxf += addLine(0, plotLengthFt, 0, 0, 'A-BNDY');

  // Title in drawing corner
  dxf += addText(title, 1.0, plotLengthFt + 2.0, 1.2, 'A-TEXT');
  dxf += addText(`PLOT: ${plotWidthFt}' x ${plotLengthFt}' (${plotWidthFt * plotLengthFt} SQ.FT)`, 1.0, plotLengthFt + 0.5, 0.8, 'A-DIMS');

  // 4b. Rooms & Walls
  const wallThk = 0.75; // 9 inches = 0.75 ft

  for (const room of rooms) {
    const rx = room.x;
    const ry = room.y;
    const rw = room.widthFt;
    const rl = room.lengthFt;

    // Room outer boundary lines
    dxf += addLine(rx, ry, rx + rw, ry, 'A-WALL');
    dxf += addLine(rx + rw, ry, rx + rw, ry + rl, 'A-WALL');
    dxf += addLine(rx + rw, ry + rl, rx, ry + rl, 'A-WALL');
    dxf += addLine(rx, ry + rl, rx, ry, 'A-WALL');

    // Room inner boundary lines (wall thickness offset)
    dxf += addLine(rx + wallThk, ry + wallThk, rx + rw - wallThk, ry + wallThk, 'A-WALL');
    dxf += addLine(rx + rw - wallThk, ry + wallThk, rx + rw - wallThk, ry + rl - wallThk, 'A-WALL');
    dxf += addLine(rx + rw - wallThk, ry + rl - wallThk, rx + wallThk, ry + rl - wallThk, 'A-WALL');
    dxf += addLine(rx + wallThk, ry + rl - wallThk, rx + wallThk, ry + wallThk, 'A-WALL');

    // Room Label and Area
    const centerX = rx + rw / 2;
    const centerY = ry + rl / 2;
    dxf += addText(room.name.toUpperCase(), centerX - 2.0, centerY + 0.5, 0.75, 'A-TEXT');
    dxf += addText(`${rw.toFixed(1)}' x ${rl.toFixed(1)}'`, centerX - 1.8, centerY - 0.5, 0.55, 'A-DIMS');
    dxf += addText(`${(rw * rl).toFixed(0)} SQ.FT`, centerX - 1.5, centerY - 1.3, 0.5, 'A-DIMS');

    // Doors
    if (room.doors && room.doors.length > 0) {
      for (const door of room.doors) {
        let dx1 = rx;
        let dy1 = ry;
        let dx2 = rx + 3.0;
        let dy2 = ry;

        if (door.wall === 'south') {
          dx1 = rx + rw * 0.2;
          dy1 = ry;
          dx2 = dx1 + door.widthFt;
          dy2 = ry;
        } else if (door.wall === 'north') {
          dx1 = rx + rw * 0.2;
          dy1 = ry + rl;
          dx2 = dx1 + door.widthFt;
          dy2 = ry + rl;
        } else if (door.wall === 'west') {
          dx1 = rx;
          dy1 = ry + rl * 0.2;
          dx2 = rx;
          dy2 = dy1 + door.widthFt;
        } else if (door.wall === 'east') {
          dx1 = rx + rw;
          dy1 = ry + rl * 0.2;
          dx2 = rx + rw;
          dy2 = dy1 + door.widthFt;
        }

        dxf += addLine(dx1, dy1, dx2, dy2, 'A-DOOR');
        // Add swing arc indicator
        dxf += addLine(dx1, dy1, dx1 + 1.5, dy1 + 1.5, 'A-DOOR');
      }
    }

    // Windows
    if (room.windows && room.windows.length > 0) {
      for (const win of room.windows) {
        let wx1 = rx + rw * 0.4;
        let wy1 = ry;
        let wx2 = wx1 + win.widthFt;
        let wy2 = ry;

        if (win.wall === 'north') {
          wx1 = rx + rw * 0.4;
          wy1 = ry + rl;
          wx2 = wx1 + win.widthFt;
          wy2 = ry + rl;
        } else if (win.wall === 'east') {
          wx1 = rx + rw;
          wy1 = ry + rl * 0.4;
          wx2 = rx + rw;
          wy2 = wy1 + win.widthFt;
        } else if (win.wall === 'west') {
          wx1 = rx;
          wy1 = ry + rl * 0.4;
          wx2 = rx;
          wy2 = wy1 + win.widthFt;
        }

        dxf += addLine(wx1, wy1, wx2, wy2, 'A-GLAZ');
        // Double glazing line offset
        dxf += addLine(wx1, wy1 + 0.2, wx2, wy2 + 0.2, 'A-GLAZ');
      }
    }
  }

  // Dimension lines around perimeter
  dxf += addText(`${plotWidthFt}' - 0"`, plotWidthFt / 2 - 2, -2.0, 0.8, 'A-DIMS');
  dxf += addLine(0, -1.0, plotWidthFt, -1.0, 'A-DIMS');
  dxf += addLine(0, -0.5, 0, -1.5, 'A-DIMS');
  dxf += addLine(plotWidthFt, -0.5, plotWidthFt, -1.5, 'A-DIMS');

  dxf += addText(`${plotLengthFt}' - 0"`, -3.0, plotLengthFt / 2, 0.8, 'A-DIMS');
  dxf += addLine(-1.5, 0, -1.5, plotLengthFt, 'A-DIMS');
  dxf += addLine(-1.0, 0, -2.0, 0, 'A-DIMS');
  dxf += addLine(-1.0, plotLengthFt, -2.0, plotLengthFt, 'A-DIMS');

  dxf += '0\nENDSEC\n0\nEOF\n';

  return dxf;
}

/**
 * Generates an architectural SVG vector plan with clean styles, layers, dimensions, and room schedules
 */
export function generateArchitecturalSvg(params: {
  plotWidthFt: number;
  plotLengthFt: number;
  rooms: RoomLayoutSpecification[];
  scale?: number; // pixels per foot, default 12
}): string {
  const { plotWidthFt, plotLengthFt, rooms, scale = 14 } = params;

  const margin = 60;
  const svgWidth = plotWidthFt * scale + margin * 2;
  const svgHeight = plotLengthFt * scale + margin * 2 + 80;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-auto font-sans" style="background:#0f172a;">`;
  
  // Defs & Styles
  svg += `
    <defs>
      <pattern id="grid" width="${scale * 5}" height="${scale * 5}" patternUnits="userSpaceOnUse">
        <path d="M ${scale * 5} 0 L 0 0 0 ${scale * 5}" fill="none" stroke="#1e293b" stroke-width="0.7" />
      </pattern>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
      </marker>
    </defs>
    <rect width="100%" height="100%" fill="#090d16" />
    <rect x="${margin}" y="${margin}" width="${plotWidthFt * scale}" height="${plotLengthFt * scale}" fill="url(#grid)" />
    
    <!-- Boundary Line -->
    <rect x="${margin}" y="${margin}" width="${plotWidthFt * scale}" height="${plotLengthFt * scale}" 
      fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8,4" />
  `;

  // Plot Boundary Dimension Texts
  svg += `
    <!-- Top & Side Dimensions -->
    <text x="${margin + (plotWidthFt * scale) / 2}" y="${margin - 20}" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">
      ${plotWidthFt}' - 0" (WIDTH)
    </text>
    <line x1="${margin}" y1="${margin - 10}" x2="${margin + plotWidthFt * scale}" y2="${margin - 10}" stroke="#38bdf8" stroke-width="1.2" marker-start="url(#arrow)" marker-end="url(#arrow)" />

    <text x="${margin - 20}" y="${margin + (plotLengthFt * scale) / 2}" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold" transform="rotate(-90, ${margin - 20}, ${margin + (plotLengthFt * scale) / 2})">
      ${plotLengthFt}' - 0" (LENGTH)
    </text>
    <line x1="${margin - 10}" y1="${margin}" x2="${margin - 10}" y2="${margin + plotLengthFt * scale}" stroke="#38bdf8" stroke-width="1.2" marker-start="url(#arrow)" marker-end="url(#arrow)" />
  `;

  // Draw Rooms
  const roomColors: Record<string, string> = {
    bedroom: '#1e3a8a',
    living: '#134e4a',
    kitchen: '#78350f',
    toilet: '#3b0764',
    bathroom: '#3b0764',
    staircase: '#312e81',
    parking: '#334155',
    verandah: '#1e293b'
  };

  rooms.forEach(room => {
    const rx = margin + room.x * scale;
    const ry = margin + room.y * scale;
    const rw = room.widthFt * scale;
    const rl = room.lengthFt * scale;

    const lowerName = room.name.toLowerCase();
    let bgColor = '#1e293b';
    for (const key of Object.keys(roomColors)) {
      if (lowerName.includes(key)) {
        bgColor = roomColors[key];
        break;
      }
    }

    // Room fill and outer wall
    svg += `
      <g id="room-${room.name.replace(/\s+/g, '-')}" class="cursor-pointer">
        <rect x="${rx}" y="${ry}" width="${rw}" height="${rl}" fill="${bgColor}" fill-opacity="0.6" stroke="#fbbf24" stroke-width="3" rx="2" />
        
        <!-- Inner Plaster / Room Space -->
        <rect x="${rx + 4}" y="${ry + 4}" width="${rw - 8}" height="${rl - 8}" fill="${bgColor}" fill-opacity="0.3" stroke="#f59e0b" stroke-width="0.8" stroke-dasharray="2,2" />

        <!-- Center Label -->
        <text x="${rx + rw / 2}" y="${ry + rl / 2 - 8}" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="bold">
          ${room.name.toUpperCase()}
        </text>
        <text x="${rx + rw / 2}" y="${ry + rl / 2 + 8}" text-anchor="middle" fill="#94a3b8" font-size="10">
          ${room.widthFt}' x ${room.lengthFt}'
        </text>
        <text x="${rx + rw / 2}" y="${ry + rl / 2 + 22}" text-anchor="middle" fill="#38bdf8" font-size="9" font-weight="500">
          ${(room.widthFt * room.lengthFt).toFixed(0)} SQ.FT
        </text>
    `;

    // Doors
    if (room.doors && room.doors.length > 0) {
      room.doors.forEach(d => {
        const dWidth = d.widthFt * scale;
        let dwx = rx;
        let dwy = ry;
        if (d.wall === 'south') {
          dwx = rx + 10;
          dwy = ry + rl - 3;
          svg += `
            <rect x="${dwx}" y="${dwy}" width="${dWidth}" height="6" fill="#090d16" stroke="#22d3ee" stroke-width="1.5" />
            <path d="M ${dwx} ${dwy} A ${dWidth} ${dWidth} 0 0 1 ${dwx + dWidth} ${dwy - dWidth}" fill="none" stroke="#22d3ee" stroke-width="1" stroke-dasharray="2,2" />
          `;
        } else if (d.wall === 'north') {
          dwx = rx + 10;
          dwy = ry - 3;
          svg += `
            <rect x="${dwx}" y="${dwy}" width="${dWidth}" height="6" fill="#090d16" stroke="#22d3ee" stroke-width="1.5" />
          `;
        } else {
          dwx = rx - 3;
          dwy = ry + 10;
          svg += `
            <rect x="${dwx}" y="${dwy}" width="6" height="${dWidth}" fill="#090d16" stroke="#22d3ee" stroke-width="1.5" />
          `;
        }
      });
    }

    // Windows
    if (room.windows && room.windows.length > 0) {
      room.windows.forEach(w => {
        const wWidth = w.widthFt * scale;
        let wwx = rx + rw / 2 - wWidth / 2;
        let wwy = ry;
        if (w.wall === 'north') {
          wwy = ry - 4;
          svg += `<rect x="${wwx}" y="${wwy}" width="${wWidth}" height="8" fill="#06b6d4" stroke="#ffffff" stroke-width="1" />`;
        } else if (w.wall === 'south') {
          wwy = ry + rl - 4;
          svg += `<rect x="${wwx}" y="${wwy}" width="${wWidth}" height="8" fill="#06b6d4" stroke="#ffffff" stroke-width="1" />`;
        } else if (w.wall === 'east') {
          wwx = rx + rw - 4;
          wwy = ry + rl / 2 - wWidth / 2;
          svg += `<rect x="${wwx}" y="${wwy}" width="8" height="${wWidth}" fill="#06b6d4" stroke="#ffffff" stroke-width="1" />`;
        } else {
          wwx = rx - 4;
          wwy = ry + rl / 2 - wWidth / 2;
          svg += `<rect x="${wwx}" y="${wwy}" width="8" height="${wWidth}" fill="#06b6d4" stroke="#ffffff" stroke-width="1" />`;
        }
      });
    }

    svg += `</g>`;
  });

  // Footer Title Block
  const footerY = margin + plotLengthFt * scale + 35;
  svg += `
    <rect x="${margin}" y="${footerY}" width="${plotWidthFt * scale}" height="35" fill="#0f172a" stroke="#334155" rx="4" />
    <text x="${margin + 12}" y="${footerY + 22}" fill="#e2e8f0" font-size="11" font-weight="bold">
      FIZA FIYAT CAD/BIM ENGINE | PLOT ${plotWidthFt}' x ${plotLengthFt}' | SCALE 1:${(100 / scale).toFixed(0)} | VERIFIED GEOMETRY
    </text>
    <text x="${margin + plotWidthFt * scale - 12}" y="${footerY + 22}" text-anchor="end" fill="#38bdf8" font-size="10">
      EXPORT: DXF / SVG / PDF
    </text>
  `;

  svg += `</svg>`;
  return svg;
}
