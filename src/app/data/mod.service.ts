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

  modExists(slug: string): Mod | null {
    return this.modList.find(obj => obj.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  add(mod: Mod): void {
    let modExists = this.modExists(mod.slug);
    if (modExists) {
      if (mod.curseForgeId) {
        modExists.curseForgeId = mod.curseForgeId;
      }
      if (mod.modrinthId) {
        modExists.modrinthId = mod.modrinthId;
      }
    } else {
      this.modList.push(mod);
    }

    console.log(this.modList);
  }

  remove(slug: string): void {
    this.modList = this.modList.filter(mod => mod.slug !== slug);
  }
}