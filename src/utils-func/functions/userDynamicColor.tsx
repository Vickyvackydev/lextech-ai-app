export function getBackgroundColor(name: string): string {
  const colors: { [key: string]: string } = {
    a: "#FF5733",
    b: "#3366FF",
    c: "#33CC33",
    d: "#FFFF00",
    e: "#FFA500",
    f: "#800080",
    g: "#00FFFF",
    h: "#FF00FF",
    i: "#FFC0CB",
    j: "#00FF00",
    k: "#008080",
    l: "#A52A2A",
    m: "#808000",
    n: "#000080",
    o: "#800000",
    p: "#FF7F50",
    q: "#FFD700",
    r: "#4B0082",
    s: "#40E0D0",
    t: "#C0C0C0",
    u: "#EE82EE",
    v: "#DA70D6",
    w: "#F0E68C",
    x: "#708090",
    y: "#006400",
    z: "#ADD8E6",
  };

  const firstLetter = name.charAt(0).toLowerCase();
  return colors[firstLetter] || "#ADD8E6"; // If no matching color found, return white
}
