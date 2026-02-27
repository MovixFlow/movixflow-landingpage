export interface IGetAllFreightsResponse {
    id: string;
    empresaNome: string;
    tipoCarga: string;
    pesoEstimadoTon: number;
    valorFreteCentavos: number;
    previsaoEntrega: string;
    origemCidade: string;
    origemUf: string;
    destinoCidade: string;
    destinoUf: string;
    visualizacoes: number;
    propostas: number;
    publicadoEm: string;
    telefoneWhatsapp?: string;
    emailOperacional?: string;
    descricaoAdicional?: string;
}
