let data = [];
let barGraph;
let dropdown;
let selectedSeason = "2023"; // Default season

function setup() {
  createCanvas(1200, 500);  // Increased canvas width for better spacing
  textAlign(CENTER, CENTER);

  // Embed CSV data for multiple seasons
  let csvData = `Player,BPM,Season
Lebron James,8.6,2023
Giannis Antetokounmpo,8.4,2023
Luka Dončić,7.9,2023
Kevin Durant,7.7,2023
Stephen Curry,7.4,2023
Jimmy Butler,6.9,2023
Joel Embiid,6.5,2023
Nikola Jokić,6.2,2023
Jayson Tatum,5.9,2023
Kawhi Leonard,5.5,2023
LeBron James,7.8,2022
Giannis Antetokounmpo,7.5,2022
Luka Dončić,7.3,2022
Kevin Durant,7.1,2022
Stephen Curry,6.9,2022
Jimmy Butler,6.4,2022
Joel Embiid,6.2,2022
Nikola Jokić,6.1,2022
Jayson Tatum,5.8,2022
Kawhi Leonard,5.4,2022
LeBron James,9.1,2021
Giannis Antetokounmpo,8.8,2021
Luka Dončić,8.6,2021
Kevin Durant,8.3,2021
Stephen Curry,8.0,2021
Jimmy Butler,7.8,2021
Joel Embiid,7.4,2021
Nikola Jokić,7.0,2021
Jayson Tatum,6.7,2021
Kawhi Leonard,6.5,2021`;

  // Parse the CSV data
  data = createCSV(csvData);

  // Extract unique seasons and create a dropdown
  let seasons = [...new Set(data.getColumn("Season"))];
  dropdown = createSelect();
  dropdown.position(10, 10);
  seasons.forEach(season => dropdown.option(season));
  dropdown.changed(updateData);

  barGraph = new BarGraph(50, 80, width - 100, height - 150); // Create BarGraph instance
  updateData(); // Initial data
}

function updateData() {
  selectedSeason = dropdown.value();
  let players = [];

  // Filter data for selected season of top 10 BPM players
  for (let i = 0; i < data.getRowCount(); i++) {
    if (data.getString(i, "Season") === selectedSeason) {
      players.push({
        name: data.getString(i, "Player"),
        bpm: float(data.getString(i, "BPM"))
      });
    }
  }

  players.sort((a, b) => b.bpm - a.bpm); // Sort by BPM
  players = players.slice(0, 10); // Top 10

  barGraph.setData(players); // Data in BarGraph
}

function draw() {
  background(30);
  fill(255);
  textSize(18);
  text(`Top 10 NBA BPM Players (${selectedSeason})`, width / 2, 50);
  barGraph.draw(); // Draw the graph
}

// BarGraph class definition
class BarGraph {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.data = [];
  }

  setData(data) {
    this.data = data;
  }

  draw() {
    if (this.data.length === 0) return;

    let barWidth = this.w / this.data.length - 25; // Adjust bar width for better spacing

    for (let i = 0; i < this.data.length; i++) {
      let x = this.x + i * (barWidth + 25); // Increase spacing between bars
      let y = this.y + this.h;
      let barHeight = map(this.data[i].bpm, 0, 15, 0, this.h);

      // Bars
      fill(0, 102, 204);
      rect(x, y - barHeight, barWidth, barHeight);

      // Making sure they don't overlap
      fill(255);
      textSize(12);
      text(this.data[i].name, x + barWidth / 2, this.y + this.h + 40); // Spacing

      // Look at data hovering
      if (mouseX > x && mouseX < x + barWidth && mouseY > y - barHeight && mouseY < y) {
        fill(255, 200);
        textSize(14);
        text(`${this.data[i].name}: ${this.data[i].bpm.toFixed(1)}`, mouseX, mouseY - 10);
      }
    }
  }
}

// Loading CSV from a string
function createCSV(csvData) {
  let table = new p5.Table();
  let rows = csvData.split('\n');
  let headers = rows[0].split(',');

  // Headers to the table
  for (let header of headers) {
    table.addColumn(header);
  }

  // Rows to the table
  for (let i = 1; i < rows.length; i++) {
    let row = rows[i].split(',');
    let newRow = table.addRow();
    for (let j = 0; j < row.length; j++) {
      newRow.setString(headers[j], row[j]);
    }
  }

  return table;
}

