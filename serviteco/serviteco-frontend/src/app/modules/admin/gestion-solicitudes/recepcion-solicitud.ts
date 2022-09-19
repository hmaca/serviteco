export class RecepcionSolicitud {
    id: string;
    uuid: string;
    id_producto: string;
    codigo_producto: string;
    serial_producto: string;
    id_marca: string;
    id_tipo_producto: string;
    marca_producto: string;
    propietario_producto: string;
    tipo_recepcion: string;
    nombres: string;
    apellidos: string;
    identificacion: string;
    telefono: string;
    correo: string;
    ciudad: string;
    fecha_ingreso: string;
    horas_uso: string;
    descripcion_falla: string;
    diagnostico_falla: string;
    respuesta: string;
    id_usuario: string;
    nombre_usuario: string;
    id_estado_actual: string;
    estado_actual: string;
    estado: string;
    fecha_sistema: string;
    garantia_aprobada: number;
    respuesta_asignacion: string;
    numero_guia: string;
    transportadora: string;
    creado_por: string;
    id_creador: string;
    nombre_creador: string;
    id_taller: string;
    nombre_taller: string;
    id_referencia: string;
    fecha_ultimo_estado: string;
    lectura_correo: boolean;

    /**
     * Constructor
     *
     * @param quiz
     */
    constructor(quiz?) {
        {
            this.id = quiz?.id || null;
        }
    }
}

export class RecepcionSolicitudEstado {
    id: string;
    estado: string;
    usuario: string;
    cargo: string;
    company: string;
    usuario_asignado: string;
    cargo_asignado: string;
    company_asignado: string;
    respuesta: string;
    fecha_sistema: string;

    /**
     * Constructor
     *
     * @param recepcionSolicitudEstado
     */
    constructor(recepcionSolicitudEstado?) {
        {
            this.id = recepcionSolicitudEstado?.id || null;
        }
    }
}

export class RecepcionSolicitudRepuestos {
    id: string;
    id_recepcion_solicitud: string;
    id_repuesto: string;
    nombre: string;
    cantidad: number;
    valor_unitario: number;
    observaciones: string;
    aprobado: string;
    id_usuario: string;
    usuario: string;
    estado: string;
    fecha_sistema: string;

    /**
     * Constructor
     *
     * @param recepcionSolicitudRepuestos
     */
    constructor(recepcionSolicitudRepuestos?) {
        {
            this.id = recepcionSolicitudRepuestos?.id || null;
        }
    }
}

export class RecepcionSolicitudManoObra {
    id: string;
    id_recepcion_solicitud: string;
    id_mano_obra: string;
    nombre: string;
    cantidad: number;
    valor_unitario: number;
    observaciones: string;
    aprobado: string;
    id_usuario: string;
    usuario: string;
    estado: string;
    fecha_sistema: string;

    /**
     * Constructor
     *
     * @param recepcionSolicitudManoObra
     */
    constructor(recepcionSolicitudManoObra?) {
        {
            this.id = recepcionSolicitudManoObra?.id || null;
        }
    }
}

export class Evidencias {
    id: string;
    imagen: any;
    name: string;
    file: File;

    /**
     * Constructor
     *
     * @param evidencias
     */
    constructor(evidencias?) {
        {
            this.id = evidencias?.id || null;
        }
    }
}

export class PanelSolicitudes {
    creadas: RecepcionSolicitud[];
    enDx: RecepcionSolicitud[];
    enviadas: RecepcionSolicitud[];
    evaluadas: RecepcionSolicitud[];
    asignadas: RecepcionSolicitud[];
}