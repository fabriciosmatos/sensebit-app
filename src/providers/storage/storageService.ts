import { Storage } from "@ionic/storage";
import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor(public storage: Storage) { 
  }

  public add(key: string, value: any): void{
    this.storage.set(key, value);    
  }

  public get(key: string){
    return  this.storage.get(key).then((value) => {
      if(value){
        return value;
      }else{
        return '';
      }
    });
  }

  public remove(key: string): void {
    this.storage.remove(key);
  }

}
