import { Rol } from "./rol.model";

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    activo: boolean;
    rol: Rol;
    creado_en: string;
    actualizado_en: string;
}

export interface UsuarioLogin {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: Rol;
}
