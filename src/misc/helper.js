// Initial Names
export function getNameInitials(name) {
  const splitname = name.toUpperCase().split(' ');

  // If name word is > 1
  if (splitname.length > 1) {
    return splitname[0][0] + splitname[1][0]; // Puja Sharma return P+S
  }

  // if name word == 1
  return splitname[0][0];
}

// Transform it into an Array
export function transformIntoArray(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map(roomId => {
        return { ...snapVal[roomId], id: roomId };
      })
    : [];
}
