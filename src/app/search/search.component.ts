import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddedItemsComponent } from '../added-items/added-items.component';
import { FormsModule } from '@angular/forms';
import { Mod } from '../data/mod.model';
import { ModService } from '../data/mod.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AddedItemsComponent, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm: string = '';
  results: any[] = [];
  addedItems: any[] = [];

  constructor(private http: HttpClient, public modService: ModService) { }

  onSearch() {
    const apiUrl = `https://api.curse.tools/v1/cf/mods/search?gameId=432&gameVersions=["1.20.1"]&searchFilter=${this.searchTerm}&sortField=2&sortOrder=desc`;

    this.http.get<any[]>(apiUrl).subscribe(response => {
      this.results = (<any>response).data;
      console.log(this.results);
    });
  }

  addCurseForgeMod(name: string, id: string, img: string) {
    let mod: Mod = { name: name, description: '', img: img, curseForgeId: id, isClientside: true, isRequired: true, isServerSide: true};
    this.modService.add(mod);
  }

  addModrinthMod(name: string, id: string, img: string) {
    let mod: Mod = { name: name, description: '', img: img, modrinthId: id, isClientside: true, isRequired: true, isServerSide: true};
    this.modService.add(mod);
  }

  deleteItem(name: string) {
    this.modService.remove(name);
  }
}
