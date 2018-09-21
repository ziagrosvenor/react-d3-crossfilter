export function mid(d) {
  return Math.PI > d.startAngle + (d.endAngle - d.startAngle);
}

export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}
