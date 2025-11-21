export interface Rol {
    id:          number;
    nombre:      'admin' | 'organizador' | 'delegado' | 'participante';
    descripcion: string;
}
