export interface Mod {
    name: string;
    description: string;
    img?: string;

    curseForgeId?: string;
    modrinthId?: string;

    isClientside: boolean;
    isRequired: boolean;
    isServerSide: boolean;
}