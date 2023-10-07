module.exports = {
  calculateVector: (pos1, pos2) => {
    let delta = [Math.round(pos2[0] - pos1[0]), Math.round(pos2[1] - pos1[1])];
    let distance = parseFloat(Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2)).toFixed(0));
    let thetat = Math.round(Math.atan2(delta[0], delta[1]) / Math.PI * 180);
    let theta = (thetat < 0) ? (360 + thetat) : thetat;
    let compass = ["S", "S.SW", "SW", "W.SW", "W", "W.NW", "NW", "N.NW", "N", "N.NE", "NE", "E.NE", "E", "E.SE", "SE", "S.SE", "S"];
    let dir = compass[Math.round(theta / 22.5)];
  
    return {distance, theta, dir}
  } 
}