import { Injectable } from "@angular/core";

import {environment} from "../../../environments/environment";
import { BlockBlobClient ,BlobServiceClient, ContainerClient } from '@azure/storage-blob';
@Injectable({ providedIn: "root" })
export class AzureService {
  constructor() {}
  async uploadFile(
    file: any,
    filename: any
  ): Promise<{
    response:any;
    uuidFileName:any;
  }> {
    const extension = "." + filename.split(".").pop();
    const uuidFileName = this.generateUUID();
    const cn = this.getConnectionURL(uuidFileName + extension);
    const blobBlockClient = new BlockBlobClient(cn);
    const res = await blobBlockClient.uploadBrowserData(file);
    return { response: res, uuidFileName: uuidFileName + extension };
  }
  private containerClient(sas: string): ContainerClient {
    return new BlobServiceClient(`https://${environment.azureAccountName}.blob.core.windows.net?${sas}`)
      .getContainerClient(environment.azureContaineName);
  }


  public deleteImage(name: string, handler: () => void) {
    this.deleteBlob(name, this.containerClient(environment.azureSas), handler)
  }
  private deleteBlob(name: string, client: ContainerClient, handler: () => void) {
    client.deleteBlob(name).then(() => {
      handler()
    })
  }

  public downloadImage( name: string, handler: (blob: Blob) => void) {
    this.downloadBlob(name, this.containerClient(environment.azureSas), handler)
  }

  private downloadBlob(name: string, client: ContainerClient, handler: (blob: Blob) => void) {
    const blobClient = client.getBlobClient(name);
    blobClient.download().then((resp:any) => {
      resp.blobBody.then((blob :any)=> {
        handler(blob)
      })
    })
  }
  getConnectionURL(resourceName: any): string {
    const base = this.getResourceUrl(resourceName);
    const sas = environment.azureSas;
    return `${base}?${sas}`;
  }
  getResourceUrl(resourceName: any): string {
    return `https://${environment.azureAccountName}.blob.core.windows.net/${environment.azureContaineName}/${resourceName}`;
  }
  generateUUID(): any {
    var d = new Date().getTime();
    const time = d;
    var d2 = (performance && performance.now && performance.now() * 1000) || 0;
    return (
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }) +
      "-" +
      String(time)
    );
  }

  downloadImagefile(row: any) {
    this.downloadImage(row.NombreInterno, blob => {
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = row.NombreExterno;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  }

}
