import { Injectable } from '@angular/core';
import { Mod } from './mod.model';

@Injectable({
  providedIn: 'root',
})
export class ModService {
  private modList: Mod[] = [];

  constructor() {}

  getmodList(): Mod[] {
    return this.modList;
  }

  modExists(name: string): Mod | null {
    return this.modList.find(obj => obj.name.toLowerCase() === name.toLowerCase()) || null;
  }

  add(mod: Mod): void {
    let modExists = this.modExists(mod.name);
    if (modExists) {
      if (modExists.curseForgeId) {
        modExists.curseForgeId = modExists.curseForgeId;
      }
      if (modExists.modrinthId) {
        modExists.modrinthId = modExists.modrinthId;
      }
    } else {
      this.modList.push(mod);
    }
  }

  remove(name: string): void {
    this.modList = this.modList.filter(mod => mod.name !== name);
  }
}