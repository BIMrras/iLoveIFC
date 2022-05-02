import { IfcAPI, IFCWALLSTANDARDCASE } from "web-ifc/web-ifc-api";

const ifcApi = new IfcAPI();
ifcApi.Init();
ifcApi.SetWasmPath("web-ifc.wasm")

const input = document.getElementById("input-element");
const drop = document.getElementById("dropArea");

drop.onclick = () => {
    console.log("Pulsado el botón");
    input.click();
}

input.onchange = (changed) => {
  const reader = new FileReader();
  reader.onload = () => LoadIFC(reader.result);
  reader.readAsText(changed.target.files[0]);
}

drop.ondrop = (ev) => { 
  console.log('Fichero(s) arrastrados');

  // Evitar el comportamiendo por defecto (Evitar que el fichero se abra/ejecute)
  ev.preventDefault();

  console.log("salta el evento!");

  if (ev.dataTransfer.items) {
    // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // Si los elementos arrastrados no son ficheros, rechazarlos
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
      }
    }
  } else {
    // Usar la interfaz DataTransfer para acceder a el/los archivos
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
    }
  }

  // Pasar el evento a removeDragData para limpiar
  removeDragData(ev)
}

drop.ondragover = (ev) => {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function LoadIFC(ifcData){
  console.log(ifcData)
  const modelID = ifcApi.OpenModel(ifcData);

  const allItems = ifcApi.GetAllLines(modelID);

  const walls = ifcApi.GetLineIDsWithType(modelID, IFCWALLSTANDARDCASE);

  const firstWall = walls.get(0);
  const wallProps = ifcApi.GetLine(modelID,firstWall);

  const result = JSON.stringify(wallProps, undefined,2);
}

function removeDragData(ev) {
  console.log('Removing drag data')

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    ev.dataTransfer.items.clear();
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
}
