export function getPublicDomRoots(documentRef = document) {
  return {
    heroNotebook: documentRef.getElementById("heroNotebook"),
    infiniteMenu: documentRef.getElementById("infiniteMenu"),
    orbitCanvas: documentRef.getElementById("orbitCanvas"),
    orbitTitle: documentRef.getElementById("orbitTitle"),
    orbitDescription: documentRef.getElementById("orbitDescription"),
    orbitAction: documentRef.getElementById("orbitAction"),
    heroPressure: documentRef.getElementById("heroPressure"),
    heroLanyard: documentRef.getElementById("heroLanyard"),
    levelBoard: documentRef.getElementById("levelBoard"),
    levelSongPicker: documentRef.getElementById("levelSongPicker"),
    queryInput: documentRef.getElementById("queryInput"),
    sourceFilter: documentRef.getElementById("sourceFilter"),
    categoryFilter: documentRef.getElementById("categoryFilter"),
    levelFilter: documentRef.getElementById("levelFilter"),
    techCloud: documentRef.getElementById("techCloud"),
    songDetail: documentRef.getElementById("songDetail")
  };
}
