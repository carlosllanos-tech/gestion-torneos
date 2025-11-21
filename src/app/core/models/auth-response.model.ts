import { UsuarioLogin } from "./usuario.model";

export interface LoginResponse {
    token: string;
    usuario: UsuarioLogin;
}

export interface LoginRequest {
    email: string;
    password: string
}