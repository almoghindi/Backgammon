export function existsInMap(name, map) {
    const arr = Object.keys(map);
    return arr.includes(name);
  }
  
  export function getGameId(username, opponent) {
    const sortedNames = [username, opponent].sort();
    return sortedNames.join("-");
  }
 